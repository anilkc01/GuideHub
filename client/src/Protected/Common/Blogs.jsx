import React, { useState, useEffect } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import BlogCard from "./BlogCard";
import GuideNavBar from "../Guides/GuideNavBar";
import TrekkerNavBar from "../Trekker/TrekkerNavBar";

const BlogsPage = ({ userRole, onLogout }) => {
  const [blogs, setBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState("explore"); // "explore" or "my"
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "explore" ? "/blogs" : "/blogs/my";
      const res = await api.get(endpoint);
      setBlogs(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchBlogs(); }, [activeTab]);

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-10">
      {userRole === "guide" ? <GuideNavBar user={user} onLogout={onLogout} /> : <TrekkerNavBar user={user} onLogout={onLogout} />}
      
      <main className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-5xl font-serif italic font-bold mb-4">Stories</h1>
            <div className="flex gap-6">
              {["explore", "my"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === tab ? 'border-emerald-500 text-white' : 'border-transparent text-zinc-600'}`}>
                  {tab === 'explore' ? 'Explore All' : 'My Stories'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? <Loader2 className="animate-spin mx-auto opacity-20" size={40} /> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map(blog => <BlogCard key={blog.id} blog={blog} />)}
          </div>
        )}

        {/* Floating Add Button */}
        <button onClick={() => navigate("/blogs/write")}
          className="fixed bottom-10 right-10 w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50">
          <Plus color="black" size={32} strokeWidth={3} />
        </button>
      </main>
    </div>
  );
};

export default BlogsPage;