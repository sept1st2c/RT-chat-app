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
  const [typingUser, setTypingUser] = useState("");
  const [dotCount, setDotCount] = useState(1); // This will represent the number of dots.

  //
  //

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prevCount) => (prevCount % 3) + 1); // This will cycle the count between 1 and 3.
    }, 500);

    // Cleanup: Clear the interval when the component unmounts.
    return () => clearInterval(interval);
  }, []);
  console.log("Socket:", socket);
  if (socket) {
    socket.on("user-typing", (user) => {
      console.log(user, "is typing - received from server");
      console.log("Typing user before:", typingUser);
      setTypingUser(user);
      console.log("Typing user after:", typingUser);
    });
    // socket.emit("stop-typing", username);
    socket.on("user-stop-typing", (user) => {
      console.log(user, "stopped typing - received from server");
      console.log("Typing user before:", typingUser);
      if (typingUser == user) setTypingUser("");
      console.log("Typing user after:", typingUser);
    });
  }

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
      socket.off("user-typing");
      socket.off("user-stop-typing");
    };
    // socket.emit("send-chat-message", "Eevee use tackle");
  }, []);
  ///
  ///

  function writeMessage(e) {
    const curMessage = e.target.value;
    // console.log(message);
    setMessage(curMessage);
    if (curMessage == "") {
      socket.emit("stop-typing", username);
      console.log("Sending stop-typing to server");
    } else {
      socket.emit("typing", username);
      console.log("Sending typing to server");
    }
    // console.log(`${username}: ${curMessage}`);
  }
  console.log("Socket:", socket);
  if (socket) {
    socket.on("user-typing", (user) => {
      console.log(user, "is typing - received from server");
      console.log("Typing user before:", typingUser);
      setTypingUser(user);
      console.log("Typing user after:", typingUser);
    });
    // socket.emit("stop-typing", username);
    socket.on("user-stop-typing", (user) => {
      console.log(user, "stopped typing - received from server");
      console.log("Typing user before:", typingUser);
      if (typingUser == user) setTypingUser("");
      console.log("Typing user after:", typingUser);
    });
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
    <main>
      <h1>ORV ;) </h1>
      <div id="message-container">
        <div className="message right">You joined the chat</div>
        {chat.map((message, index) => {
          return (
            <div key={index} className={"message " + message.dir}>
              {message.user
                ? `${message.user}: ${message.message}`
                : message.message}
            </div>
          );
        })}
        {typingUser && (
          <div className="message left">
            {typingUser} is typing
            {dotCount === 1 ? "." : dotCount === 2 ? ".." : "..."}
          </div>
        )}
      </div>
      <form id="send-container">
        <input
          id="message-input"
          type="text"
          placeholder="Enter Message"
          onChange={writeMessage}
          value={message}
        />
        <button id="send-button" onClick={handleSubmit}>
          Send
        </button>
      </form>
    </main>
  );
}

export default App;
