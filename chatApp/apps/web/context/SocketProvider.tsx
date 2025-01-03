"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}
interface ISocketContext {
  sendMessage: (msg: string) => any;
  messages: { text: string; sender: "me" | "server" }[];
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = (props) => {
  const { children } = props;
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<{ text: string; sender: "me" | "server" }[]>([]);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      console.log("send message", msg);
      if (socket) {
        setMessages((prev) => [...prev, { text: msg, sender: "me" }]);
        socket.emit("event:message", { message: msg });
      }
    },
    [socket]
  );

  const onMessageRec = useCallback((msg: string) => {
    console.log("From Server Msg Rec ", msg);
    const { message } = JSON.parse(msg) as { message: string };
    setMessages((prev) => [...prev, { text: message, sender: "server" }]);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on("message", onMessageRec);
    setSocket(_socket);

    return () => {
      _socket.disconnect();
      _socket.off("message", onMessageRec);
      setSocket(undefined);
    };
  }, []);

  return <SocketContext.Provider value={{ sendMessage, messages }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) {
    throw new Error("state undefined");
  }
  return state;
};
