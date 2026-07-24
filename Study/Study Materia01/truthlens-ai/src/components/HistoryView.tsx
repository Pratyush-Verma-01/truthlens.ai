import React, { useState } from 'react';
import { History, Search, Trash2, BookmarkCheck, ExternalLink, ShieldAlert, ArrowRight } from 'lucide-react';
import { AnalysisReport, VerdictType } from '../types';

interface HistoryViewProps {
  reports: AnalysisReport[];
  onSelectReport: (report: AnalysisReport) => void;
  onBookmarkToggle: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  reports,
  onSelectReport,
  onBookmarkToggle
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [verdictFilter, setVerdictFilter] = useState<'all' | VerdictType>('all');

  const filteredReports = reports.filter((r) => {
    const matchesQuery = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.platform.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVerdict = verdictFilter === 'all' || r.verdict === verdictFilter;
    return matchesQuery && matchesVerdict;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Forensic Scan Vault</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Saved Analysis Reports & History
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review and export your past media verification scans and saved bookmarks
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past scans..."
              className="bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500 w-48 sm:w-60"
            />
          </div>

          {/* Verdict Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['all', 'fake', 'misleading', 'genuine'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVerdictFilter(v)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  verdictFilter === v
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-12 text-center space-y-3">
          <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No matching reports found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Perform a new scan using the Detector Engine to populate your personal verification history.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => {
            const isFake = report.verdict === 'fake';
            const isMisleading = report.verdict === 'misleading';

            return (
              <div
                key={report.id}
                onClick={() => onSelectReport(report)}
                className="group bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                      {report.platform}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                      isFake
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : isMisleading
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {report.verdict} ({report.trustScore}% Trust)
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {report.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {report.aiSummary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>{new Date(report.timestamp).toLocaleDateString()}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookmarkToggle(report.id);
                      }}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-blue-400"
                    >
                      <BookmarkCheck className={`w-4 h-4 ${report.bookmarked ? 'text-blue-400' : ''}`} />
                    </button>
                    <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
