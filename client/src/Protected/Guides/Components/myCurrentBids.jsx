import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const MyBidsList = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchBids = async () => {
      try {
        // Ensure this matches your backend route
        const res = await api.get("/offers/myoffers"); 
        setBids(res.data);
      } catch (err) {
        console.error("Error fetching bids:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-zinc-700" size={20} />
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest text-center">
        No active bids
      </p>
    );
  }

  return (
    <div className="w-full px-4 space-y-2 overflow-y-auto max-h-60 custom-scrollbar">
      {bids.map((bid) => (
        <div 
          key={bid.id} 
          // REDIRECT LOGIC
          onClick={() => navigate(`/explore/${bid.trekPlanId}`)}
          className="bg-white/[0.03] border border-white/5 p-3 rounded-2xl hover:border-emerald-500/30 hover:bg-white/[0.05] transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div className="min-w-0">
              <h4 className="text-[11px] font-bold text-zinc-200 truncate uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                {bid.plan?.title}
              </h4>
              <p className="text-[9px] text-zinc-500 font-medium mt-0.5">
                Trekker: <span className="text-zinc-300">{bid.plan?.trekker?.fullName}</span>
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-[11px] font-black text-emerald-400">${bid.amount}</span>
              <div className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded mt-1 border ${
                bid.status === 'accepted' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 
                bid.status === 'rejected' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 
                'text-blue-400 border-blue-500/20 bg-blue-500/5'
              }`}>
                {bid.status}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBidsList;