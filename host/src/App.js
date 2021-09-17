import { useState, useEffect } from "react";
import "./App.css";
import { io } from "socket.io-client";
import GameContainer from "./components/GameContainer";

function App() {
  const [socket, setSocket] = useState(null);

  const [authenticated, setAuthenticated] = useState(false);

  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

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
        <GameContainer socket={socket} />
      )}

      {error ? <p style={{ color: "red" }}>{error}</p> : ""}
    </main>
  );
}

export default App;
