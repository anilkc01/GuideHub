import React, { useState, useEffect } from "react";
import {
  Mail, Phone, MapPin, Star,
  User as UserIcon, X, ShieldAlert,
  ChevronDown, ChevronUp, Loader2,
  CheckCircle, Ban, Power
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../api/axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export const UserDetailCard = ({ userId, onClose, onUpdate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Reviews List (View Feedback)
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  // Admin: Reports List
  const [reports, setReports] = useState([]);
  const [showReports, setShowReports] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/user/${userId}`);
      setData(res.data);
    } catch (err) {
      toast.error("Profile unavailable");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (showReviews) {
      setShowReviews(false);
      return;
    }
    setLoadingReviews(true);
    try {
      const res = await api.get(`/user/reviews/${userId}`);
      setReviews(res.data);
      setShowReviews(true);
    } catch (err) {
      toast.error("Could not load reviews");
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchReports = async () => {
    if (showReports) { setShowReports(false); return; }
    setLoadingReports(true);
    try {
      const res = await api.get(`/admin/user-reports/${userId}`);
      setReports(res.data);
      setShowReports(true);
    } catch (err) {
      toast.error("Could not load reports");
    } finally {
      setLoadingReports(false);
    }
  };

  const toggleAccountStatus = async () => {
    setStatusLoading(true);
    const newStatus = data.status === "active" ? "suspended" : "active";
    try {
      await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
      setData({ ...data, status: newStatus });
      toast.success(`User ${newStatus}`);
      if(onUpdate) onUpdate(); 
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  const resolveReport = async (reportId) => {
    try {
      await api.patch(`/admin/user-report/resolve/${reportId}`);
      setReports(reports.filter(r => r.id !== reportId));
      toast.success("Resolved");
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black/80 z-[1100] flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 z-[1100] flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-[2.5rem] w-full max-w-md max-h-[90vh] overflow-y-auto relative p-6 custom-scrollbar text-white">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-all z-10">
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className={`w-24 h-24 rounded-full overflow-hidden border-2 bg-zinc-800 ${data.status === 'active' ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
              {data.dp ? (
                <img src={`http://localhost:5002/${data.dp}`} className="w-full h-full object-cover" alt="avatar" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600"><UserIcon size={40} /></div>
              )}
            </div>
          </div>

          <h2 className="text-2xl font-serif font-bold italic">{data.fullName}</h2>
          
          <div className="flex items-center gap-1 mt-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={12} fill={s <= Math.round(data.rating || 0) ? "#facc15" : "none"} className={s <= Math.round(data.rating || 0) ? "text-yellow-400" : "text-zinc-700"} />
            ))}
            <span className="ml-1 text-[9px] font-black text-zinc-500 uppercase">({data.rating || 0})</span>
          </div>

          <div className="w-full space-y-2 mb-4">
             <div className="flex items-center gap-3 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                <Mail size={12} className="text-emerald-500" />
                <p className="text-[10px] font-bold text-zinc-300 truncate">{data.email}</p>
             </div>
             <div className="flex items-center gap-3 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                <Phone size={12} className="text-emerald-500" />
                <p className="text-[10px] font-bold text-zinc-300">{data.phone || "No Phone"}</p>
             </div>
             <div className="flex items-center gap-3 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                <MapPin size={12} className="text-emerald-500" />
                <p className="text-[10px] font-bold text-zinc-300">{data.address || "Nepal"}</p>
             </div>
          </div>

          {/* ADMIN ACTION BUTTONS */}
          <div className="flex gap-2 w-full mb-4">
            <button 
              onClick={toggleAccountStatus}
              disabled={statusLoading}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                data.status === 'active' 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' 
                : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
              }`}
            >
              {statusLoading ? <Loader2 size={14} className="animate-spin" /> : (data.status === 'active' ? <Ban size={14} /> : <Power size={14} />)}
              {data.status === 'active' ? "Suspend User" : "Activate User"}
            </button>
            <button 
              onClick={fetchReports}
              className={`px-4 rounded-xl transition-all border border-white/5 ${showReports ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}
            >
              <ShieldAlert size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 w-full mb-6 py-4 border-y border-white/5">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{data?.stats?.completedTreks || 0}</div>
              <div className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Completed Treks</div>
            </div>
          </div>

          {/* User Feedback Toggle (YOUR ORIGINAL DESIGN) */}
          <button 
            onClick={fetchReviews}
            disabled={loadingReviews}
            className="w-full py-3 flex items-center justify-between px-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20 hover:bg-emerald-500/10 transition-all mb-2"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">View Traveler Feedback</span>
            {loadingReviews ? <Loader2 size={14} className="animate-spin text-emerald-500" /> : (showReviews ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
          </button>

          {showReviews && (
            <div className="w-full mt-1 space-y-2 pb-2">
              {reviews.length === 0 ? <p className="text-[9px] text-zinc-600 py-4 italic">No history yet.</p> : 
                reviews.map((rev) => (
                  <div key={rev.id} className="text-left bg-black/20 p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[10px] text-zinc-200">{rev.reviewer?.fullName}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={8} fill={s <= rev.stars ? "#facc15" : "none"} className={s <= rev.stars ? "text-yellow-400" : "text-zinc-800"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 italic">"{rev.review}"</p>
                  </div>
                ))
              }
            </div>
          )}

          {/* Admin Reports Toggle */}
          {showReports && (
            <div className="w-full mt-2 space-y-2 pb-2 border-t border-white/5 pt-4">
               <p className="text-[9px] font-black uppercase tracking-widest text-red-500 text-left mb-2">Pending Reports</p>
              {reports.length === 0 ? <p className="text-[9px] text-zinc-600 py-4 italic">No pending reports.</p> : 
                reports.map((rep) => (
                  <div key={rep.id} className="text-left bg-red-500/5 p-3 rounded-xl border border-red-500/10 relative">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[10px] text-zinc-300 uppercase">{rep.category}</span>
                      <button onClick={() => resolveReport(rep.id)} className="text-zinc-600 hover:text-emerald-500 transition-colors">
                        <CheckCircle size={14} />
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-500 italic">"{rep.description}"</p>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailCard;