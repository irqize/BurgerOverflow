import { useState, useEffect, useRef } from "react";
import "./App.css";
import "./Client.css";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const URL = "https://" + document.location.hostname + ":8080";

export const STAGES = {
  INSTRUCTION1: 1,
  INSTRUCTION2: 2,
  TRY_OUT: 3,
  GAME: 4,
  END_SCREEN: 5,
};

function App() {
  const [socket, setSocket] = useState(null);

  const [authenticated, setAuthenticated] = useState(false);

  const [gyroAllowed, setGyroAllowed] = useState(false);
  const [gyroData, setGyroData] = useState(null);

  const [finishScore, setFinishScore] = useState();

  const [dismiss, setDismiss] = useState(null);

  const [discountCode, setDiscountCode] = useState();

  const [disconnected, setDisconnected] = useState(false);

  const [error, setError] = useState(null);

  const [currentStage, setCurrentStage] = useState(null);
  console.log(currentStage);

  const gyroRef = useRef(gyroData);

  const setGyroState = (data) => {
    gyroRef.current = data;
    setGyroData(data);
  };

  useEffect(() => {
    const generateNewSocket = () => {
      const newSocket = io(URL);

      newSocket.on("disconnect", () => {
        setDisconnected(true);
        setAuthenticated(false);
        setFinishScore();
        setDismiss(null);
        setCurrentStage(0);

        setSocket(generateNewSocket());
      });

      newSocket.on("game stage", setCurrentStage);

      newSocket.on("error", (e) => setError(e));

      return newSocket;
    };

    const newSocket = generateNewSocket();

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    setDiscountCode(uuidv4().slice(4, 12));
  }, [finishScore]);

  const handleOrientation = ({ alpha, beta, gamma }) => {
    if (gyroRef.current !== null) {
      //initial state
      var deltaGamma = Math.abs(gamma - gyroRef.current.gamma);

      console.log("deltaGamma", deltaGamma);
      if (deltaGamma < 50) {
        //above this is when the sensor switches quickly at end range
        setGyroState({ alpha, beta, gamma });

        socket.emit("data", { alpha, beta, gamma });
      }
    } else {
      setGyroState({ alpha, beta, gamma });

      socket.emit("data", { alpha, beta, gamma });
    }
  };

  const nextAd = () => {
    socket.emit("skipAhead", true);
  };

  const authenticate = () => {
    if (!socket) return;

    socket.emit("authorization", "client");
    socket.on("joined", () => {
      console.log("joined");
      setAuthenticated(true);
    });

    socket.on("dismiss available", (product) => setDismiss(product));
    socket.on("finishScore", (finishScore) => {
      setFinishScore(finishScore);
    });
  };

  const startGyro = () => {
    if (
      typeof window?.DeviceOrientationEvent?.requestPermission === "function"
    ) {
      DeviceOrientationEvent.requestPermission()
        .then((state) => {
          if (state === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
            setGyroAllowed(true);
            socket.emit("grantedGyro", true);
            authenticate();
          }
        })
        .catch((e) => console.error(e));
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
      setGyroAllowed(true);
      socket.emit("grantedGyro", true);
      authenticate();
    }
  };

  const startScreen = (
    <>
      {disconnected && <h2>You have been disconnected</h2>}
      {error && <h2>{error}</h2>}
      <button className="authButton" onClick={startGyro}>
        Click to start the game
      </button>
    </>
  );

  return (
    <main>
      <div className="titleTopBar">Burger OverFlow</div>
      <div className="mainContainer">
        {currentStage !== STAGES.END_SCREEN && (
          <div className="buttonContainer">
            {!authenticated && startScreen}
            {authenticated && (
              <>
                <div className="authMessage">You are authenticated ✓</div>
                {!gyroAllowed && !gyroData ? (
                  <button className="gyroButton" onClick={startGyro}>
                    Start gyro
                  </button>
                ) : (
                  <>
                    <div className="gyroData">
                      <b>Gyro sensor feedback</b>
                      <br />
                      {gyroData ? (
                        <div>
                          <b>Alpha:</b> {Math.round(gyroData.alpha)}
                          <br />
                          <b>Beta:</b> {Math.round(gyroData.beta)}
                          <br />
                          <b>Gamma:</b> {Math.round(gyroData.gamma)}
                          <br />
                        </div>
                      ) : (
                        <div>
                          No input - for desktop, please use the{" "}
                          <a href="https://developer.chrome.com/docs/devtools/device-mode/#orientation">
                            Web Tools simulation
                          </a>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="buttonGroup">
                        {currentStage === STAGES.GAME && (
                          <div className="buttonGroup">
                            {dismiss && (
                              <button
                                className="nextAdButton"
                                onClick={() => socket.emit("dismiss")}
                              >
                                <span className="frontButton">
                                  Click to dismiss {dismiss}
                                </span>
                              </button>
                            )}
                          </div>
                        )}
                        {(currentStage === STAGES.INSTRUCTION1 ||
                          currentStage === STAGES.INSTRUCTION2) && (
                          <button className="nextAdButton" onClick={nextAd}>
                            <span className="frontButton">Next</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
        {currentStage === STAGES.END_SCREEN && (
          <div className="finishScreen">
            {finishScore > 0 ? (
              <div>
                Congratulations! Your discount is {finishScore / 10} SEK
              </div>
            ) : (
              <div>Try again!</div>
            )}
            {finishScore > 0 && <div>Your discount code is {discountCode}</div>}
            <div
              className="resetButton"
              onClick={() => {
                socket.emit("reset");
                setFinishScore();
              }}
            >
              Reset
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
