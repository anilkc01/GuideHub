import React, { useState } from "react";
import { Star, Check, User, XCircle, MessageSquare } from "lucide-react";
import { UserDetailCard } from "../../Common/UserDetailCard";

const OfferCard = ({ bid, onAccept, planStatus, onMessage }) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <div
        className={`bg-zinc-900/60 border rounded-2xl p-4 transition-all group mb-3 ${
          bid.status === "accepted"
            ? "border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
            : "border-white/5 hover:border-white/10"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 overflow-hidden">
            {/* Profile Picture Trigger */}
            <div
              onClick={() => setShowProfile(true)}
              className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
            >
              {bid.bidder?.dp ? (
                <img
                  src={`http://localhost:5002/${bid.bidder.dp}`}
                  className="w-8 h-8 shrink-0 rounded-full border border-white/10 object-cover"
                  alt="Bidder"
                />
              ) : (
                <div className="w-8 h-8 shrink-0 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <User size={16} className="text-zinc-500" strokeWidth={2.5} />
                </div>
              )}
            </div>

            {/* Name and Rating */}
            <div className="flex flex-col min-w-0">
              <h4
                onClick={() => setShowProfile(true)}
                className="text-[10px] font-black uppercase tracking-tight truncate cursor-pointer hover:text-emerald-400 transition-colors"
              >
                {bid.bidder?.fullName || "Unknown Guide"}
              </h4>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={8} fill="currentColor" />
                <span className="text-[9px] font-bold text-zinc-500">
                  {bid.bidder?.rating || "New"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons & Price */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* START CHAT BUTTON */}
            <button
              onClick={onMessage}
              className="p-2 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-xl border border-white/5 transition-all group/btn"
              title="Message Guide"
            >
              <MessageSquare size={14} className="group-hover/btn:scale-110 transition-transform" />
            </button>

            <div className="text-right">
              <p className="text-[11px] font-black text-emerald-400">
                ${bid.amount}
              </p>
            </div>
          </div>
        </div>

        {/* Bid Message */}
        <p className="text-[10px] text-zinc-500 italic leading-relaxed mb-4 line-clamp-2 px-3 py-1 border-l-2 border-white/10 bg-white/[0.01] rounded-r-lg">
          "{bid.message}"
        </p>

        {/* Dynamic Status Button */}
        <div className="mt-2">
          {bid.status === "accepted" ? (
            <div className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-black py-2 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-emerald-500/20">
              <Check size={12} strokeWidth={3} /> Confirmed Guide
            </div>
          ) : bid.status === "rejected" ? (
            <div className="w-full flex items-center justify-center gap-2 bg-zinc-800 text-zinc-500 py-2 rounded-xl font-black text-[9px] uppercase border border-white/5">
              <XCircle size={12} /> Offer Closed
            </div>
          ) : (
            planStatus === "open" && (
              <button
                onClick={() => onAccept(bid.id)}
                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-emerald-500 hover:text-black py-2 rounded-xl transition-all border border-white/5 hover:border-emerald-500 group/accept"
              >
                <Check size={12} strokeWidth={3} className="group-hover/accept:animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  Accept Offer
                </span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Detailed Profile Modal */}
      {showProfile && (
        <UserDetailCard
          userId={bid.bidderId}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
};

export default OfferCard;