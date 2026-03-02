import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { CheckCircle, XCircle, Eye, ShieldAlert, Loader2, Phone, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";

const GuideVerification = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/guides/verify?status=${filter}`);
      setGuides(res.data);
    } catch (err) {
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, [filter]);

  const handleUpdateStatus = async (guideId, newStatus) => {
    try {
      await api.patch(`/admin/guides/status/${guideId}`, { status: newStatus });
      toast.success(`Guide ${newStatus}`);
      setGuides(guides.filter(g => g.guideID !== guideId));
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-serif italic font-bold mb-2">Guide Verification </h1>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black">KYC for guides</p>
          </div>
          
          <div className="flex bg-zinc-900 p-1 rounded-full border border-white/5">
            {["pending", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === s ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "text-zinc-500 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Accessing Records...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <GuideCard key={guide.guideID} guide={guide} onUpdate={handleUpdateStatus} />
            ))}
            {guides.length === 0 && (
              <div className="col-span-full py-32 text-center border border-dashed border-white/10 rounded-[3rem] bg-zinc-900/20">
                <ShieldAlert className="mx-auto mb-4 text-zinc-800" size={48} />
                <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em]">No {filter} requests in queue</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const GuideCard = ({ guide, onUpdate }) => {
  const [showDocs, setShowDocs] = useState(false);

  return (
    <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden p-6 hover:border-emerald-500/20 transition-all duration-500 group">
      {/* Header Profile */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
            <img 
            src={`http://localhost:5002/${guide.user?.dp}`} 
            className="w-20 h-20 rounded-[1.5rem] object-cover border border-white/10 group-hover:border-emerald-500/50 transition-colors" 
            alt="DP" 
            />
            <div className="absolute -bottom-1 -right-1 bg-black p-1.5 rounded-lg border border-white/10">
                <ShieldAlert size={12} className="text-emerald-500" />
            </div>
        </div>
        <div>
          <h3 className="font-bold text-xl tracking-tight">{guide.user?.fullName}</h3>
          <p className="text-emerald-500 text-[9px] font-black uppercase tracking-widest">License: {guide.licenseNo}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 gap-3 mb-6 bg-black/40 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3">
            <Phone size={14} className="text-zinc-600" />
            <div>
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-tighter">Contact Number</p>
                <p className="text-xs font-bold text-zinc-200">{guide.user?.phone}</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <Calendar size={14} className="text-zinc-600" />
            <div>
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-tighter">Date of Birth</p>
                <p className="text-xs font-bold text-zinc-200">
                    {new Date(guide.user?.dob).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>
        </div>
        <div className="pt-2 mt-2 border-t border-white/5">
            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-tighter mb-1">Current Residence</p>
            <p className="text-xs text-zinc-400 leading-tight">{guide.user?.address}</p>
        </div>
      </div>

      {/* Documentation Toggle */}
      <button 
        onClick={() => setShowDocs(!showDocs)}
        className={`w-full py-3 mb-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${
            showDocs ? "bg-white text-black border-white" : "bg-zinc-800/50 text-zinc-400 border-white/5 hover:border-white/20"
        }`}
      >
        <Eye size={14} /> {showDocs ? "Hide Documents" : "Verify Documents"}
      </button>

      {showDocs && (
        <div className="grid grid-cols-2 gap-3 mb-6 animate-in zoom-in-95 duration-300">
          <div className="group/img relative">
            <p className="text-[7px] font-black uppercase text-zinc-600 mb-1 ml-1">License ID</p>
            <img 
              src={`http://localhost:5002/${guide.licenseImg}`} 
              className="w-full h-32 object-cover rounded-xl border border-white/10 cursor-zoom-in hover:scale-[1.02] transition-transform" 
              onClick={() => window.open(`http://localhost:5002/${guide.licenseImg}`)}
            />
          </div>
          <div className="group/img relative">
            <p className="text-[7px] font-black uppercase text-zinc-600 mb-1 ml-1">Citizenship</p>
            <img 
              src={`http://localhost:5002/${guide.citizenshipImg}`} 
              className="w-full h-32 object-cover rounded-xl border border-white/10 cursor-zoom-in hover:scale-[1.02] transition-transform"
              onClick={() => window.open(`http://localhost:5002/${guide.citizenshipImg}`)}
            />
          </div>
        </div>
      )}

      {/* Primary Actions */}
      <div className="flex gap-2">
        <button 
          onClick={() => onUpdate(guide.guideID, "verified")}
          className="flex-1 py-3.5 bg-emerald-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-400 hover:scale-[0.98] transition-all"
        >
          <CheckCircle size={14} /> Approve
        </button>
        <button 
          onClick={() => onUpdate(guide.guideID, "rejected")}
          className="flex-1 py-3.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white hover:scale-[0.98] transition-all"
        >
          <XCircle size={14} /> Reject
        </button>
      </div>
    </div>
  );
};

export default GuideVerification;