import { useNavigate } from "react-router-dom";
import TrekkerNavBar from "./TrekkerNavBar";
import { PlusCircle } from "lucide-react";
import PlanTrekForm from "./components/PlanTrip";
import { useState } from "react";
import MyActivePlans from "./components/ActivePlansList";

const TrekkerDashboard = ({ onLogout }) => {


  const [isModalOpen, setIsModalOpen] = useState(false);



  const userData = JSON.parse(localStorage.getItem("user"));

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
              <div className="absolute inset-0 bg-[url('/src/assets/boxbg.jpg')] bg-cover bg-center opacity-60 group-hover:scale-110 transition-transform duration-700" />
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
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="p-8 bg-zinc-900/50 rounded-4xl border border-white/5 min-h-75">
              <h3 className="text-xl font-bold mb-6">Your Stats</h3>
              <div className="space-y-4">
                <div className="h-20 bg-white/5 rounded-2xl border border-white/5"></div>
                <div className="h-20 bg-white/5 rounded-2xl border border-white/5"></div>
              </div>
            </div>

            <div className="p-8 bg-zinc-900/50 rounded-4xl border border-white/5 min-h-100">
              <h3 className="text-xl font-bold mb-6">Messages</h3>
              <div className="flex flex-col items-center justify-center h-64 text-zinc-600">
                <p>No new messages</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default TrekkerDashboard;
