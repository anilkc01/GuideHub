import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, ChevronLeft, Check, X } from "lucide-react";
import api from "../../api/axios";
import { useSocket } from "../../hooks/useSocket";

const ConversationItem = ({ convo, isSelected, isOnline, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left hover:bg-white/5 ${
      isSelected ? "bg-white/5 border-l-2 border-emerald-500" : "border-l-2 border-transparent"
    }`}
  >
    <div className="relative flex-shrink-0">
      {convo.partner.dp ? (
        <img 
          src={`http://localhost:5002/${convo.partner.dp}`} 
          className="w-11 h-11 rounded-full object-cover" 
          alt={convo.partner.fullName} 
        />
      ) : (
        <div className="w-11 h-11 rounded-full bg-zinc-700 flex items-center justify-center text-white text-sm font-bold">
          {convo.partner.fullName?.[0]?.toUpperCase()}
        </div>
      )}
      {isOnline && (
        <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-900" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-white truncate">{convo.partner.fullName}</p>
      <p className="text-[10px] text-zinc-500 truncate mt-0.5">
        {convo.lastMessage || "Say hello!"}
      </p>
    </div>
    {convo.isUnread && <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />}
  </button>
);

const MessageBubble = ({ msg, isMine }) => (
  <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
      isMine 
        ? "bg-emerald-500 text-black rounded-br-sm" 
        : "bg-zinc-800 text-white rounded-bl-sm"
    }`}>
      {msg.content}
      <div className="flex items-center justify-end mt-1 gap-1">
         <span className="text-[9px] opacity-50 uppercase">
           {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
         </span>
         {isMine && <Check size={10} className="opacity-60" />}
      </div>
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-zinc-800 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
    </div>
  </div>
);

const ChatBox = ({ currentUser, autoSelect, embedded = false }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { socket, onlineUsers } = useSocket(currentUser?.id);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  const fetchConversations = () =>
    api.get("/chat/conversations").then((r) => setConversations(r.data)).catch(console.error);

  useEffect(() => { fetchConversations(); }, []);

  // Handle auto-selection (e.g., from Profile page)
  useEffect(() => {
    if (!autoSelect?.partner) return;
    const existing = conversations.find((c) => Number(c.partner.id) === Number(autoSelect.partner.id));
    setSelectedChat(existing ?? { partner: autoSelect.partner, lastMessage: "", isUnread: false });
    if (!embedded) setIsOpen(true);
  }, [autoSelect, conversations]);

  // Load messages when chat is selected
  useEffect(() => {
    if (!selectedChat) return;
    api.get(`/chat/messages/${selectedChat.partner.id}`)
       .then((r) => setMessages(r.data))
       .catch(console.error);
    api.patch(`/chat/messages/read/${selectedChat.partner.id}`).catch(console.error);
  }, [selectedChat]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const onMessage = (msg) => {
      // CRITICAL: Convert IDs to Numbers for reliable comparison
      const isCurrentChat = Number(selectedChat?.partner.id) === Number(msg.senderId);
      
      if (isCurrentChat) {
        setMessages((prev) => [...prev, msg]);
        api.patch(`/chat/messages/read/${msg.senderId}`).catch(console.error);
      }
      fetchConversations();
    };

    const onTyping = ({ senderId }) => {
      if (Number(selectedChat?.partner.id) === Number(senderId)) {
        setIsTyping(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 3000);
      }
    };

    socket.on("newMessage", onMessage);
    socket.on("userTyping", onTyping);

    return () => { 
      socket.off("newMessage", onMessage); 
      socket.off("userTyping", onTyping); 
    };
  }, [socket, selectedChat]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedChat || !socket) return;
    const payload = { 
      senderId: currentUser.id, 
      receiverId: selectedChat.partner.id, 
      content: newMessage.trim() 
    };
    
    socket.emit("sendMessage", payload);
    
    // Optimistic UI update
    setMessages((prev) => [...prev, { ...payload, createdAt: new Date(), id: Date.now() }]);
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { 
        e.preventDefault(); 
        handleSend(); 
    }
  };

  const handleTypingEmit = (e) => {
    setNewMessage(e.target.value);
    if (socket && selectedChat) {
      socket.emit("typing", { 
        receiverId: selectedChat.partner.id, 
        senderId: currentUser.id 
      });
    }
  };

  const isOnline = (id) => onlineUsers.includes(id?.toString());

  // ── UI Panel ──────────────────────────────────────────────────────────────
  const panel = (
    <div className="h-full w-full flex overflow-hidden bg-zinc-900">

      {/* LEFT sidebar — Hide when chat is selected */}
      <div className={`flex-shrink-0 flex flex-col w-full transition-all duration-300 ${
        selectedChat ? "hidden" : "flex"
      }`}>
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <p className="text-sm font-black text-white uppercase tracking-tighter">GuideHub Messages</p>
          <MessageSquare size={16} className="text-zinc-500" />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-zinc-700 py-10">
              <MessageSquare size={30} strokeWidth={1} />
              <p className="text-[10px] uppercase font-bold tracking-widest">Inbox is empty</p>
            </div>
          ) : (
            conversations.map((c) => (
              <ConversationItem
                key={c.partner.id}
                convo={c}
                isSelected={selectedChat?.partner.id === c.partner.id}
                isOnline={isOnline(c.partner.id)}
                onClick={() => setSelectedChat(c)}
              />
            ))
          )}
        </div>
      </div>

      {/* RIGHT — Chat Thread — Full width when active */}
      <div className={`flex-1 flex flex-col min-w-0 ${!selectedChat ? "hidden" : "flex"}`}>
        {selectedChat && (
          <>
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3 flex-shrink-0">
              <button 
                onClick={() => setSelectedChat(null)} 
                className="p-1.5 -ml-1 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="relative">
                {selectedChat.partner.dp ? (
                  <img 
                    src={`http://localhost:5002/${selectedChat.partner.dp}`} 
                    className="w-9 h-9 rounded-full object-cover" 
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-white text-xs font-bold">
                    {selectedChat.partner.fullName?.[0]?.toUpperCase()}
                  </div>
                )}
                {isOnline(selectedChat.partner.id) && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-900" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-none truncate">{selectedChat.partner.fullName}</p>
                <p className={`text-[10px] mt-1 ${isTyping ? "text-emerald-400" : "text-zinc-500"}`}>
                  {isTyping ? "typing..." : isOnline(selectedChat.partner.id) ? "Active now" : "Offline"}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-zinc-900/50">
              {messages.map((m, i) => (
                <MessageBubble key={m.id ?? i} msg={m} isMine={Number(m.senderId) === Number(currentUser.id)} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="px-4 py-3 border-t border-white/5 flex items-center gap-2 flex-shrink-0">
              <input
                value={newMessage}
                onChange={handleTypingEmit}
                onKeyDown={handleKeyDown}
                placeholder={`Message...`}
                className="flex-1 bg-zinc-800 text-sm text-white placeholder:text-zinc-600 px-4 py-2.5 rounded-xl border border-white/5 focus:outline-none focus:border-emerald-500/40 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="p-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed text-black rounded-xl transition-all"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (embedded) return <div className="h-full w-full rounded-2xl overflow-hidden border border-white/5">{panel}</div>;

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden shadow-2xl border border-white/10 bg-zinc-900 ${
      isOpen ? "w-[380px] sm:w-[420px] h-[580px] rounded-[2rem]" : "w-14 h-14 rounded-full"
    }`}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)} 
          className="w-full h-full flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
        >
          <MessageSquare size={24} />
        </button>
      ) : (
        <div className="h-full w-full relative">
          <button 
            onClick={() => setIsOpen(false)} 
            className="absolute top-4 right-4 z-20 text-zinc-500 hover:text-white bg-zinc-900/50 rounded-full p-1 transition-colors"
          >
            <X size={16} />
          </button>
          {panel}
        </div>
      )}
    </div>
  );
};

export default ChatBox;