import React from "react";
import GuideNavBar from "./GuideNavBar";
import { Outlet } from "react-router-dom";
import MyBidsList from "./Components/myCurrentBids";
import ChatBoxEmbedded from "../Common/chatboxImbeded";
import ChatBox from "../Common/ChatBox";


const GuideDashboard = ({ onLogout }) => {
  const userData = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-10 font-sans">
      <GuideNavBar user={userData} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Page content */}
        <div className="lg:col-span-8">
          <Outlet />
        </div>

        {/* RIGHT: Bids & Messages */}
        <aside className="lg:col-span-4 space-y-8">
          {/* My Current Offers */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-4 ml-2">
              My Current Offers
            </h3>
            <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] py-6 min-h-64 flex flex-col items-center justify-start hover:border-white/10 transition-colors overflow-hidden">
              <MyBidsList />
            </div>
          </div>

          {/* Embedded Chat */}
          <div className="h-[650px] w-full rounded-[2.5rem] overflow-hidden border border-white/5">
            <ChatBox currentUser={userData} embedded />
          </div>
        </aside>
      </main>
    </div>
  );
};

export default GuideDashboard;