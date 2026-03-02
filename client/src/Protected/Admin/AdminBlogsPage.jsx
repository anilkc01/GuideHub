import React, { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import BlogCard from "../Common/BlogCard";


const AdminBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Admin views all blogs from the main endpoint
      const res = await api.get("/blogs");
      setBlogs(res.data);
    } catch (err) { 
      console.error(err); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchBlogs(); 
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <main className="max-w-7xl mx-auto">
        
        {/* Simple Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-5xl font-serif italic font-bold mb-4 text-white">
              Stories
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
              Manage Community Content
            </p>
          </div>
        </div>

        {/* Blog Grid using your existing BlogCard */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin opacity-20" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}

        {/* Floating Add Button */}
        <button 
          onClick={() => navigate("/blogs/write")}
          className="fixed bottom-10 right-10 w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50"
        >
          <Plus color="black" size={32} strokeWidth={3} />
        </button>
      </main>
    </div>
  );
};

export default AdminBlogPage;