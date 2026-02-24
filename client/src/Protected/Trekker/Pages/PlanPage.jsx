import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Edit3,
  Loader2,
} from "lucide-react";
import api from "../../../api/axios";
import TrekkerNavBar from "../TrekkerNavBar";
import PlanTrekForm from "../components/PlanTrip";
import OfferCard from "../components/OfferCard";
import toast from "react-hot-toast";

const MyPlanDetails = ({ onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem("user"));

  const fetchData = async () => {
    try {
      const [pRes, bRes] = await Promise.all([
        api.get(`/plans/${id}`),
        api.get(`/offers/plan/${id}`),
      ]);
      setPlan(pRes.data);
      setBids(bRes.data);
    } catch (err) {
      toast.error("Data load failed");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAcceptBid = async (offerId) => {
    try {
      // Calls the new transactional backend route
      await api.put(`/offers/accept/${offerId}`);
      toast.success("Trip Confirmed! Check your Trips dashboard.");
      fetchData(); // Refresh to show 'Accepted' status and 'Ongoing' plan status
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept offer");
    }
  };

  if (loading)
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-white/20" size={32} />
      </div>
    );

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden font-sans">
      <TrekkerNavBar user={userData} onLogout={onLogout} />

      <div className="flex-1 mt-20 px-6 max-w-7xl mx-auto w-full pb-6 overflow-hidden">
        <div className="flex items-center mt-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-all bg-white/5 px-4 py-2 rounded-xl border border-white/5"
          >
            <ArrowLeft size={16} />
            <span className="text-[11px] font-black uppercase tracking-widest">Dashboard</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 h-[calc(100vh-180px)]">
          {/* LEFT: Trip Details */}
          <div className="lg:col-span-8 overflow-y-auto pr-8 custom-scrollbar scroll-smooth">
            <div className="flex items-center justify-between gap-6 mb-6">
              <h1 className="text-4xl font-serif font-bold tracking-tight leading-tight italic">
                {plan.title}
              </h1>
              {plan.status === "open" && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white hover:text-black transition-all group shadow-xl shadow-white/5"
                >
                  <Edit3 size={18} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-10">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-300 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <MapPin size={14} className="text-emerald-500" /> {plan.location}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-300 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <Calendar size={14} className="text-emerald-500" /> {plan.timePlanned}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                <DollarSign size={14} /> {plan.estBudget} USD
              </div>
              <div className={`flex items-center gap-2 text-[10px] font-black uppercase px-4 py-2 rounded-xl border ${
                plan.status === 'open' ? 'text-blue-400 border-blue-500/20 bg-blue-500/10' : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
              }`}>
                {plan.status}
              </div>
            </div>

            <div className="space-y-12">
              <section>
                <h3 className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-black mb-4">The Objective</h3>
                <p className="text-zinc-300 text-sm leading-relaxed font-medium bg-white/[0.02] p-5 rounded-3xl border border-white/5">
                  {plan.description}
                </p>
              </section>

              <section className="pb-20">
                <h3 className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-black mb-8">Planned Itinerary</h3>
                <div className="relative ml-4 space-y-0">
                  <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-emerald-500/50 via-white/10 to-transparent" />
                  {plan?.itinerary?.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-6 pb-4 last:pb-0 group">
                      <div className="relative z-10 flex-shrink-0 mt-1">
                        <div className="w-[24px] h-[24px] rounded-full bg-black border border-white/20 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </div>
                      </div>
                      <div className="pt-0.5">
                        <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 group-hover:text-emerald-500 transition-colors">Day 0{idx + 1}</span>
                        <p className="text-[14px] font-bold text-white/80 leading-relaxed max-w-md group-hover:text-white transition-colors">{item.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* RIGHT: Bids Sidebar */}
          <aside className="lg:col-span-4 flex flex-col h-full overflow-hidden bg-zinc-900/30 rounded-[2.5rem] border border-white/10 p-5 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-6 px-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Offers <span className="text-emerald-500 ml-1">[{bids.length}]</span>
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3">
              {bids.length > 0 ? (
                bids.map((bid) => (
                  <OfferCard
                    key={bid.id}
                    bid={bid}
                    planStatus={plan.status} // Pass plan status to control buttons
                    onAccept={handleAcceptBid}
                  />
                ))
              ) : (
                <div className="h-full border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center opacity-30 text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">No offers yet</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <PlanTrekForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={plan}
        onSubmitSuccess={(p) => setPlan(p)}
      />
    </div>
  );
};

export default MyPlanDetails;