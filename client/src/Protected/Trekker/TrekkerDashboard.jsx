import { useNavigate } from "react-router-dom";
import TrekkerNavBar from "./TrekkerNavBar";
import { PlusCircle, BadgeCheck, MapPin } from "lucide-react";
import PlanTrekForm from "./components/PlanTrip";
import { useEffect, useState } from "react";
import MyActivePlans from "./components/ActivePlansList";
import MyTrips from "./components/myTripsList";
import api from "../../api/axios";
import ChatBox from "../Common/ChatBox";


const TrekkerDashboard = ({ onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    openPlans: 0,
    upcomingTrips: 0,
    completedTreks: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const userData = JSON.parse(localStorage.getItem("user"));

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

  return (
    // Added pt-24 (96px) to ensure content starts below the fixed navbar
    <div
      className={`min-h-screen bg-black text-white pt-24 sm:pt-28 transition-all duration-500 ${isModalOpen ? "opacity-90 scale-100" : "opacity-100 scale-100"}`}
    >
      <TrekkerNavBar user={userData} onLogout={onLogout} />

      <PlanTrekForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <main className="px-6 lg:px-10 max-w-400 mx-auto">
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Areas */}
          <div className="lg:col-span-8 space-y-8">
            {/* Large Hero Banner Section */}
            <div className="relative h-60 rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-900/50 group">
              <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent z-10" />
              <div className="relative z-20 p-8 h-full flex flex-col justify-center">
                <header className="mb-10">
                  <h2 className="text-4xl lg:text-5xl font-serif font-medium">
                    Where to next, {userData.fullName.split(" ")[0]} ?
                  </h2>
                  <p className="text-zinc-400 mt-2 text-lg">
                    Your dream Himalayan adventure starts here.
                    <br />
                    Post your plan, customize your trip, and pick the right
                    guide yourself.
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
              {/* Background image placeholder */}
              <div className="absolute inset-0 bg-[url('/src/assets/boxbg.jpg')] bg-cover bg-center opacity-70 group-hover:scale-110 transition-transform duration-700" />
            </div>

            <div className="grid h-max grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-zinc-900/50 rounded-3xl border border-white/5 min-h-80 lg:min-h-0 h-auto lg:h-125 flex flex-col">
                <h3 className="text-xl font-semibold mb-6 italic opacity-80 font-serif">
                  My Active Plans
                </h3>
                <MyActivePlans />
              </div>
              <div className="p-6 bg-zinc-900/50 rounded-3xl border border-white/5 h-64">
                <h3 className="text-xl font-semibold mb-4 italic opacity-80 font-serif">
                  My Trips
                </h3>
                <MyTrips />
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="p-6 bg-zinc-900/50 rounded-[2rem] border border-white/5">
              <h3 className="text-lg font-bold mb-4 font-serif italic">
                Your Journey
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {/* Completed Treks */}
                <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex items-center justify-between group hover:bg-emerald-500/10 transition-all">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500/60">
                      Total Completed
                    </p>
                    <h4 className="text-2xl font-bold leading-tight">
                      {loadingStats ? "..." : stats.completedTreks}
                    </h4>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <BadgeCheck size={20} />
                  </div>
                </div>

                {/* Active Plans */}
                <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 flex items-center justify-between group hover:bg-blue-500/10 transition-all">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-500/60">
                      Open Plans
                    </p>
                    <h4 className="text-2xl font-bold leading-tight">
                      {loadingStats ? "..." : stats.openPlans}
                    </h4>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <PlusCircle size={20} />
                  </div>
                </div>

                {/* Upcoming Trips */}
                <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10 flex items-center justify-between group hover:bg-purple-500/10 transition-all">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-purple-500/60">
                      Upcoming Trips
                    </p>
                    <h4 className="text-2xl font-bold leading-tight">
                      {loadingStats ? "..." : stats.upcomingTrips}
                    </h4>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <MapPin size={20} />
                  </div>
                </div>
              </div>
            </div>

           <div className="h-[650px] w-full rounded-4xl overflow-hidden border border-white/5">
              <ChatBox currentUser={userData} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default TrekkerDashboard;
