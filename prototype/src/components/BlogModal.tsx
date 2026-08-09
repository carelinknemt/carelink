import { X, BookOpen, Clock, Calendar, ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { BLOG_POSTS } from '../data/carelinkData';
import type { BlogPost } from '../types';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ isOpen, onClose, onOpenBooking }) => {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) {
return null;
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative my-8 w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-[#004B87] px-6 py-4 text-white shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-orange-400" />
            <h3 className="text-lg font-black">
              {activePost ? activePost.title : 'Carelink NEMT Content Hub'}
            </h3>
          </div>
          <button
            onClick={() => {
              if (activePost) {
setActivePost(null);
} else {
onClose();
}
            }}
            className="rounded-full p-1 hover:bg-white/20 text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!activePost ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {BLOG_POSTS.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setActivePost(post)}
                  className="group cursor-pointer rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="h-40 overflow-hidden">
                    <img src={post.image} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-4 flex flex-col flex-1 justify-between text-xs space-y-2">
                    <div>
                      <span className="text-[10px] font-black text-[#E64A19] uppercase bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {post.category}
                      </span>
                      <h4 className="font-bold text-slate-900 mt-1 line-clamp-2">{post.title}</h4>
                      <p className="text-slate-600 text-[11px] mt-1 line-clamp-3">{post.summary}</p>
                    </div>
                    <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200">
                      <span>{post.date}</span>
                      <span className="font-bold text-[#E64A19] group-hover:underline flex items-center gap-1">
                        Read <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <button
                onClick={() => setActivePost(null)}
                className="text-[#E64A19] font-bold hover:underline mb-2 flex items-center gap-1"
              >
                &larr; Back to all guides
              </button>

              <div className="h-64 rounded-2xl overflow-hidden shadow-md">
                <img src={activePost.image} alt={activePost.title} className="h-full w-full object-cover" />
              </div>

              <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {activePost.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {activePost.readTime}</span>
                <span className="bg-orange-50 text-[#E64A19] border border-orange-200 font-bold px-2 py-0.5 rounded">{activePost.category}</span>
              </div>

              <h3 className="text-2xl font-black text-[#004B87]">{activePost.title}</h3>

              <div className="text-slate-700 space-y-3 leading-relaxed text-xs">
                <p className="font-bold text-slate-900">{activePost.summary}</p>
                <p>{activePost.content}</p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
