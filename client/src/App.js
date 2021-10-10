import { useState, useEffect, useRef } from "react";
import "./App.css";
import "./Client.css";
import { io } from "socket.io-client";

const dev = process.env.NODE_ENV === 'development';

function App() {
  const [socket, setSocket] = useState(null);

  const [authenticated, setAuthenticated] = useState(false);

  const [gyroAllowed, setGyroAllowed] = useState(false);
  const [gyroData, setGyroData] = useState(null);
  const [endGame, setEndGame] = useState(false);
  const [finishScore, setFinishScore] = useState(undefined);

  const [dismiss, setDismiss] = useState(null);

  const gyroRef = useRef(gyroData);

  const setGyroState = (data) => {
    gyroRef.current = data;
    setGyroData(data);
  };


  useEffect(() => {
    const newSocket = io(dev ? "https://" + document.location.hostname + ":8080" : "https://" + document.location.hostname);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

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
      socket.on("doneOnboarding", (bool) => {
        setEndGame(true);
      })
    };

  const authenticate = () => {
    if (!socket) return;

    socket.emit("authorization", "client");
    socket.on("joined", () => {
      console.log("joined");
      setAuthenticated(true);

      // startGyro();
    });

    socket.on("dismiss available", (product) => setDismiss(product));
    socket.on("finishScore", (finishScore) => {
      setFinishScore(finishScore)
    })
  };

  const startGyro = () => {
    if (typeof DeviceOrientationEvent?.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission()
        .then((state) => {
          if (state === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
            setGyroAllowed(true);
            socket.emit("grantedGyro", true)
            authenticate();
          }
        })
        .catch((e) => console.error(e));
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
      setGyroAllowed(true);
      socket.emit("grantedGyro", true)
      authenticate();
    }
  };


  return (
    <main>
      <div className="titleTopBar">Burger OverFlow</div>
      <div className="mainContainer">
      {finishScore == undefined ?
        <div className="buttonContainer">
          {!authenticated ? (
            <>
              <button className="authButton" onClick={startGyro}>
                Click to start the game
              </button>
            </>
          ) : (
            <>
            <div className="authMessage">You are authenticated ✓</div>
            {(!gyroAllowed && !gyroData) ?
              <button className="gyroButton" onClick={startGyro}>Start gyro</button>
              :
              <>
              <div className="gyroData">
                <b>Gyro sensor feedback</b>
                <br />{
                  gyroData ?
                    <div>
                      <b>Alpha:</b> {Math.round(gyroData.alpha)}
                      <br /><b>Beta:</b> {Math.round(gyroData.beta)}
                      <br /><b>Gamma:</b> {Math.round(gyroData.gamma)}
                      <br />
                      <button onClick={() => handleOrientation(0, 0, 0)}>Re-calibrate</button>
                    </div>

                    : <div>No input - for desktop, please use the <a href="https://developer.chrome.com/docs/devtools/device-mode/#orientation">Web Tools simulation</a>
                    </div>

                }
              </div>
              <div>
                <div className="buttonGroup">
                  {endGame ? 
                  <>
                  <button className="nextAdButton"
                  onClick={() => socket.emit("endGame")}
                  >
                    <span className="frontButton">
                      End game
                    </span>
                  </button>
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
                  </>
                  :<button className="nextAdButton" onClick={nextAd}>
                    <span className="frontButton">
                      Next
                    </span>
                  </button>}
                </div>
              </div>
              </>
              }
            </>
          )}
          </div>
          :
          <div className="finishScreen">
          Congratulations! Your discount is {finishScore/10}
          </div>
          }
        </div>
    </main>
  );
}

export default App;
