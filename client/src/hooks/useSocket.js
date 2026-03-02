import { useEffect, useState } from "react";
import io from "socket.io-client";

export const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (userId) {
      // Replace with your backend URL if different
      const newSocket = io("http://localhost:5002", {
        query: { userId },
      });

      setSocket(newSocket);

      // Listen for the online users list from the server
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Cleanup on unmount
      return () => {
        newSocket.close();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [userId]);

  return { socket, onlineUsers };
};