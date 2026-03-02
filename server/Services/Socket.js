import { Server } from "socket.io";
import Message from "../Models/Message.js";

const userSocketMap = new Map(); // userId -> socketId

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
      userSocketMap.set(userId, socket.id);
      // Broadcast to all that this user is online
      io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    }

    // Handle Private Messaging (Instagram Style)
    socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
      try {

        if (!senderId || !receiverId || !content) {
          console.error("Missing fields:", { senderId, receiverId, content });
          return;
        }

        const newMessage = await Message.create({
          senderId,
          receiverId,
          content,
          status: "sent",
        });

        // 2. Get Receiver's Socket ID
        const receiverSocketId = userSocketMap.get(receiverId.toString());

        if (receiverSocketId) {
          // Direct emit to the specific user
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }
      } catch (error) {
        console.error("Socket Message Error:", error);
      }
    });

    // Handle Typing Status
    socket.on("typing", ({ receiverId, senderName }) => {
      const receiverSocketId = userSocketMap.get(receiverId.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", { senderName });
      }
    });

    socket.on("disconnect", () => {
      if (userId) {
        userSocketMap.delete(userId);
        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
      }
    });
  });

  return io;
};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap.get(receiverId);
};
