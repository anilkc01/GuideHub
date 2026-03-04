import React, { useEffect, useState } from "react";
import TrekkerNavBar from "./TrekkerNavBar";
import { PlusCircle, BadgeCheck, MapPin, MessageCircle, X } from "lucide-react";
import PlanTrekForm from "./components/PlanTrip";
import MyActivePlans from "./components/ActivePlansList";
import MyTrips from "./components/myTripsList";
import api from "../../api/axios";
import ChatBox from "../Common/ChatBox";

const TrekkerDashboard = ({ onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [stats, setStats] = useState({
    openPlans: 0,
    upcomingTrips: 0,
    completedTreks: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const userData = JSON.parse(localStorage.getItem("user"));
  const panelHeight = "h-[85vh]";

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/user/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Stats fetch failed");
    } finally {
      setLoadingStats(false);
    }
  };

  const handlePlanSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    fetchStats();
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      <div className="shrink-0">
        <TrekkerNavBar user={userData} onLogout={onLogout} />
      </div>

      <PlanTrekForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={handlePlanSuccess}
      />

      <main className="flex-1 min-h-0 max-w-7xl w-full mx-auto px-6 mt-28 mb-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT Panel */}
        <div
          className={`lg:col-span-8 ${panelHeight} overflow-y-auto custom-scrollbar pr-4 space-y-8`}
        >
          {/* Hero Banner */}
          <div className="relative h-60 rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-900/50 group shrink-0">
            <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent z-10" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-center">
              <header className="mb-6">
                <h2 className="text-4xl lg:text-5xl font-serif font-medium">
                  Where to next, {userData.fullName.split(" ")[0]}?
                </h2>
                <p className="text-zinc-400 mt-2 text-lg">
                  Post your plan and pick the right guide yourself.
                </p>
              </header>
              <button
                className="w-fit bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <PlusCircle size={20} />
                Post New Plan
              </button>
            </div>
            <div className="absolute inset-0 bg-[url('/src/assets/boxbg.jpg')] bg-cover bg-center opacity-70 group-hover:scale-110 transition-transform duration-700" />
          </div>

          
          {/* Plans & Trips Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 mb-5">
            {/* My Active Plans */}
            <div className="p-6 bg-zinc-900/40 rounded-3xl border border-white/5 flex flex-col min-h-0">
              <h3 className="text-xl font-semibold mb-6 italic opacity-80 font-serif">
                My Active Plans
              </h3>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <MyActivePlans refreshTrigger={refreshTrigger} />
              </div>
            </div>

            {/* My Trips */}
            <div className="p-6 bg-zinc-900/40 rounded-3xl border border-white/5 flex flex-col min-h-0">
              <h3 className="text-xl font-semibold mb-6 italic opacity-80 font-serif">
                My Trips
              </h3>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <MyTrips />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT Panel: desktop only */}
        <aside
          className={`hidden lg:flex lg:col-span-4 ${panelHeight} flex-col ml-4 gap-6 overflow-hidden pb-2`}
        >
          {/* Stats Card */}
          <div className="shrink-0 p-6 bg-zinc-900/40 rounded-4xl border border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 ml-1">
              Your Journey
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  label: "Total Completed",
                  val: stats.completedTreks,
                  color: "emerald",
                  icon: <BadgeCheck size={18} />,
                },
                {
                  label: "Open Plans",
                  val: stats.openPlans,
                  color: "blue",
                  icon: <PlusCircle size={18} />,
                },
                {
                  label: "Upcoming Trips",
                  val: stats.upcomingTrips,
                  color: "purple",
                  icon: <MapPin size={18} />,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-3 bg-zinc-800/30 rounded-xl border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <p
                      className={`text-[9px] font-black uppercase tracking-widest text-${item.color}-500/60`}
                    >
                      {item.label}
                    </p>
                    <h4 className="text-2xl font-bold leading-tight">
                      {loadingStats ? "..." : item.val}
                    </h4>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-lg bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-500`}
                  >
                    {item.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
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
          className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full shadow-2xl shadow-emerald-500/30 flex items-center justify-center transition-all duration-300 ${
            isMobileChatOpen
              ? "opacity-0 pointer-events-none scale-75"
              : "opacity-100 scale-100"
          }`}
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

export default TrekkerDashboard;
