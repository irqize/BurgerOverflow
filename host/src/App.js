import { useState, useEffect } from "react";
import "./App.css";
import { io } from "socket.io-client";
import GameContainer from "./components/GameContainer";
import SplashScreen from "./components/SplashScreen";

const dev = process.env.NODE_ENV === 'development';

function App() {
  const [socket, setSocket] = useState(null);

  const [authenticated, setAuthenticated] = useState(false);

  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const [userConnected, setUserConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(dev ? "https://" + document.location.hostname + ":8080" : "https://" + document.location.hostname);
    setSocket(newSocket);

    newSocket.on("error", (e) => setError(e));
    newSocket.on('connect', () => {
      console.log('connection')

      newSocket.on("joined", (role) => {
        console.log("joined", role);
        setError(null);
        setAuthenticated(true);
      });

      newSocket.on("user", state => {
        console.log(state)
        if(state === "connected") setUserConnected(true);
        else setUserConnected(false);
      })

      setTimeout(() => newSocket.emit("authorization", "host", 'password'), 100);
    });

    return () => newSocket.close();
  }, []);

  const authenticate = () => {
    if (!socket) return;

    socket.emit("authorization", "host", password);
    
  };


  return (
    <main>
      {!authenticated ? (
        <>
          <input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={authenticate}>Authenticate</button>
        </>
      ) : (
          userConnected ? <GameContainer socket={socket} />: <SplashScreen />
      )}

      {error ? <p style={{ color: "red" }}>{error}</p> : ""}
    </main>
  )
  
}

export default App;
