import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";

const ENDPOINT = process.env.REACT_APP_ENDPOINT;

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("chat message", (msg) => {
      console.log("Received message: ", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input) {
      const socket = socketIOClient(ENDPOINT);
      socket.emit("chat message", input);
      setInput("");
    }
  };

  return (
    <div className="App">
      <h2>Chat application using sockets</h2>
      <ul id="messages">
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form id="form" onSubmit={handleSubmit}>
        <input
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
        />
        <button>Send</button>
      </form>
    </div>
  );
}

export default App;
