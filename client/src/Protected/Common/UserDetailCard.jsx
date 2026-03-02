import React, { useState, useEffect } from "react";
import {
  Mail, Phone, MapPin, Star, BadgeCheck,
  User as UserIcon, X, MessageSquarePlus,
  ChevronDown, ChevronUp, Flag, AlertTriangle, Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../api/axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export const UserDetailCard = ({ userId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Reviews List
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  
  // Rating Form
  const [showReviewInput, setShowReviewInput] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Report Form
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportCategory, setReportCategory] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/user/profile/${userId}`);
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

  const handleRatingSubmit = async () => {
    if (myRating === 0) return toast.error("Select star rating");
    setSubmitting(true);
    try {
      // Matches backend: { rating, comment }
      const payload = { 
        rating: myRating,   
        comment: myComment
      };

      await api.post(`/user/rate/${userId}`, payload);
      toast.success("Review updated");
      setShowReviewInput(false);
      setMyRating(0);
      setMyComment("");
      fetchProfile(); 
        if (showReviews) fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Rating failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReportSubmit = async () => {
    if (!reportCategory || !reportDesc) return toast.error("Fill all fields");
    setReporting(true);
    try {
      const payload = { 
        reportedUserId: userId, 
        reason: reportCategory, // Changed from 'category' to 'reason'
        description: reportDesc 
      };

      await api.post(`/user/report`, payload);
      toast.success("Report submitted");
      setShowReportForm(false);
    } catch (err) {
      toast.error("Report failed");
    } finally {
      setReporting(false);
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
            <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-white/10 bg-zinc-800">
              {data.dp ? (
                <img src={`http://localhost:5002/${data.dp}`} className="w-full h-full object-cover" alt="avatar" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600"><UserIcon size={40} /></div>
              )}
            </div>
            {data.isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-4 border-zinc-900">
                <BadgeCheck className="w-4 h-4 text-black" fill="currentColor" />
              </span>
            )}
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

          {!showReviewInput && !showReportForm && (
            <div className="flex gap-2 w-full mb-4">
              <button 
                onClick={() => setShowReviewInput(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-500 transition-all"
              >
                <MessageSquarePlus size={14} /> Rate Experience
              </button>
              <button 
                onClick={() => setShowReportForm(true)}
                className="px-4 bg-zinc-800 text-zinc-500 rounded-xl hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5"
              >
                <Flag size={14} />
              </button>
            </div>
          )}

          {showReviewInput && (
            <div className="w-full bg-zinc-800/40 border border-white/10 rounded-2xl p-4 mb-4 space-y-3 animate-in zoom-in-95">
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    size={22} 
                    // FIXED: Merged duplicate className into one
                    className={`cursor-pointer ${s <= myRating ? "text-yellow-400" : "text-zinc-600"}`}
                    fill={s <= myRating ? "#facc15" : "none"}
                    onClick={() => setMyRating(s)}
                  />
                ))}
              </div>
              <textarea 
                className="w-full bg-black/40 rounded-xl p-3 text-xs border border-white/5 h-16 resize-none outline-none text-white"
                placeholder="How was the experience?"
                value={myComment} onChange={(e) => setMyComment(e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={() => setShowReviewInput(false)} className="flex-1 py-2 text-[9px] font-black uppercase text-zinc-500">Cancel</button>
                <button onClick={handleRatingSubmit} disabled={submitting} className="flex-1 py-2 bg-emerald-500 text-black rounded-lg text-[9px] font-black uppercase">
                  {submitting ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          )}

          {showReportForm && (
            <div className="w-full bg-red-500/5 border border-red-500/20 rounded-2xl p-4 mb-4 space-y-3 animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2 text-red-500 mb-1">
                <AlertTriangle size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Report Misconduct</span>
              </div>
              <select 
                className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-[10px] text-zinc-200"
                value={reportCategory} onChange={(e) => setReportCategory(e.target.value)}
              >
                <option value="">Choose Category...</option>
                <option value="Fraud">Fraud or Scam</option>
                <option value="Safety">Safety Violation</option>
                <option value="Harassment">Harassment</option>
              </select>
              <textarea 
                className="w-full bg-black/60 border border-white/10 rounded-lg p-3 text-[10px] h-20 resize-none text-zinc-300"
                placeholder="Describe the issue..."
                value={reportDesc} onChange={(e) => setReportDesc(e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={() => setShowReportForm(false)} className="flex-1 py-2 text-[9px] font-black uppercase text-zinc-500">Cancel</button>
                <button onClick={handleReportSubmit} disabled={reporting} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-[9px] font-black uppercase">
                  {reporting ? "Sending..." : "Report"}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 w-full mb-6 py-4 border-y border-white/5">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{data.stats?.completedTreks || 0}</div>
              <div className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Treks Led</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{data.stats?.experience || 0}y</div>
              <div className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Experience</div>
            </div>
          </div>

          <button 
            onClick={fetchReviews}
            disabled={loadingReviews}
            className="w-full py-3 flex items-center justify-between px-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20 hover:bg-emerald-500/10 transition-all"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">View Traveler Feedback</span>
            {loadingReviews ? <Loader2 size={14} className="animate-spin text-emerald-500" /> : (showReviews ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
          </button>

          {showReviews && (
            <div className="w-full mt-3 space-y-2 pb-2">
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
        </div>
      </div>
    </div>
  );
};