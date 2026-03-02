import React from "react";
import {
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  ChevronRight,
  Quote,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlanListCard = ({ plan }) => {
  const navigate = useNavigate();
  const shortDesc =
    plan.description?.length > 120
      ? plan.description.substring(0, 120) + "..."
      : plan.description;

  return (
    <div className="group relative flex flex-col md:flex-row gap-6 p-6 bg-white/3 hover:bg-white/6 border border-white/5 hover:border-white/10 rounded-[2.5rem] transition-all duration-500 cursor-pointer overflow-hidden">
      

      <div className="flex-1 space-y-4 relative z-10">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-serif font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            {plan.title}
          </h3>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-black uppercase tracking-widest">
            Open
          </span>
        </div>

        {/* Description Snippet */}
        <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl font-medium">
          {shortDesc}
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
          <div className="flex items-center gap-2 text-zinc-400">
            <div className="p-1.5 bg-white/5 rounded-lg">
              <MapPin size={14} className="text-zinc-500" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide">
              {plan.location}
            </span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <div className="p-1.5 bg-white/5 rounded-lg">
              <Calendar size={14} className="text-zinc-500" />
            </div>
            <span className="text-xs font-bold tracking-wide">
              {plan.timePlanned}
            </span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <div className="p-1.5 bg-white/5 rounded-lg">
              <Clock size={14} className="text-zinc-500" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide">
              {plan.itinerary?.length || 0} Days Journey
            </span>
          </div>
        </div>
      </div>

      {/* Right Section: Budget & Action */}
      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:pl-6 md:border-l border-white/5 relative z-10">
        <div className="text-left md:text-right">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">
            Est. Budget
          </p>
          <div className="flex items-center gap-1 text-white group-hover:text-emerald-400 transition-colors">
            <DollarSign
              size={18}
              strokeWidth={3}
              className="text-emerald-500"
            />
            <span className="text-3xl font-black tabular-nums tracking-tighter">
              {plan.estBudget}
            </span>
          </div>
        </div>

        <button
          className="flex items-center gap-2 bg-white/5 group-hover:bg-white group-hover:text-black px-5 py-3 rounded-2xl transition-all duration-300 border border-white/5 group-hover:border-white"
          onClick={() => navigate(`/explore/${plan.id}`)}
        >
          <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">
            View Details
          </span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default PlanListCard;
