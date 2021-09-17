import { useState, useEffect } from "react";
import "./App.css";
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
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
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
      setGyroAllowed(true);
    }
  };

  const authenticate = () => {
    if (!socket) return;

    socket.emit("authorization", "client");
    socket.on("joined", () => {
      console.log("joined");
      setAuthenticated(true);

      startGyro();
    });
  };

  

  return (
    <main>
      {!authenticated ? (
        <>
          <button onClick={authenticate}>Authenticate</button>
        </>
      ) : (
        "Authenticated"
      )}
      {!gyroAllowed && !gyroData && (
        <button onClick={startGyro}>Start gyro</button>
      )}
      {JSON.stringify(gyroData)}
    </main>
  );
}

export default App;
