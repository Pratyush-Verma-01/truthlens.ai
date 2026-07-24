import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, Loader2, Cpu, CheckCircle2, AlertCircle, FileSearch, Sparkles 
} from 'lucide-react';

interface AnalysisModalProps {
  isOpen: boolean;
  onCompleted: () => void;
}

const ANALYSIS_STEPS = [
  'Downloading Content...',
  'Extracting Frames...',
  'Extracting Audio...',
  'Converting Speech to Text...',
  'OCR Reading Text...',
  'Analyzing Metadata...',
  'Checking Reverse Image...',
  'Comparing with Trusted Sources...',
  'Running AI Model...',
  'Generating Final Report...'
];

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onCompleted }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setLogs([]);
      return;
    }

    const intervalTime = 380; // Smooth progress timing
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (next < ANALYSIS_STEPS.length) {
          setLogs((l) => [
            ...l,
            `[${new Date().toLocaleTimeString()}] ✔ ${ANALYSIS_STEPS[next - 1]}`
          ]);
          return next;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            onCompleted();
          }, 400);
          return prev;
        }
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, onCompleted]);

  if (!isOpen) return null;

  const progressPercent = Math.min(
    Math.round(((currentStepIndex + 1) / ANALYSIS_STEPS.length) * 100),
    100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 text-center space-y-6">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header Icon */}
        <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
          <Cpu className="w-8 h-8 animate-pulse text-cyan-300" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-slate-900 animate-ping" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            TruthLens AI Multi-Layer Scanning
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Analyzing media signals, metadata, and cross-referencing news registries
          </p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-blue-400 flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {ANALYSIS_STEPS[currentStepIndex] || 'Finalizing...'}
            </span>
            <span className="text-slate-300 font-mono">{progressPercent}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Live Forensic Terminal Log Window */}
        <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-3.5 font-mono text-[11px] text-left h-36 overflow-y-auto space-y-1 text-slate-300 shadow-inner">
          <div className="text-slate-500 pb-1 border-b border-slate-800 text-[10px] flex items-center justify-between">
            <span>TERMINAL LOGS</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> LIVE
            </span>
          </div>
          {logs.length === 0 ? (
            <p className="text-slate-600 italic">Initializing scanner modules...</p>
          ) : (
            logs.map((log, i) => (
              <p key={i} className="text-slate-300 animate-in fade-in duration-100">
                {log}
              </p>
            ))
          )}
        </div>

        <p className="text-[11px] text-slate-500 italic">
          Powered by Gemini 3.6 Flash & Silicon Valley Forensics Protocol
        </p>
      </div>
    </div>
  );
};
