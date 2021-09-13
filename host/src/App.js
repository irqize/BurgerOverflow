import { useState, useEffect } from "react";
import "./App.css";
import { io } from "socket.io-client";
import GameContainer from "./components/GameContainer";

function App() {
  const [socket, setSocket] = useState(null);

  const [authenticated, setAuthenticated] = useState(false);

  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);

  const [data, setData] = useState(null);


  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    newSocket.on('error', e => setError(e));

    return () => newSocket.close();
  }, []);



  const authenticate = () => {
    if (!socket) return;

    socket.emit("authorization", "host", password);
    socket.on("joined", role => {
      console.log("joined", role);
      setError(null);
      setAuthenticated(true);

      socket.on('data', data => setData(data))

    });
  };

  

  return (
    <main>
      {!authenticated ? (
        <>
          <input value={password} type='password' onChange={(e) => setPassword(e.target.value)} />
          <button onClick={authenticate}>Authenticate</button>
        </>
      ) : (
        <GameContainer/>
      )}

      {error ? <p style={{color: 'red'}}>{error}</p> : ''}
      {data ? <p>{data}</p> : ''}

    </main>
  );
}

export default App;
