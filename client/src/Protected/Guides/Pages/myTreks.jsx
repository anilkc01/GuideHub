import React, { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import api from "../../../api/axios";
import PlanListCard from "../Components/PlanListCard";
import { useNavigate } from "react-router-dom";

const MyTreksPage = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming"); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyTreks = async () => {
      try {
        const res = await api.get("/trips/assignedTrips");
        setPlans(res.data);
      } catch (err) {
        console.error("Failed to load assigned treks");
      } finally {
        setLoading(false);
      }
    };
    fetchMyTreks();
  }, []);

  useEffect(() => {
    let result = plans.filter((plan) => {
      const matchesSearch = plan.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            plan.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const isCompleted = plan.tripStatus === "completed";
      const matchesTab = activeTab === "completed" ? isCompleted : !isCompleted;

      return matchesSearch && matchesTab;
    });
    setFilteredPlans(result);
  }, [searchQuery, activeTab, plans]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1 max-w-md">
          <h2 className="text-2xl font-bold mb-4 font-serif italic tracking-tight">My Assignments</h2>
          
          {/* TAB TOGGLE */}
          <div className="flex gap-6 mb-6">
            {["upcoming", "completed"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[10px] font-black uppercase tracking-[0.2em] pb-2 border-b-2 transition-all ${activeTab === tab ? 'border-emerald-500 text-white' : 'border-transparent text-zinc-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative group">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your assigned treks..."
              className="w-full bg-transparent border-b border-white/10 py-2 pl-7 outline-none focus:border-white transition-all text-xs font-bold uppercase tracking-widest"
            />
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-5 min-h-150 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-96 opacity-10">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <PlanListCard 
              key={plan.id} 
              plan={plan} 
              onClick={(id) => navigate(`/explore/${id}`)} 
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-64 border border-dashed border-white/5 rounded-[2.5rem]">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">No {activeTab} treks found</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyTreksPage;