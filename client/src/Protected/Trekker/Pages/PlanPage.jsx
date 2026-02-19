import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, DollarSign, Edit3, Loader2 } from "lucide-react";
import api from "../../../api/axios";
import TrekkerNavBar from "../TrekkerNavBar";
import PlanTrekForm from "../components/PlanTrip"; // Import your form component
import toast from "react-hot-toast";

const MyPlanDetails = ({ onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal state

  const userData = JSON.parse(localStorage.getItem("user"));

  const fetchPlanDetails = async () => {
    try {
      const res = await api.get(`/plans/${id}`);
      setPlan(res.data);
    } catch (err) {
      toast.error("Plan not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanDetails();
  }, [id]);

  // Handle successful update
  const handleUpdateSuccess = (updatedPlan) => {
    setPlan(updatedPlan); // Update local state so UI refreshes
    setIsEditModalOpen(false);
  };

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-white/20" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <TrekkerNavBar user={userData} onLogout={onLogout} />

      {/* Edit Modal */}
      <PlanTrekForm 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={plan} // Pass current plan data to pre-fill form
        onSubmitSuccess={handleUpdateSuccess}
      />

      <div className="max-w-7xl mx-auto px-6 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl border border-white/10 transition-all"
        >
          <ArrowLeft size={16} className="text-zinc-400 group-hover:text-white transition-colors" />
          <span className="text-xs font-black uppercase tracking-widest">Dashboard</span>
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-8 bg-zinc-900/40 border border-white/10 rounded-4xl p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold mb-3 tracking-tight">
                {plan.title}
              </h1>
              {/* ... metadata (location, date, budget) ... */}
              <div className="flex flex-wrap gap-2 text-zinc-400">
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <MapPin size={12} />
                  <span className="text-[11px] font-bold uppercase tracking-tight">{plan.location}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <Calendar size={12} />
                  <span className="text-[11px] font-bold uppercase tracking-tight">{plan.timePlanned}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  <DollarSign size={12} />
                  <span className="text-[11px] font-black uppercase tracking-tight">{plan.estBudget} USD</span>
                </div>
              </div>
            </div>

            {/* Edit Button Trigger */}
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="p-2.5 bg-white/5 hover:bg-white hover:text-black rounded-xl transition-all border border-white/10"
            >
              <Edit3 size={18} />
            </button>
          </div>

          <div className="space-y-6">
            <section className="border-t border-white/5 pt-6">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black mb-3">Goal</h3>
              <p className="text-zinc-300 leading-relaxed text-sm font-medium">{plan.description}</p>
            </section>

            <section className="border-t border-white/5 pt-6">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black mb-4">Itinerary</h3>
              <div className="grid grid-cols-1 gap-3">
                {plan?.itinerary?.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-white/2 rounded-2xl border border-white/5">
                    <span className="text-sm font-serif italic text-white/20">0{idx + 1}</span>
                    <p className="text-[13px] font-bold text-white/80">{item.activity}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <aside className="lg:col-span-4 bg-zinc-900/40 border border-white/10 rounded-4xl p-6 h-full min-h-100">
          <h3 className="text-xl font-serif font-bold mb-6">Bids</h3>
          <div className="flex flex-col items-center justify-center py-20 text-zinc-600 border border-dashed border-white/10 rounded-2xl bg-white/1">
            <p className="font-black text-[10px] uppercase tracking-widest mb-1">Waiting for guides</p>
            <p className="text-[10px] opacity-60">Offers will appear here shortly</p>
          </div>
        </aside>

      </main>
    </div>
  );
};

export default MyPlanDetails;