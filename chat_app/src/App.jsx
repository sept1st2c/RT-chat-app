// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import { useEffect, useState } from "react";
import "./App.css";

const pkmnTrainers = ["Ash", "Gary", "Red", "Misty"];

function App() {
  // const [count, setCount] = useState(0);
  const [username] = useState(
    pkmnTrainers[Math.floor(Math.random() * pkmnTrainers.length)]
  );
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState("");
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    console.log(username);

    return () => {};
  });

  function writeMessage(e) {
    const currMessage = e.target.value;
    setMessage(currMessage);
    // console.log(currMessage)
  }
  function handleSubmit(e) {
    e.preventDefault();
    setChat((prevChat) => [
      ...prevChat,
      { user: "you", message: message, dir: "right" },
    ]);
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
