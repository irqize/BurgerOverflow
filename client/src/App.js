import { useState, useEffect } from "react";
import "./App.css";
import "./Client.css";
import { io } from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);

  const [authenticated, setAuthenticated] = useState(false);

  const [gyroAllowed, setGyroAllowed] = useState(false);
  const [gyroData, setGyroData] = useState(null);



  useEffect(() => {
    const newSocket = io("https://" + document.location.hostname + ":8080");
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

 
  const handleOrientation = ({alpha, beta, gamma}) => {
    setGyroData({alpha, beta, gamma});
    socket.emit('data', {alpha, beta, gamma})
  };
  

  const startGyro = () => {
    // if (typeof DeviceOrientationEvent.requestPermission === "function") {
    //   DeviceOrientationEvent.requestPermission()
    //     .then((state) => {
    //       if (state === "granted") {
    //         window.addEventListener("deviceorientation", handleOrientation);
    //         setGyroAllowed(true);
    //       }
    //     })
    //     .catch((e) => console.error(e));
    // } else {
      window.addEventListener("deviceorientation", handleOrientation);
      // document.body.addEventListener("deviceorientation", handleOrientation);
      setGyroAllowed(true);
    // }
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
                <br/>{
                  gyroData? 
                  <div>
                    <b>Alpha:</b> {gyroData.alpha} 
                    <br/><b>Beta:</b> {gyroData.beta}
                    <br/><b>Gamma:</b> {gyroData.gamma}
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
