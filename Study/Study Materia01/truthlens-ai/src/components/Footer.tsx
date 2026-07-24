import React from 'react';
import { Shield, Lock, Globe, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-blue-500/20">
              TL
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">TruthLens AI</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Premier AI-powered misinformation detection, deepfake analysis, and social media media verification platform.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Operational — All Detection Nodes Online</span>
          </div>
        </div>

        {/* Supported Channels */}
        <div>
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px] mb-3">Supported Platforms</h4>
          <ul className="space-y-1.5 text-slate-400 text-[11px]">
            <li>Instagram Reels & Posts</li>
            <li>TikTok Viral Content</li>
            <li>YouTube Shorts & Videos</li>
            <li>X / Twitter Threads</li>
            <li>Facebook Watch</li>
            <li>Reddit & News Webpages</li>
          </ul>
        </div>

        {/* Forensic Capabilities */}
        <div>
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px] mb-3">AI Technologies</h4>
          <ul className="space-y-1.5 text-slate-400 text-[11px]">
            <li>Gemini 3.6 Flash Engine</li>
            <li>Neural Audio Voice Clone Check</li>
            <li>Deepfake Facial Lip Sync Check</li>
            <li>Error Level Analysis (ELA)</li>
            <li>Google Fact Check Grounding</li>
          </ul>
        </div>

        {/* Legal & Security */}
        <div>
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px] mb-3">Security & Compliance</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Built using ISO-certified security practices, Rate Limit Protection, and encrypted server-side processing.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>Zero Data Selling • Privacy Protected</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <p>© 2026 TruthLens AI Inc. All rights reserved.</p>
        <p>Built with React, Express, Tailwind CSS, & Gemini AI SDK.</p>
      </div>
    </footer>
  );
};
