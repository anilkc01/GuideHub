import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, User } from "lucide-react";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blogs/${blog.id}`)}
      className="group relative bg-zinc-900/40 border border-white/5 rounded-4xl overflow-hidden cursor-pointer hover:border-emerald-500/30 transition-all duration-500"
    >
      {/* Image Container */}
      <div className="aspect-[16/10] overflow-hidden relative">
        <img
          src={`http://localhost:5002/${blog.cover}`}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />

        {/* Location Badge */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <MapPin size={10} className="text-emerald-400" />
          <span className="text-[9px] font-black uppercase tracking-widest text-white/90">
            {blog.location}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-2 relative z-10">
        <h3 className="text-xl font-bold mb-2 leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2">
          {blog.title}
        </h3>

        <div className="flex items-center gap-3 pt-1.5 pb-2 border-t border-white/5">
          <div className="w-6 h-6 shrink-0 rounded-full border border-white/10 overflow-hidden bg-zinc-800 flex items-center justify-center">
            {blog.author?.dp ? (
              <img
                src={`http://localhost:5002/${blog.author.dp}`}
                className="w-full h-full object-cover"
                alt="author"
              />
            ) : (
              <User size={12} className="text-zinc-500" strokeWidth={3} />
            )}
          </div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            By {blog.author?.fullName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
