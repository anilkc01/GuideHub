import React from "react";
import GuideNavBar from "./GuideNavBar";
import ExploreSection from "./Pages/Explore";
import { Outlet, Routes, useNavigate } from "react-router-dom";
import MyBidsList from "./Components/myCurrentBids";
import MyTreksPage from "./Pages/myTreks";

const GuideDashboard = ({ onLogout }) => {
  const userData = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-10 font-sans">
      <GuideNavBar user={userData} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Explore Section (Now strictly layout) */}
        <div className="lg:col-span-8">
         <Outlet />
        </div>

        {/* RIGHT: Bids & Messages */}
        <aside className="lg:col-span-4 space-y-8">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-4 ml-2">
              My Current offers
            </h3>
            <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] py-6 min-h-64 flex flex-col items-center justify-start group hover:border-white/10 transition-colors overflow-hidden">
              {/* RENDER THE LIST HERE */}
              <MyBidsList />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-4 ml-2">
              Messages
            </h3>
            <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] h-80 flex items-center justify-center group hover:border-white/10 transition-colors">
              <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest group-hover:text-zinc-500 transition-colors">
                Inbox empty
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default GuideDashboard;
