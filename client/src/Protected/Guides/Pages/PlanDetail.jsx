import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, DollarSign, Star, Loader2, Plus, Edit3, X } from "lucide-react";
import api from "../../../api/axios";
import GuideNavBar from "../GuideNavBar";
import { UserDetailCard } from "../../Common/UserDetailCard"; // Import the card
import toast from "react-hot-toast";

const ExplorePlanDetails = ({ onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State
  const [plan, setPlan] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Profile Modal State
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ amount: "", message: "" });
  const [myOffer, setMyOffer] = useState(null);

  const userData = JSON.parse(localStorage.getItem("user"));

  // Helper function for 5-star display
  const renderStars = (rating) => {
    if (!rating || rating === 0) return <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">New</span>;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={9} 
            fill={i < Math.floor(rating) ? "currentColor" : "none"} 
            className={i < Math.floor(rating) ? "text-yellow-500" : "text-zinc-700"} 
          />
        ))}
        <span className="text-[9px] font-bold text-zinc-500 ml-1">{rating}</span>
      </div>
    );
  };

  const fetchData = async () => {
    try {
      const [planRes, bidsRes] = await Promise.all([
        api.get(`/plans/${id}`),
        api.get(`/offers/plan/${id}`)
      ]);
      setPlan(planRes.data);
      setBids(bidsRes.data);
      
      const foundMyOffer = bidsRes.data.find(b => b.bidderId === userData.id);
      if (foundMyOffer) {
        setMyOffer(foundMyOffer);
        setFormData({ amount: foundMyOffer.amount, message: foundMyOffer.message });
      }
    } catch (err) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (myOffer) {
        await api.put(`/offers/${myOffer.id}`, formData);
        toast.success("Offer updated");
      } else {
        await api.post("/offers", { ...formData, trekPlanId: id });
        toast.success("Offer submitted");
      }
      setShowModal(false);
      fetchData(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenProfile = (userId) => {
    setSelectedUserId(userId);
    setShowProfile(true);
  };

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-white/20" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 font-sans">
      <GuideNavBar user={userData} onLogout={onLogout} />

      {/* Offer Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-[2rem] p-8 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-xl font-serif font-bold mb-6 italic">{myOffer ? "Refine Your Offer" : "Place Your Bid"}</h2>
            <form onSubmit={handleSubmitOffer} className="space-y-5">
              <input 
                required type="number" value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500/50 font-bold"
                placeholder="Budget (USD)"
              />
              <textarea 
                required rows="4" value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500/50 text-sm resize-none"
                placeholder="Why should they pick you?"
              />
              <button disabled={submitting} className="w-full bg-white text-black py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95">
                {submitting ? "Processing..." : myOffer ? "Update My Offer" : "Submit Offer"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Profile Detail Modal */}
      {showProfile && (
        <UserDetailCard 
          userId={selectedUserId} 
          onClose={() => setShowProfile(false)} 
        />
      )}

      <div className="max-w-7xl mx-auto px-6 mb-6">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-all">
          <ArrowLeft size={14} className="text-zinc-400 group-hover:text-white" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Plan Content */}
        <div className="lg:col-span-8 bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-8 md:p-10">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 italic leading-tight">{plan.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-10">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <MapPin size={12} className="text-emerald-500" /> {plan.location}
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                <DollarSign size={12} /> ${plan.estBudget}
              </div>
            </div>

            <section className="space-y-12">
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-black mb-4">The Goal</h3>
                <p className="text-zinc-300 leading-relaxed text-sm font-medium italic bg-white/[0.01] p-5 rounded-2xl border border-white/5">"{plan.description}"</p>
              </div>

              {/* STEPPER ITINERARY */}
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-black mb-8">Planned Itinerary</h3>
                <div className="relative ml-4 space-y-0">
                  <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-white/10" />
                  {plan?.itinerary?.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-6 pb-6 last:pb-0 group">
                      <div className="relative z-10 flex-shrink-0 mt-1">
                        <div className="w-[24px] h-h[24px] rounded-full bg-black border border-white/20 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </div>
                      </div>
                      <div className="pt-0.5">
                        <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1 group-hover:text-emerald-500 transition-colors">Day 0{idx + 1}</span>
                        <p className="text-sm font-bold text-white/80 group-hover:text-white transition-colors leading-relaxed">{item.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMPACT TREKKER INFO (CLICKABLE) */}
              <div className="pt-8 border-t border-white/5">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4">Planned By</p>
                <div 
                  onClick={() => handleOpenProfile(plan.trekker?.id)}
                  className="inline-flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 p-2 pr-5 rounded-full cursor-pointer transition-all group"
                >
                  <img src={plan.trekker?.dp || "/default-avatar.png"} className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:border-emerald-500/50 transition-colors" />
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">{plan.trekker?.fullName}</p>
                    {renderStars(plan.trekker?.rating)}
                  </div>
                </div>
              </div>
            </section>
        </div>

        {/* RIGHT: Bids Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-6 sticky top-28">
          <div className="bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-6 flex flex-col min-h-[500px] shadow-2xl">
            <h3 className="text-lg font-serif font-bold mb-6 italic">Active Offers</h3>
            
            <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
              {bids.length > 0 ? bids.map((bid) => (
                <div key={bid.id} className={`p-4 border rounded-2xl space-y-3 transition-all ${bid.bidderId === userData.id ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/5'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-80" onClick={() => handleOpenProfile(bid.bidderId)}>
                      <img src={bid.bidder?.dp || "/default-avatar.png"} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-tight">{bid.bidderId === userData.id ? "Your Bid" : bid.bidder?.fullName}</p>
                        {renderStars(bid.bidder?.rating)}
                      </div>
                    </div>
                    <p className="text-xs font-black text-emerald-400">${bid.amount}</p>
                  </div>
                  <p className="text-[10px] text-zinc-500 italic leading-relaxed px-2 border-l border-white/10 line-clamp-2">"{bid.message}"</p>
                </div>
              )) : (
                <div className="py-20 text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-[0.2em]">No activity</p></div>
              )}
            </div>

            <button onClick={() => setShowModal(true)} className="mt-6 w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-white/5">
              {myOffer ? <><Edit3 size={14} /> Update Offer</> : <><Plus size={14} /> Send Offer</>}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default ExplorePlanDetails;