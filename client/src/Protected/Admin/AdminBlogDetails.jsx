import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  MapPin,
  ArrowLeft,
  ShieldAlert,
  CheckCircle,
  Loader2,
  Trash2, // Added for removal
} from "lucide-react";
import { toast } from "react-hot-toast";

const AdminBlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  const [reports, setReports] = useState([]);
  const [showReports, setShowReports] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);
  const [removing, setRemoving] = useState(false); // State for removal loading

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

  const fetchBlogReports = async () => {
    if (showReports) {
      setShowReports(false);
      return;
    }
    setLoadingReports(true);
    try {
      const res = await api.get(`/admin/blog-reports/${id}`);
      setReports(res.data);
      setShowReports(true);
    } catch (err) {
      toast.error("Could not load reports");
    } finally {
      setLoadingReports(false);
    }
  };

  const resolveBlogReport = async (reportId) => {
    try {
      await api.patch(`/admin/blog-report/resolve/${reportId}`);
      setReports(reports.filter((r) => r.id !== reportId));
      toast.success("Resolved");
    } catch (err) {
      toast.error("Action failed");
    }
  };

  // Logic to hide the blog (Remove Content)
  const removeContent = async () => {
    if (!window.confirm("Are you sure you want to hide this content?")) return;

    setRemoving(true);
    try {
      await api.patch(`/admin/blogs/remove/${id}`);
      toast.success("Content has been hidden");
      navigate(-1); // Go back after hiding
    } catch (err) {
      toast.error("Failed to remove content");
    } finally {
      setRemoving(false);
    }
  };

  if (!blog) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <main className="max-w-4xl mx-auto pb-20">
        {/* Navigation / Admin Actions */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-bold uppercase text-[10px] tracking-widest"
          >
            <ArrowLeft size={14} /> Back to repository
          </button>

          <div className="flex gap-3">
            {/* Remove Content Button */}
            <button
              onClick={removeContent}
              disabled={removing}
              className="flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white disabled:opacity-50"
            >
              {removing ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Trash2 size={12} />
              )}
              Remove Content
            </button>

            {/* View Reports Button */}
            <button
              onClick={fetchBlogReports}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                showReports
                  ? "bg-emerald-500 text-black border-emerald-500"
                  : "bg-zinc-900 text-zinc-400 border-white/5 hover:border-emerald-500/50 hover:text-white"
              }`}
            >
              {loadingReports ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <ShieldAlert size={12} />
              )}
              {showReports ? "Hide Reports" : "View Reports"}
            </button>
          </div>
        </div>

        {/* Admin Reports Panel (Same as before) */}
        {showReports && (
          <div
            className={`mb-5 p-3 rounded-[1.5rem] border animate-in zoom-in-95 duration-300 ${
              reports.length > 0
                ? "bg-red-500/5 border-red-500/20"
                : "bg-zinc-900/50 border-white/10"
            }`}
          >
            <p
              className={`text-[9px] font-black uppercase tracking-[0.2em] mb-2 ${
                reports.length > 0 ? "text-red-500" : "text-emerald-500"
              }`}
            >
              {reports.length > 0
                ? "Flagged Content Warning"
                : "Pending Flagged Content"}
            </p>

            <div className="space-y-2">
              {reports.length === 0 ? (
                <p className="text-zinc-500 italic text-[10px] py-2 px-1">
                  This blog has no pending reports.
                </p>
              ) : (
                reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="flex justify-between items-start bg-black/40 p-2.5 rounded-xl border border-white/5"
                  >
                    <div>
                      <p className="text-[9px] font-bold text-zinc-500 mb-0.5 uppercase tracking-tighter">
                        Reported by: {rep.reporter?.fullName}
                      </p>
                      <p className="text-xs text-zinc-200 leading-snug italic">
                        "{rep.description}"
                      </p>
                    </div>
                    <button
                      onClick={() => resolveBlogReport(rep.id)}
                      className={`p-1 transition-colors ${
                        reports.length > 0
                          ? "text-zinc-600 hover:text-red-500"
                          : "text-zinc-600 hover:text-emerald-500"
                      }`}
                    >
                      <CheckCircle size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Rest of the component (Image, Title, Content) remains same... */}
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
                Author
              </p>
              <p className="text-sm font-bold">{blog.author?.fullName}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Created
              </p>
              <p className="text-sm font-bold text-zinc-400">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

       <div 
  className="prose prose-invert prose-emerald max-w-none text-zinc-300 text-lg leading-relaxed break-words whitespace-normal"
  dangerouslySetInnerHTML={{ __html: blog.content }}
/>
      </main>
    </div>
  );
};

export default AdminBlogDetail;
