import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import 'react-quill-new/dist/quill.snow.css';
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import GuideNavBar from "../Guides/GuideNavBar";
import TrekkerNavBar from "../Trekker/TrekkerNavBar";
import api from "../../api/axios";
import toast from "react-hot-toast";

const WriteBlog = ({ userRole, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const editData = location.state?.blog;

  const [title, setTitle] = useState(editData?.title || "");
  const [blogLoc, setBlogLoc] = useState(editData?.location || "");
  const [content, setContent] = useState(editData?.content || "");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(editData?.image ? `http://localhost:5002/${editData.cover}` : null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (editData?.id) formData.append("id", editData.id);
    formData.append("title", title);
    formData.append("location", blogLoc);
    formData.append("content", content);
    if (imageFile) formData.append("image", imageFile);

    try {
      await api.post("/blogs/upsert", formData);
      toast.success("Blog Saved!");
      navigate("/blogs");
    } catch (err) {
      toast.error("Error saving blog");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Dynamic NavBar */}
      {userRole === "guide" ? <GuideNavBar user={user} onLogout={onLogout} /> : <TrekkerNavBar user={user} onLogout={onLogout} />}

      <main className="max-w-4xl mx-auto pt-32 pb-20 px-6">
        {/* Back Button */}
        <button 
          onClick={() => navigate("/blogs")}
          className="flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 px-4 py-2 rounded-xl text-sm font-bold mb-10 transition-all border border-white/5"
        >
          <ArrowLeft size={18} /> Blogs
        </button>

        <div className="flex flex-col gap-6">
          {/* Image Upload Area */}
          <div className="relative h-64 w-full bg-zinc-900/30 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center group hover:border-emerald-500/30 transition-all overflow-hidden">
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <ImageIcon size={40} className="text-zinc-600" />
                <p className="text-xl font-bold text-zinc-500">+ Add Image</p>
              </div>
            )}
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImage} />
          </div>

          {/* Title Input */}
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-zinc-800/40 border border-white/5 rounded-2xl p-6 text-2xl font-bold outline-none focus:bg-zinc-800/60 transition-all"
          />

          {/* Location Input */}
          <input 
            type="text"
            value={blogLoc}
            onChange={(e) => setBlogLoc(e.target.value)}
            placeholder="Location"
            className="w-full bg-zinc-800/20 border border-white/5 rounded-xl p-4 text-zinc-400 outline-none focus:bg-zinc-800/40 transition-all"
          />

          {/* Editor Container */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-4 min-h-[400px] flex flex-col">
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent}
              className="flex-1 text-white border-none"
              placeholder="Write your story here..."
            />
            
            <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-white/5">
              <button onClick={() => navigate("/blogs")} className="text-zinc-500 font-bold px-6">Cancel</button>
              <button 
                onClick={handleSubmit}
                className="bg-emerald-500 text-black px-10 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WriteBlog;