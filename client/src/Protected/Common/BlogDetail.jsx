import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import GuideNavBar from "../Guides/GuideNavBar";
import TrekkerNavBar from "../Trekker/TrekkerNavBar";
import { MapPin, ArrowLeft, Flag, AlertTriangle, Trash2 } from "lucide-react"; // Added Trash2
import { toast } from "react-hot-toast";

const BlogDetail = ({ userRole, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog", err);
      }
    };
    fetchBlog();
  }, [id]);

  // Handle Delete (Owner only)
  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this story? This action cannot be undone.",
      )
    )
      return;

    setDeleting(true);
    try {
      await api.delete(`/blogs/${id}`);
      toast.success("Story deleted successfully");
      navigate("/blogs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete story");
    } finally {
      setDeleting(false);
    }
  };

  const handleReportSubmit = async () => {
    if (!reportReason) return toast.error("Please provide a reason");
    setReporting(true);
    try {
      await api.post(`/blogs/report/${id}`, { description: reportReason });
      toast.success("Blog reported to admins");
      setShowReportForm(false);
      setReportReason("");
    } catch (err) {
      toast.error("Failed to submit report");
    } finally {
      setReporting(false);
    }
  };

  if (!blog) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white">
      {userRole === "guide" ? (
        <GuideNavBar user={user} onLogout={onLogout} />
      ) : (
        <TrekkerNavBar user={user} onLogout={onLogout} />
      )}

      <main className="max-w-4xl mx-auto pt-32 pb-20 px-6">
        {/* Navigation / Actions */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-bold uppercase text-[10px] tracking-widest"
          >
            <ArrowLeft size={14} /> Back to stories
          </button>

          <div className="flex gap-3">
            {/* Show Edit & Delete if Owner */}
            {user?.id === blog.authorId ? (
              <>
                <button
                  disabled={deleting}
                  onClick={handleDelete}
                  className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                >
                  <Trash2 size={12} /> {deleting ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => navigate("/blogs/write", { state: { blog } })}
                  className="bg-zinc-800 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                >
                  Edit Story
                </button>
              </>
            ) : (
              /* Show Report if NOT Owner */
              <button
                onClick={() => setShowReportForm(!showReportForm)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  showReportForm
                    ? "bg-red-500 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-red-500/10 hover:text-red-500 border border-white/5"
                }`}
              >
                <Flag size={12} /> {showReportForm ? "Cancel" : "Report Story"}
              </button>
            )}
          </div>
        </div>

        {/* Inline Report Form UI... */}
        {showReportForm && (
          <div className="mb-10 p-6 bg-red-500/5 border border-red-500/20 rounded-[2rem] animate-in slide-in-from-top-4 duration-500">
            {/* ... same as your previous code ... */}
            <div className="flex items-center gap-2 text-red-500 mb-4">
              <AlertTriangle size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Report Content violation
              </span>
            </div>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Why are you reporting this story?"
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-zinc-300 outline-none focus:border-red-500/50 min-h-[100px] mb-4"
            />
            <button
              onClick={handleReportSubmit}
              disabled={reporting}
              className="w-full py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
            >
              {reporting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        )}

        {/* Blog Content UI (Feature Image, Intro, Content) ... same as your previous code ... */}
        <div className="w-full h-[500px] rounded-[2rem] overflow-hidden mb-5 border border-white/5">
          <img
            src={`http://localhost:5002/${blog.cover}`}
            className="w-full h-full object-cover"
            alt="Cover"
          />
        </div>

        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold italic leading-tight mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <MapPin size={14} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              {blog.location}
            </span>
          </div>
          <div className="flex items-center gap-4 border-y border-white/5 py-4">
            <img
              src={`http://localhost:5002/${blog.author?.dp}`}
              className="w-12 h-12 rounded-full object-cover border border-white/10"
              alt="Author"
            />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Written by
              </p>
              <p className="text-sm font-bold">{blog.author?.fullName}</p>
            </div>
          </div>
        </div>

        <div
          className="prose prose-invert prose-emerald max-w-none text-zinc-300 text-lg leading-relaxed selection:bg-emerald-500/30"
          style={{
            textAlign: "left", // Avoids the huge gaps between words
            wordBreak: "break-word", // Only breaks at spaces or hyphens
            overflowWrap: "break-word", // Extra safety for long URLs
            hyphens: "none", // Prevents the browser from adding its own dashes
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </main>
    </div>
  );
};

export default BlogDetail;
