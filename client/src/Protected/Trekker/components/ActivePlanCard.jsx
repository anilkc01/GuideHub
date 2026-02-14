import React from "react";
import { MapPin, Calendar, DollarSign, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ActivePlanCard = ({ plan }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/myPlan/${plan.id}`)}
      className="group relative bg-white/3 border border-white/5 hover:border-white/10 hover:bg-white/5 p-4 rounded-2xl transition-all duration-300 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-lg font-bold text-white truncate max-w-[70%] tracking-tight">
          {plan.title}
        </h4>
        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-1 rounded-md uppercase border border-emerald-500/20">
          {plan.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <MapPin size={14} className="text-white/40" />
          <span className="text-xs font-bold truncate">{plan.location}</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <Calendar size={14} className="text-white/40" />
          <span className="text-xs font-bold">{plan.timePlanned}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <DollarSign size={14} className="text-emerald-500" />
          <span className="text-sm font-black text-white">
            {plan.estBudget} <span className="text-[10px] text-zinc-500 uppercase">USD</span>
          </span>
        </div>
        <div className="p-1 rounded-full bg-white/5 group-hover:bg-white group-hover:text-black transition-all">
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
};

export default ActivePlanCard;