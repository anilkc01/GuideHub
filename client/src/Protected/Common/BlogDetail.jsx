import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import GuideNavBar from "../Guides/GuideNavBar";
import TrekkerNavBar from "../Trekker/TrekkerNavBar";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";

const BlogDetail = ({ userRole, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
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

  if (!blog) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white">
      {userRole === "guide" ? <GuideNavBar user={user} onLogout={onLogout} /> : <TrekkerNavBar user={user} onLogout={onLogout} />}

      <main className="max-w-4xl mx-auto pt-32 pb-20 px-6">
        {/* Navigation / Actions */}
        <div className="flex justify-between items-center mb-12">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-bold uppercase text-[10px] tracking-widest">
            <ArrowLeft size={14} /> Back to stories
          </button>
          
          {/* Show Edit Button only if the viewer is the author */}
          {user?.id === blog.authorId && (
            <button 
              onClick={() => navigate("/blogs/write", { state: { blog } })}
              className="bg-zinc-800 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
            >
              Edit Story
            </button>
          )}
        </div>

       

        {/* Feature Image */}
        <div className="w-full h-[500px] rounded-[2rem] overflow-hidden mb-5 border border-white/5">
          <img src={`http://localhost:5002/${blog.cover}`} className="w-full h-full object-cover" alt="Cover" />
        </div>

          {}{/* Blog intro */}
         <div className="mb-12">
          
          <h1 className="text-4xl font-serif font-bold italic leading-tight mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <MapPin size={14} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">{blog.location}</span>
          </div>
          
          <div className="flex items-center gap-4 border-y border-white/5 py-4">
            <img src={`http://localhost:5000/${blog.author?.dp}`} className="w-12 h-12 rounded-full object-cover border border-white/10" alt="Author" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Written by</p>
              <p className="text-sm font-bold">{blog.author?.fullName}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Published on</p>
              <p className="text-sm font-bold text-zinc-400">{new Date(blog.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Content - Rendered from React Quill */}
        <div 
          className="prose prose-invert prose-emerald max-w-none text-zinc-300 text-lg leading-relaxed selection:bg-emerald-500/30"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </main>
    </div>
  );
};

export default BlogDetail;