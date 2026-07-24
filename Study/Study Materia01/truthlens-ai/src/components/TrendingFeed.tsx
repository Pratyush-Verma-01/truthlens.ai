import React, { useState } from 'react';
import { Flame, Share2, ShieldAlert, ShieldCheck, Filter, ExternalLink, ArrowRight } from 'lucide-react';
import { TrendingItem } from '../types';

interface TrendingFeedProps {
  items: TrendingItem[];
  onSelectTrending: (item: TrendingItem) => void;
}

export const TrendingFeed: React.FC<TrendingFeedProps> = ({ items, onSelectTrending }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'AI Deepfake', 'Politics', 'Health', 'Finance', 'Global News'];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(i => i.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>Live Viral Misinformation Tracker</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Trending Social Media Fake News & Debunks
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time feed of viral claims analyzed across Instagram, X, TikTok, YouTube, and Threads
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Trending Debunk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isFake = item.verdict === 'fake';
          const isMisleading = item.verdict === 'misleading';

          return (
            <div
              key={item.id}
              onClick={() => onSelectTrending(item)}
              className="group bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Image Banner */}
                {item.imageUrl && (
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-800">
                        {item.platform}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border backdrop-blur-md ${
                        isFake
                          ? 'bg-rose-950/80 text-rose-400 border-rose-500/40'
                          : isMisleading
                            ? 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                            : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                      }`}>
                        {item.verdict.toUpperCase()} ({item.trustScore}% Trust)
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="text-blue-400 font-bold">{item.category}</span>
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Bottom Metrics Bar */}
              <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{item.shares} Viral Impressions</span>
                </div>

                <div className="flex items-center gap-1 text-blue-400 group-hover:translate-x-1 transition-transform font-bold">
                  <span>Inspect Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
