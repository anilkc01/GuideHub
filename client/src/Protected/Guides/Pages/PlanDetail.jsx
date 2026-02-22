import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, DollarSign, Star, Loader2, Plus, Edit3, X } from "lucide-react";
import api from "../../../api/axios";
import GuideNavBar from "../GuideNavBar";
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
  
  // Form State
  const [formData, setFormData] = useState({ amount: "", message: "" });
  const [myOffer, setMyOffer] = useState(null);

  const userData = JSON.parse(localStorage.getItem("user"));

  const fetchData = async () => {
    try {
      const [planRes, bidsRes] = await Promise.all([
        api.get(`/plans/${id}`),
        api.get(`/offers/plan/${id}`)
      ]);
      
      setPlan(planRes.data);
      setBids(bidsRes.data);
      
      // Check if I have already bid
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

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (myOffer) {
        // Update existing
        await api.put(`/offers/${myOffer.id}`, formData);
        toast.success("Offer updated");
      } else {
        // Create new
        await api.post("/offers", { ...formData, trekPlanId: id });
        toast.success("Offer submitted");
      }
      setShowModal(false);
      fetchData(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-white/20" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <GuideNavBar user={userData} onLogout={onLogout} />

      {/* Offer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 relative animate-in zoom-in duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-serif font-bold mb-6 italic">
              {myOffer ? "Update Your Offer" : "Make an Offer"}
            </h2>
            <form onSubmit={handleSubmitOffer} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-2">Your Price (USD)</label>
                <input 
                  required
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500/50 transition-all font-bold"
                  placeholder="e.g. 500"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-2">Message to Trekker</label>
                <textarea 
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500/50 transition-all text-sm"
                  placeholder="Tell them why you're the best guide..."
                />
              </div>
              <button 
                disabled={submitting}
                className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 disabled:opacity-50 transition-all"
              >
                {submitting ? "Processing..." : myOffer ? "Update Offer" : "Submit Offer"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl border border-white/10 transition-all"
        >
          <ArrowLeft size={16} className="text-zinc-400 group-hover:text-white transition-colors" />
          <span className="text-xs font-black uppercase tracking-widest">Back</span>
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: Plan Content */}
        <div className="lg:col-span-8 bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-6 md:p-8">
            {/* ... (Previous plan details code remains same) ... */}
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 tracking-tight">{plan.title}</h1>
            <div className="flex flex-wrap gap-2 mb-8">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 text-[11px] font-bold uppercase tracking-tight">
                <MapPin size={12} className="text-emerald-500" /> {plan.location}
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 text-[11px] font-bold uppercase tracking-tight">
                <Calendar size={12} className="text-emerald-500" /> {plan.timePlanned}
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 text-[11px] font-black uppercase tracking-tight">
                <DollarSign size={12} className="text-emerald-500" /> Budget: ${plan.estBudget}
              </div>
            </div>

            <section className="border-t border-white/5 pt-6 space-y-8">
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black mb-3">The Goal</h3>
                <p className="text-zinc-300 leading-relaxed text-sm font-medium">{plan.description}</p>
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black mb-4">Proposed Itinerary</h3>
                <div className="grid gap-3">
                  {plan?.itinerary?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-5 bg-white/[0.02] rounded-3xl border border-white/5">
                      <span className="text-sm font-serif italic text-white/10">0{idx + 1}</span>
                      <p className="text-[13px] font-bold text-white/80">{item.activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
        </div>

        {/* RIGHT: Bidding Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
          <div className="bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-6 flex flex-col min-h-[500px]">
            <h3 className="text-xl font-serif font-bold mb-6">Offers</h3>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
              {bids.length > 0 ? (
                bids.map((bid) => (
                  <div key={bid.id} className={`p-4 border rounded-2xl space-y-3 transition-all ${bid.bidderId === userData.id ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/5'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={bid.bidder?.dp || "/default-avatar.png"} alt="bidder" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                        <div>
                          <p className="text-xs font-black uppercase tracking-tight">{bid.bidder?.fullName} {bid.bidderId === userData.id && "(You)"}</p>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star size={10} fill="currentColor" />
                            <span className="text-[10px] font-bold">{bid.bidder?.rating}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs font-black text-emerald-400">${bid.amount}</p>
                    </div>
                    <p className="text-[11px] text-zinc-400 italic leading-relaxed">"{bid.message}"</p>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-widest">No offers yet</p>
                </div>
              )}
            </div>

            <button 
              onClick={() => setShowModal(true)}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10"
            >
              {myOffer ? <><Edit3 size={14} /> Update Offer</> : <><Plus size={14} /> Add Your Offer</>}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default ExplorePlanDetails;