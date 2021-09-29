import { useState, useEffect, useRef } from "react";
import "./App.css";
import "./Client.css";
import { io } from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);

  const [authenticated, setAuthenticated] = useState(false);

  const [gyroAllowed, setGyroAllowed] = useState(false);
  const [gyroData, setGyroData] = useState(null);
  const [difference, setDifference] = useState(0)
  const [prevGamma, setPrevGamma] = useState(0)

  const gyroRef = useRef(gyroData)

  const setMyState = (data) => {
    gyroRef.current = data
    setGyroData(data)
  }


  useEffect(() => {
    const newSocket = io("https://" + document.location.hostname + ":8080");
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

  const handleOrientation = ({ alpha, beta, gamma }) => {
    console.log("_______handleOrientation incoming gamma:", gamma)
    

    if (gyroRef.current !== null) {
      //initial state
      console.log("gyroRef.current", gyroRef.current)
      var deltaGamma = Math.abs(gamma - gyroRef.current.gamma);

      console.log("deltaGamma", deltaGamma)
      // var deltaGamma = Math.abs(gamma-0);
      if (deltaGamma < 50) {
        //above this is when the sensor switches quickly at end range
        setMyState({ alpha, beta, gamma });

        socket.emit('data', { alpha, beta, gamma })
      } 
      // setDifference(deltaGamma)
    } else {
      setMyState({ alpha, beta, gamma });

      socket.emit('data', { alpha, beta, gamma })
    }
    
    // setGyroData({alpha, beta, gamma});
    // socket.emit('data', {alpha, beta, gamma})

  };

  const handleOrientation2 = () => {
    window.removeEventListener("deviceorientation");
    window.addEventListener("deviceorientation", handleOrientation);
  };


  const startGyro = () => {
    if (typeof DeviceOrientationEvent?.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission()
        .then((state) => {
          if (state === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
            setGyroAllowed(true);
          }
        })
        .catch((e) => console.error(e));
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
      // document.body.addEventListener("deviceorientation", handleOrientation);
      setGyroAllowed(true);
    }

  };

  const authenticate = () => {
    if (!socket) return;

    socket.emit("authorization", "client");
    socket.on("joined", () => {
      console.log("joined");
      setAuthenticated(true);

      // startGyro();
    });
  };

  const recalibrate = () => {

    window.removeEventListener('deviceorientation')

  };


  return (
    <main>
      <div className="titleTopBar" >
        Burger OverFlow
      </div>
      <div className="mainContainer">
        <div className="buttonContainer">
          {!authenticated ? (
            <>
              <button className="authButton" onClick={authenticate} >Click to authenticate</button>
            </>
          ) : (
            <div className="authMessage">You are authenticated ✓</div>
          )}

          <div>
            {(!gyroAllowed && !gyroData) ?
              <button className="gyroButton" onClick={startGyro}>Start gyro</button>
              :
              <div className="gyroData">
                <b>Gyro sensor feedback</b>
                <br />{
                  gyroData ?
                    <div>
                      <b>Alpha:</b> {Math.round(gyroData.alpha)}
                      <br /><b>Beta:</b> {Math.round(gyroData.beta)}
                      <br /><b>Gamma:</b> {Math.round(gyroData.gamma)}
                      <br /><b>PrevGamma:</b> {Math.round(prevGamma)}
                      <br />
                      <br /><b>difference:</b> {(difference)}
                      <br />
                      {/* <button onClick={()=>handleOrientation2}>Re-calibrate</button> */}

                    </div>

                    : <div>No input - for desktop, please use the <a href="https://developer.chrome.com/docs/devtools/device-mode/#orientation">Web Tools simulation</a>
                    </div>

                }
              </div>}



          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
