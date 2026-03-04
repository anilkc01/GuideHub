import React, { useState } from "react";
import GuideNavBar from "./GuideNavBar";
import { Outlet } from "react-router-dom";
import MyBidsList from "./Components/myCurrentBids";
import ChatBox from "../Common/ChatBox";
import { MessageCircle, X } from "lucide-react";

const GuideDashboard = ({ onLogout }) => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const panelHeight = "h-[85vh]";
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-sans">
      <GuideNavBar user={userData} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-6 pt-28 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT Panel: Explore / Outlet */}
        <div className={`lg:col-span-8 ${panelHeight} overflow-y-auto custom-scrollbar pr-2`}>
          <Outlet />
        </div>

        {/* RIGHT Panel: Bids & Chat — desktop only */}
        <aside className={`hidden lg:flex lg:col-span-4 ${panelHeight} flex-col ml-4 gap-6`}>
          {/* Top Section: Bids */}
          <div className="flex-shrink-0">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 ml-4">
              My Current Offers
            </h3>
            <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-4 h-[250px] overflow-y-auto custom-scrollbar">
              <MyBidsList />
            </div>
          </div>

          {/* Bottom Section: Chat */}
          <div className="flex-1 flex flex-col min-h-0">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 ml-4">
              Messages
            </h3>
            <div className="flex-1 bg-zinc-900/40 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
              <ChatBox currentUser={userData} embedded />
            </div>
          </div>
        </aside>
      </main>

      {/* ── Mobile Chat Bubble — visible only on mobile ── */}
      <div className="lg:hidden">
        {/* Floating Bubble Button */}
        <button
          onClick={() => setIsMobileChatOpen(true)}
          className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full shadow-2xl shadow-emerald-500/30 flex items-center justify-center transition-all ${isMobileChatOpen ? "opacity-0 pointer-events-none scale-75" : "opacity-100 scale-100"}`}
        >
          <MessageCircle size={22} />
        </button>

        {/* Expanded Chat Panel */}
        <div
          className={`fixed inset-0 z-50 flex flex-col bg-black transition-all duration-300 ${
            isMobileChatOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-full pointer-events-none"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-12 pb-4 border-b border-white/10">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
              Messages
            </h3>
            <button
              onClick={() => setIsMobileChatOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Chat fills remaining space */}
          <div className="flex-1 overflow-hidden">
            <ChatBox currentUser={userData} embedded />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDashboard;