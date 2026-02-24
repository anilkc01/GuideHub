import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Star,
  BadgeCheck,
  User as UserIcon,
  X,
  MessageSquarePlus,
  Flag,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../api/axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export const UserDetailCard = ({ userId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewInput, setShowReviewInput] = useState(false);

  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDesc, setReportDesc] = useState("");

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/user/profile/${userId}`);
      setData(res.data);
    } catch (err) {
      toast.error("User profile unavailable");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (myRating === 0) return toast.error("Please select a star rating");
    setSubmitting(true);
    try {
      await api.post(`/user/rate/${userId}`, {
        rating: myRating,
        comment: myComment,
      });
      toast.success("Review submitted!");
      setMyComment("");
      setMyRating(0);
      setShowReviewInput(false);
      fetchProfile();
    } catch (err) {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReportSubmit = async () => {
    if (!reportReason) return toast.error("Please select a reason");
    try {
      await api.post(`/user/report`, {
        reportedUserId: userId,
        reason: reportReason,
        description: reportDesc,
      });
      toast.success("User reported");
      setShowReportForm(false);
    } catch (err) {
      toast.error("Failed to submit report");
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1100] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-emerald-500 font-black text-xs uppercase tracking-widest">Fetching Profile...</p>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1100] flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-[3rem] w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)] relative p-8 custom-scrollbar text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-all z-10"
        >
          <X size={20} strokeWidth={3} />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Avatar & Verification */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-2 border-white/10 bg-zinc-800 p-1">
              <div className="w-full h-full rounded-[2.2rem] overflow-hidden">
                {data.kyc?.image ? (
                  <img
                    src={`${API_BASE}/${data.kyc.image}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="user"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
                    <UserIcon size={64} />
                  </div>
                )}
              </div>
            </div>
            {data.isVerified && (
              <span className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1.5 shadow-lg border-4 border-zinc-900">
                <BadgeCheck className="w-5 h-5 text-black" fill="currentColor" />
              </span>
            )}
          </div>

          {/* Name & Identity */}
          <div className="space-y-2">
            <h2 className="text-3xl font-serif font-bold italic tracking-tight text-white">
              {data.fullName}
            </h2>
            <div className="flex items-center justify-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 py-1 px-3 rounded-full">
              <Star size={12} className="text-emerald-500" fill="currentColor" />
              <span className="text-[11px] font-black text-emerald-400 uppercase tracking-tighter">
                {data.rating?.toFixed(1) || "New Guide"}
              </span>
            </div>
          </div>

          {/* Contacts */}
          <div className="grid grid-cols-1 gap-2 w-full">
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 text-[11px] font-bold text-zinc-400">
              <Mail size={14} className="text-emerald-500" /> {data.email}
            </div>
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 text-[11px] font-bold text-zinc-400">
              <MapPin size={14} className="text-emerald-500" />
              {data.kyc?.address || "Location Verified"}
            </div>
          </div>

          {/* Guide Stats */}
          <div className="grid grid-cols-2 gap-4 w-full py-6 border-y border-white/5">
            <div className="text-center">
              <div className="text-2xl font-serif italic font-bold text-white">{data.stats?.completedTreks || 0}</div>
              <div className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Treks Led</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-serif italic font-bold text-white">{data.stats?.experience || "1+"}y</div>
              <div className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Experience</div>
            </div>
          </div>

          {/* Actions */}
          {!showReviewInput && !showReportForm && (
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => setShowReviewInput(true)}
                className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase bg-emerald-500 text-black px-6 py-4 rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                <MessageSquarePlus size={16} /> Rate Experience
              </button>
              <button
                onClick={() => setShowReportForm(true)}
                className="p-4 bg-zinc-800 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl border border-white/5 transition-all"
              >
                <Flag size={18} />
              </button>
            </div>
          )}

          {/* Review Input */}
          {showReviewInput && (
            <div className="w-full bg-zinc-800/50 rounded-3xl p-6 border border-white/10 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={28}
                    className="cursor-pointer transition-transform hover:scale-110"
                    fill={s <= myRating ? "#10b981" : "none"}
                    color={s <= myRating ? "#10b981" : "#3f3f46"}
                    onClick={() => setMyRating(s)}
                  />
                ))}
              </div>
              <textarea
                className="w-full bg-black/40 rounded-2xl p-4 text-sm border border-white/5 focus:border-emerald-500/50 h-24 resize-none outline-none font-medium text-white placeholder:text-zinc-600"
                placeholder="Share your experience with this guide..."
                value={myComment}
                onChange={(e) => setMyComment(e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={() => setShowReviewInput(false)} className="flex-1 py-3 text-zinc-500 text-[10px] font-black uppercase">Cancel</button>
                <button onClick={handleRatingSubmit} disabled={submitting} className="flex-1 py-3 bg-emerald-500 text-black rounded-xl font-black text-[10px] uppercase">{submitting ? "..." : "Post Review"}</button>
              </div>
            </div>
          )}

          {/* Report Form */}
          {showReportForm && (
            <div className="w-full bg-red-500/5 rounded-3xl p-6 border border-red-500/20 animate-in slide-in-from-top-4">
               <div className="flex items-center gap-2 mb-4 text-red-500">
                <AlertTriangle size={20} />
                <span className="font-black text-[10px] uppercase tracking-widest">Report Guide</span>
              </div>
              <select
                className="w-full bg-black/40 rounded-xl p-3 text-[11px] font-bold border border-white/5 mb-3 outline-none text-white"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <option value="" className="bg-zinc-900">Reason for reporting...</option>
                <option value="scam" className="bg-zinc-900">Fraudulent behavior</option>
                <option value="misconduct" className="bg-zinc-900">Safety Misconduct</option>
                <option value="fake" className="bg-zinc-900">Impersonation</option>
              </select>
              <textarea
                className="w-full bg-black/40 rounded-xl p-3 text-[11px] font-medium border border-white/5 h-20 resize-none mb-4 outline-none text-white"
                placeholder="Details..."
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={() => setShowReportForm(false)} className="flex-1 py-2 text-zinc-500 text-[10px] font-black uppercase">Cancel</button>
                <button onClick={handleReportSubmit} className="flex-1 py-2 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase">Submit</button>
              </div>
            </div>
          )}

          {/* Review List */}
          <div className="w-full bg-black/20 rounded-[2.5rem] p-6 border border-white/5">
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6 text-left">
              Traveler Feedback
            </h3>
            <div className="space-y-6">
              {!data.reviews || data.reviews.length === 0 ? (
                <div className="text-[10px] text-zinc-700 italic py-8 text-center uppercase tracking-widest font-black">
                  No feedback history
                </div>
              ) : (
                data.reviews.map((rev) => (
                  <div key={rev.id} className="text-left border-b border-white/5 pb-4 last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-[12px] text-white italic">{rev.reviewer?.fullName}</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={8} fill={i < rev.rating ? "#10b981" : "none"} color={i < rev.rating ? "#10b981" : "#27272a"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};