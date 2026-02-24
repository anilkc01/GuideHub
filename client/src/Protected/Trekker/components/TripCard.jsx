import React from "react";
import { Calendar, User, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TripCard = ({ trip }) => {
  const navigate = useNavigate();

  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  // Status Style Mapping
  const statusStyles = {
    upcoming: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    ongoing: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    completed: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <div 
      onClick={() => navigate(`/myPlan/${trip.trekPlanId}`)}
      className="group relative bg-zinc-900/40 border border-white/5 hover:border-emerald-500/30 p-3 rounded-xl transition-all duration-300 cursor-pointer mb-2"
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-[13px] font-bold text-white truncate max-w-[150px] tracking-tight">
          {trip.TrekPlan?.title}
        </h4>
        <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase border ${statusStyles[trip.status] || statusStyles.upcoming}`}>
          {trip.status}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 bg-transparent p-2 rounded-lg ">
        {/* Date & Duration */}
        <div className="flex items-center gap-2">
          <Calendar size={12} className="text-zinc-500" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-200">{trip.startDate}</span>
            <span className="text-[8px] text-zinc-500 uppercase font-black">{duration} Days</span>
          </div>
        </div>

        {/* Guide Info */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-3">
          <User size={12} className="text-zinc-500" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-200 truncate max-w-[80px]">
              {trip.guide?.fullName.split(' ')[0]}
            </span>
            <span className="text-[8px] text-zinc-500 uppercase font-black">Guide</span>
          </div>
        </div>

        {/* Budget */}
        <div className="text-right border-l border-white/10 pl-3">
          <p className="text-[10px] font-black text-emerald-400">${trip.TrekPlan?.estBudget}</p>
          <p className="text-[8px] text-zinc-600 uppercase font-black">Cost</p>
        </div>
      </div>
    </div>
  );
};

export default TripCard;