"use client";

import React, { useState } from "react";
import classes from "./page.module.css";
import { useSocket } from "../context/SocketProvider";

const Page = () => {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className={classes["chat-container"]}>
      <header className={classes["chat-header"]}>
        <h1>Chat Application</h1>
      </header>
      <div className={classes["chat-body"]}>
        <div className={classes["messages"]}>
          {messages?.map((msg, index) => (
            <div key={index} className={`${classes["message"]} ${msg.sender === "me" ? classes["own-message"] : ""}`}>
              {msg.text} {/* Render the text property */}
            </div>
          ))}
        </div>
      </div>

      <div className={classes["chat-input-container"]}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={classes["chat-input"]}
          type="text"
          placeholder="Type a message"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage} className={classes["button"]}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Page;
