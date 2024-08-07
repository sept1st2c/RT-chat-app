// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import { useEffect, useState } from "react";
import "./App.css";
import socketioclient from "socket.io-client";

let socket;
const pkmnTrainers = [
  "Ash",
  "Gary",
  "Red",
  "Misty",
  "Dawn",
  "Brock",
  "Lancy",
  "Sarena",
  "Go",
  "May",
];
const ENDPOINT = "http://localhost:3001";

function App() {
  // const [count, setCount] = useState(0);
  const [username] = useState(pkmnTrainers[Math.floor(Math.random() * 10)]);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState("");
  const [dotCount, setDotCount] = useState(1);

  //
  //

  useEffect(() => {
    console.log(username);
    socket = socketioclient(ENDPOINT);
    socket.emit("new-user", username);
    socket.on("user-connected", (user) => {
      setChat((prevChat) => [
        ...prevChat,
        { message: `${user} joined the chat`, dir: "left" },
      ]);
    });

    socket.on("chat-message", (data) => {
      setChat((prevChat) => [
        ...prevChat,
        { user: data.user, message: data.msg, dir: "left" },
      ]);
    });

    socket.on("user-disconnected", (user) => {
      setChat((prevChat) => [
        ...prevChat,
        { message: `${user} disconnected`, dir: "left" },
      ]);
    });

    return () => {
      socket.off("chat-message");
      socket.off("user-connected");

      socket.off("user-disconnected");
    };
  }, []);

  ///
  ///

  function writeMessage(e) {
    const currMessage = e.target.value;
    setMessage(currMessage);
    // console.log(currMessage)
  }

  //

  function handleSubmit(e) {
    e.preventDefault();
    setChat((prevChat) => [
      ...prevChat,
      { user: "you", message: message, dir: "right" },
    ]);

    socket.emit("send-chat-message", message);
    setMessage("");
  }
  return (
    <>
      <h1>Chat app</h1>
      <div className="message-container">
        <div className="message right">you joined the chat</div>
        <div className="message left">Mimic Tear joined the chat</div>
      </div>
      <div className="send-container">
        <input
          type="text"
          placeholder="Enter message"
          value={message}
          onChange={writeMessage}
        />
        <button onClick={handleSubmit}>Send</button>
      </div>
    </>
  );
}

export default App;
