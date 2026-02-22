import React from "react";
import { Star, Check, User } from "lucide-react";

const OfferCard = ({ bid, onAccept, onProfileClick }) => {
  return (
    <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-4 hover:border-emerald-500/30 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Clickable Image */}
          <div 
            onClick={() => onProfileClick(bid.bidderId)}
            className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
          >
            {bid.bidder?.dp ? (
              <img src={bid.bidder.dp} className="w-8 h-8 rounded-full border border-white/10 object-cover" alt="Guide" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <User size={14} className="text-zinc-500" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col min-w-0">
            {/* Clickable Name */}
            <h4 
              onClick={() => onProfileClick(bid.bidderId)}
              className="text-[10px] font-black uppercase tracking-tight truncate cursor-pointer hover:text-emerald-400 transition-colors"
            >
              {bid.bidder?.fullName || "Unknown Guide"}
            </h4>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={8} fill="currentColor" />
              <span className="text-[9px] font-bold text-zinc-500">{bid.bidder?.rating || "New"}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right flex-shrink-0">
          <p className="text-[11px] font-black text-emerald-400">${bid.amount}</p>
        </div>
      </div>

      <p className="text-[10px] text-zinc-500 italic leading-relaxed mb-4 line-clamp-2 px-2 border-l border-white/10">
        "{bid.message}"
      </p>

      <button 
        onClick={() => onAccept(bid.id)}
        className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-emerald-500 hover:text-black py-2 rounded-xl transition-all border border-white/5 hover:border-emerald-500"
      >
        <Check size={12} strokeWidth={3} />
        <span className="text-[9px] font-black uppercase tracking-widest">Accept</span>
      </button>
    </div>
  );
};

export default OfferCard;