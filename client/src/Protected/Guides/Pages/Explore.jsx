import React, { useState, useEffect } from "react";
import { Search, ArrowUpDown, Loader2, Check } from "lucide-react";
import api from "../../../api/axios";
import PlanListCard from "../Components/PlanListCard";
import { useNavigate } from "react-router-dom";

const ExploreSection = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // UI States
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortType, setSortType] = useState("budget_desc"); // Default: Budget High-Low

  const navigate = useNavigate();

  const sortOptions = [
    { id: "budget_desc", label: "Budget: High - Low" },
    { id: "budget_asc", label: "Budget: Low - High" },
    { id: "days_desc", label: "Days: High - Low" },
    { id: "days_asc", label: "Days: Low - High" },
    { id: "date_asc", label: "Date: Earliest - Latest" },
    { id: "date_desc", label: "Date: Latest - Earliest" },
  ];

  useEffect(() => {
    const fetchExplorePlans = async () => {
      try {
        const res = await api.get("/plans/explore");
        setPlans(res.data);
      } catch (err) {
        console.error("Failed to load plans");
      } finally {
        setLoading(false);
      }
    };
    fetchExplorePlans();
  }, []);

  useEffect(() => {
    // Filter
    let result = plans.filter((plan) =>
      plan.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort
    result.sort((a, b) => {
      switch (sortType) {
        case "budget_desc": return b.estBudget - a.estBudget;
        case "budget_asc": return a.estBudget - b.estBudget;
        case "days_desc": return (b.itinerary?.length || 0) - (a.itinerary?.length || 0);
        case "days_asc": return (a.itinerary?.length || 0) - (b.itinerary?.length || 0);
        case "date_asc": return new Date(a.timePlanned) - new Date(b.timePlanned);
        case "date_desc": return new Date(b.timePlanned) - new Date(a.timePlanned);
        default: return 0;
      }
    });

    setFilteredPlans(result);
  }, [searchQuery, sortType, plans]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div className="flex-1 max-w-md">
          <h2 className="text-2xl font-bold mb-4 font-serif italic tracking-tight">Explore</h2>
          <div className="relative group">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location..."
              className="w-full bg-transparent border-b border-white/10 py-2 pl-7 outline-none focus:border-white transition-all text-xs font-bold uppercase tracking-widest placeholder:text-zinc-700"
            />
          </div>
        </div>
        
        {/* Sort Toggle Button */}
        <div className="relative">
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 transition-all ${isSortOpen ? "bg-white text-black" : "bg-white/5 text-zinc-400 hover:text-white"}`}
          >
            <ArrowUpDown size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Sort</span>
          </button>

          {/* Sort Dropdown Menu */}
          {isSortOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in zoom-in duration-200">
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSortType(opt.id);
                    setIsSortOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 text-[10px] font-black  tracking-wider hover:bg-white/5 transition-colors text-left"
                >
                  <span className={sortType === opt.id ? "text-emerald-400" : "text-zinc-400"}>
                    {opt.label}
                  </span>
                  {sortType === opt.id }
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* List Container */}
      <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-5 min-h-150 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 opacity-10">
            <Loader2 className="animate-spin mb-2" size={32} />
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
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">No results found</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExploreSection;