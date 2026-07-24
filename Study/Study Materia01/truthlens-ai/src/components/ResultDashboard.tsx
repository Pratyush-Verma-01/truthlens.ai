import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, 
  Share2, Download, Bookmark, BookmarkCheck, ExternalLink, Clock, 
  Cpu, FileText, Video, Mic, Image as ImageIcon, Sparkles, HelpCircle, ArrowLeft 
} from 'lucide-react';
import { AnalysisReport } from '../types';
import { exportReportToPrintPDF } from '../utils/pdfGenerator';

interface ResultDashboardProps {
  report: AnalysisReport;
  onBookmarkToggle: (id: string) => void;
  onOpenAssistant: () => void;
  onNewScan: () => void;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  report,
  onBookmarkToggle,
  onOpenAssistant,
  onNewScan
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'forensics' | 'sources' | 'timeline'>('overview');
  const [copied, setCopied] = useState(false);

  const isFake = report.verdict === 'fake';
  const isMisleading = report.verdict === 'misleading';
  const isGenuine = report.verdict === 'genuine';

  const verdictColor = isFake
    ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    : isMisleading
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
      : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={onNewScan}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Forensic Scan</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onBookmarkToggle(report.id)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              report.bookmarked
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {report.bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4 text-blue-400" />}
            <span>{report.bookmarked ? 'Saved' : 'Save Report'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <Share2 className="w-4 h-4 text-indigo-400" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => exportReportToPrintPDF(report)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>

          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white transition-all"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Ask Lens AI</span>
          </button>
        </div>
      </div>

      {/* Hero Header & Trust Score Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Trust Score Gauge Card */}
        <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <span className={`px-3 py-1 rounded-full text-xs font-extrabold border uppercase tracking-wider mb-4 ${verdictColor}`}>
            {report.verdict.toUpperCase()} DETECTED
          </span>

          {/* Gauge Ring Visual */}
          <div className="relative w-40 h-40 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-950"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className={`${isFake ? 'stroke-rose-500' : isMisleading ? 'stroke-amber-500' : 'stroke-emerald-500'} transition-all duration-1000`}
                strokeWidth="10"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * (isFake ? report.fakePercentage : report.trustScore)) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-4xl font-black ${isFake ? 'text-rose-400' : isMisleading ? 'text-amber-400' : 'text-emerald-400'}`}>
                {isFake ? `${report.fakePercentage}%` : `${report.trustScore}%`}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {isFake ? 'Fake Score' : 'Trust Score'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-2">
            Target Platform: <span className="text-slate-200 font-semibold">{report.platform}</span>
          </p>
        </div>

        {/* Content Title & Metrics Grid */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-2">
              <span>SCAN ID: {report.id}</span>
              <span>•</span>
              <span>{new Date(report.timestamp).toLocaleString()}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {report.title}
            </h1>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-xs text-slate-400 block font-medium">Confidence Score</span>
              <span className="text-lg font-bold text-blue-400">{report.confidenceScore}%</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-xs text-slate-400 block font-medium">Authenticity Score</span>
              <span className="text-lg font-bold text-emerald-400">{report.authenticityScore}%</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-xs text-slate-400 block font-medium">Manipulation Level</span>
              <span className="text-lg font-bold text-rose-400">{report.manipulationScore}%</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-xs text-slate-400 block font-medium">Virality Index</span>
              <span className="text-lg font-bold text-indigo-400">{report.viralityScore}%</span>
            </div>
          </div>

          {/* Plain English AI Explanation */}
          <div className="bg-slate-950/90 border border-slate-800/90 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-1.5">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>AI Plain-English Executive Summary</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {report.aiSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation for Detailed Analysis */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'overview', label: 'Truth Breakdown' },
          { id: 'forensics', label: 'Forensic Deep Dives' },
          { id: 'sources', label: 'Fact Check Sources (' + report.evidenceSources.length + ')' },
          { id: 'timeline', label: 'Viral Provenance Timeline' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & TRUTH BREAKDOWN */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What is True */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>✔ What is Verified True</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              {report.whatIsTrue.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What is False */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2 border-b border-slate-800 pb-3">
              <XCircle className="w-5 h-5 text-rose-400" />
              <span>❌ What is False / Fabricated</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              {report.whatIsFalse.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Context */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>⚠️ Missing Context</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              {report.missingContext.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Possible Manipulations */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <span>🔍 Detected Manipulations</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              {report.possibleManipulations.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: FORENSIC DEEP DIVES */}
      {activeTab === 'forensics' && (
        <div className="space-y-6">
          {/* Video & Deepfake Analysis */}
          {report.videoForensics && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-400" />
                  <span>Video & Deepfake Frame Analysis</span>
                </h3>
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                  Deepfake Score: {report.videoForensics.deepfakeScore}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {report.videoForensics.indicators.map((ind, i) => (
                  <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{ind.type}</span>
                      <span className="text-[10px] uppercase font-bold text-rose-400">{ind.severity} severity</span>
                    </div>
                    <p className="text-xs text-slate-400">{ind.description}</p>
                    <span className="text-[11px] text-blue-400 font-mono block">Confidence: {ind.confidence}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audio & Speech Analysis */}
          {report.audioAnalysis && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mic className="w-5 h-5 text-indigo-400" />
                  <span>Audio & Voice Cloning Forensics</span>
                </h3>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  Voice Cloning Index: {report.audioAnalysis.voiceCloningScore}%
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Extracted Speech Transcript:</span>
                <p className="text-xs sm:text-sm text-slate-200 italic font-mono bg-slate-900 p-3 rounded-lg border border-slate-800/80">
                  "{report.audioAnalysis.transcript}"
                </p>
                <p className="text-xs text-slate-400 pt-1">
                  <strong>Spectrum Note:</strong> {report.audioAnalysis.backgroundAudioNote}
                </p>
              </div>
            </div>
          )}

          {/* Image & ELA Analysis */}
          {report.imageForensics && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-cyan-400" />
                  <span>Image Photoshop & AI Signature Forensics</span>
                </h3>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                  AI Gen Score: {report.imageForensics.aiGeneratedScore}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block font-medium">Detected Editing Software:</span>
                  <span className="text-sm font-bold text-white mt-1 block">{report.imageForensics.softwareUsed || 'None'}</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block font-medium">Error Level Analysis (ELA):</span>
                  <span className="text-xs text-slate-200 mt-1 block">{report.imageForensics.elaNotes}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FACT CHECK SOURCES */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-300">Verified Cross-Reference Matches:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.evidenceSources.map((src, i) => (
              <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                    {src.source}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    {src.credibilityScore}% Credibility
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">{src.title}</h4>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>Rating: <strong className="text-slate-200">{src.rating}</strong></span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-400 hover:underline"
                  >
                    <span>View Article</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: VIRAL PROVENANCE TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Clock className="w-5 h-5 text-blue-400" />
            <span>Viral Propagation Timeline & History Trail</span>
          </h3>

          <div className="relative border-l-2 border-blue-500/30 pl-6 space-y-6 ml-2">
            <div>
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-950" />
              <span className="text-xs font-mono font-bold text-blue-400">{report.timeline.originalUploadDate}</span>
              <h4 className="text-sm font-bold text-white">First Identified Appearance</h4>
              <p className="text-xs text-slate-400 mt-0.5">{report.timeline.firstAppearance}</p>
            </div>

            <div>
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-500 border-4 border-slate-950" />
              <span className="text-xs font-mono font-bold text-indigo-400">{report.timeline.viralPeakDate}</span>
              <h4 className="text-sm font-bold text-white">Viral Acceleration & Platform Spread</h4>
              <p className="text-xs text-slate-400 mt-0.5">{report.timeline.historyNotes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
