import { useState, useEffect } from "react";
import "./App.css";
import { io } from "socket.io-client";
import GameContainer from "./components/GameContainer";
import SplashScreen from "./components/SplashScreen";


function App() {
  const [socket, setSocket] = useState(null);

  const [authenticated, setAuthenticated] = useState(false);

  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const [userConnected, setUserConnected] = useState(false);

  useEffect(() => {
    const newSocket = io("https://" + document.location.hostname + ":8080");
    setSocket(newSocket);

    newSocket.on("error", (e) => setError(e));

    return () => newSocket.close();
  }, []);

  const authenticate = () => {
    if (!socket) return;

    socket.emit("authorization", "host", password);
    socket.on("joined", (role) => {
      console.log("joined", role);
      setError(null);
      setAuthenticated(true);

    });

    socket.on("user", state => {
      console.log(state)
      if(state === "connected") setUserConnected(true);
      else setUserConnected(false);
    })
  };


  return (
    // socket ? <GameContainer socket={socket} /> : null);
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

      {/* {socket && <GameContainer socket={socket} />} */}

      {/* {socket && <GameContainer socket={socket} />} */}

      {error ? <p style={{ color: "red" }}>{error}</p> : ""}
    </main>
  )
  
}

export default App;
