import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, DollarSign, Star, Loader2, Plus } from "lucide-react";
import api from "../../../api/axios";
import GuideNavBar from "../GuideNavBar";
import toast from "react-hot-toast";

const ExplorePlanDetails = ({ onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const userData = JSON.parse(localStorage.getItem("user"));

  // Mock Bids - Replace with API call later
  const [bids, setBids] = useState([
    {
      id: 1,
      name: "Dawa Sherpa",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dawa",
      rating: 4.9,
      price: 450,
      message: "I have 10 years of experience in this region. Would love to guide you!"
    }
  ]);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const res = await api.get(`/plans/${id}`);
        setPlan(res.data);
      } catch (err) {
        toast.error("Plan details not available");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchPlanDetails();
  }, [id, navigate]);

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-white/20" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <GuideNavBar user={userData} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-6 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl border border-white/10 transition-all"
        >
          <ArrowLeft size={16} className="text-zinc-400 group-hover:text-white transition-colors" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Explore</span>
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: Plan Content */}
        <div className="lg:col-span-8 bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 tracking-tight">
              {plan.title}
            </h1>
            <div className="flex flex-wrap gap-2 text-zinc-400">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <MapPin size={12} className="text-emerald-500" />
                <span className="text-[11px] font-bold uppercase tracking-tight">{plan.location}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Calendar size={12} className="text-emerald-500" />
                <span className="text-[11px] font-bold uppercase tracking-tight">{plan.timePlanned}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 text-white">
                <DollarSign size={12} className="text-emerald-500" />
                <span className="text-[11px] font-black uppercase tracking-tight">Budget: ${plan.estBudget}</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section className="border-t border-white/5 pt-6">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black mb-3 ml-1">The Goal</h3>
              <p className="text-zinc-300 leading-relaxed text-sm font-medium">{plan.description}</p>
            </section>

            <section className="border-t border-white/5 pt-6">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black mb-4 ml-1">Proposed Itinerary</h3>
              <div className="grid grid-cols-1 gap-3">
                {plan?.itinerary?.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-5 bg-white/2 rounded-3xl border border-white/5">
                    <span className="text-sm font-serif italic text-white/10">0{idx + 1}</span>
                    <p className="text-[13px] font-bold text-white/80 leading-snug">{item.activity}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* RIGHT: Bidding Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
          <div className="bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-6 flex flex-col min-h-[500px]">
            <h3 className="text-xl font-serif font-bold mb-6">Offers</h3>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
              {bids.length > 0 ? (
                bids.map((bid) => (
                  <div key={bid.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={bid.photo} alt={bid.name} className="w-8 h-8 rounded-full border border-white/10" />
                        <div>
                          <p className="text-xs font-black uppercase tracking-tight">{bid.name}</p>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star size={10} fill="currentColor" />
                            <span className="text-[10px] font-bold">{bid.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-emerald-400">${bid.price}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-400 italic leading-relaxed">"{bid.message}"</p>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-widest">No offers yet</p>
                </div>
              )}
            </div>

            {/* Sticky bottom button inside the container */}
            <button className="mt-6 w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10">
              <Plus size={14} /> Add Your Offer
            </button>
          </div>
        </aside>

      </main>
    </div>
  );
};

export default ExplorePlanDetails;