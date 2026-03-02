import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, ChevronLeft, Check } from "lucide-react";
import api from "../../api/axios";
import { useSocket } from "../../hooks/useSocket";

// ─── Conversation List Item ───────────────────────────────────────────────────
const ConversationItem = ({ convo, isSelected, isOnline, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left ${
      isSelected ? "bg-white/5 border-l-2 border-emerald-500" : "border-l-2 border-transparent"
    }`}
  >
    <div className="relative flex-shrink-0">
      {convo.partner.dp ? (
        <img
          src={`http://localhost:5002/${convo.partner.dp}`}
          className="w-10 h-10 rounded-full object-cover"
          alt={convo.partner.fullName}
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-400 text-sm font-bold">
          {convo.partner.fullName?.[0]?.toUpperCase()}
        </div>
      )}
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-900" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-white truncate">{convo.partner.fullName}</p>
      <p className="text-[10px] text-zinc-500 truncate">{convo.lastMessage || "Start chatting"}</p>
    </div>
    {convo.isUnread && (
      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
    )}
  </button>
);

// ─── Message Bubble ───────────────────────────────────────────────────────────
const MessageBubble = ({ msg, isMine }) => (
  <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
        isMine
          ? "bg-emerald-500 text-black rounded-br-sm"
          : "bg-zinc-800 text-white rounded-bl-sm"
      }`}
    >
      {msg.content}
      {isMine && <Check size={10} className="inline ml-1 opacity-70" />}
    </div>
  </div>
);

// ─── Embedded ChatBox (no floating, fills its container) ─────────────────────
const ChatBoxEmbedded = ({ currentUser, autoSelect }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const { socket, onlineUsers } = useSocket(currentUser?.id);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  // Fetch conversations
  useEffect(() => {
    api.get("/api/chat/conversations").then((res) => setConversations(res.data)).catch(console.error);
  }, []);

  // Auto-select from parent
  useEffect(() => {
    if (!autoSelect?.partner) return;
    const existing = conversations.find((c) => c.partner.id === autoSelect.partner.id);
    setSelectedChat(existing ?? { partner: autoSelect.partner, lastMessage: "", isUnread: false });
  }, [autoSelect]);

  // Fetch messages on chat select
  useEffect(() => {
    if (!selectedChat) return;
    api.get(`/api/chat/messages/${selectedChat.partner.id}`).then((res) => setMessages(res.data)).catch(console.error);
    api.patch(`/api/chat/messages/read/${selectedChat.partner.id}`).catch(console.error);
  }, [selectedChat]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (selectedChat?.partner.id === msg.senderId) {
        setMessages((prev) => [...prev, msg]);
        api.patch(`/api/chat/messages/read/${msg.senderId}`).catch(console.error);
      }
      api.get("/api/chat/conversations").then((res) => setConversations(res.data)).catch(console.error);
    };

    const handleTyping = ({ senderName, senderId }) => {
      if (selectedChat?.partner.id === senderId || selectedChat?.partner.fullName === senderName) {
        setIsTyping(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 3000);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleTyping);
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleTyping);
    };
  }, [socket, selectedChat]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedChat || !socket) return;
    const payload = { senderId: currentUser.id, receiverId: selectedChat.partner.id, content: newMessage.trim() };
    socket.emit("sendMessage", payload);
    setMessages((prev) => [...prev, { ...payload, createdAt: new Date(), status: "sent" }]);
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleTypingEmit = (e) => {
    setNewMessage(e.target.value);
    if (!socket || !selectedChat) return;
    socket.emit("typing", { receiverId: selectedChat.partner.id, senderId: currentUser.id, senderName: currentUser.fullName });
  };

  return (
    <div className="h-full w-full flex flex-col bg-zinc-900/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 flex-shrink-0">
        {selectedChat ? (
          <>
            <button onClick={() => setSelectedChat(null)} className="text-zinc-500 hover:text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            <div>
              <p className="text-sm font-bold text-white">{selectedChat.partner.fullName}</p>
              {isTyping ? (
                <p className="text-[10px] text-emerald-400">typing...</p>
              ) : onlineUsers.includes(selectedChat.partner.id?.toString()) ? (
                <p className="text-[10px] text-emerald-400">Online</p>
              ) : (
                <p className="text-[10px] text-zinc-500">Offline</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm font-bold text-white">Messages</p>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {!selectedChat ? (
          // Conversation list
          <div className="flex-1 overflow-y-auto py-2">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-2">
                <MessageSquare size={28} />
                <p className="text-xs">No conversations yet</p>
              </div>
            ) : (
              conversations.map((c) => (
                <ConversationItem
                  key={c.partner.id}
                  convo={c}
                  isSelected={selectedChat?.partner.id === c.partner.id}
                  isOnline={onlineUsers.includes(c.partner.id?.toString())}
                  onClick={() => setSelectedChat(c)}
                />
              ))
            )}
          </div>
        ) : (
          // Message thread
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <MessageBubble key={m.id ?? i} msg={m} isMine={m.senderId === currentUser.id} />
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 px-4 py-2 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/5 flex items-center gap-2 flex-shrink-0">
              <input
                value={newMessage}
                onChange={handleTypingEmit}
                onKeyDown={handleKeyDown}
                placeholder="Message..."
                className="flex-1 bg-zinc-800 text-sm text-white placeholder:text-zinc-600 px-4 py-2.5 rounded-xl border border-white/5 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="p-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed text-black rounded-xl transition-colors flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatBoxEmbedded;