import React, { useState, useEffect } from 'react';
import { 
  Lock, Key, BarChart3, ShieldCheck, ShieldAlert, Users, 
  Terminal, RefreshCw, Cpu, CheckCircle2, AlertOctagon, Check 
} from 'lucide-react';
import { AdminStats } from '../types';

export const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('●●●●●●●●●●●●●●●●●●●●●●●●');
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);
  const [savedSettings, setSavedSettings] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error('Failed to fetch admin stats', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin' || passcode === 'truthlens' || passcode === '1234' || passcode === '') {
      setIsAuthenticated(true);
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  const handleSaveSettings = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-2xl">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-white">TruthLens Admin Portal</h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter administrative authorization credentials to access platform controls.
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-2xl text-left">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Passcode / Access Key</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode (or leave blank to demo)"
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl p-3 focus:outline-none focus:border-blue-500"
            />
            {passError && <p className="text-xs text-rose-400 mt-1">Invalid passcode. Try "admin" or leave blank.</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30"
          >
            Authenticate & Unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Lock className="w-4 h-4" />
            <span>Administrator Operations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Startup System Analytics & API Management
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold hover:bg-rose-500/20"
          >
            Lock Session
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Total Scans Executed</span>
              <BarChart3 className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-2xl font-black text-white mt-2 block">{stats.totalScans}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">↑ 18% vs last week</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Fake News Detected</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-2xl font-black text-rose-400 mt-2 block">{stats.fakeDetectedCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{Math.round((stats.fakeDetectedCount / stats.totalScans) * 100)}% Detection Rate</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Deepfakes Flagged</span>
              <Cpu className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-2xl font-black text-indigo-400 mt-2 block">{stats.deepfakesBlocked}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Audio & Video Neural Models</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>API Health / Uptime</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-black text-emerald-400 mt-2 block">{stats.apiSuccessRate}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Avg Latency: {stats.avgScanTimeMs}ms</span>
          </div>
        </div>
      )}

      {/* Main Admin Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* System Logs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span>Forensic Engine Execution Logs</span>
          </h3>

          <div className="space-y-2.5 font-mono text-xs">
            {stats?.recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    log.status === 'success' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`} />
                  <span className="text-slate-200">{log.action}</span>
                </div>
                <span className="text-[10px] text-slate-500">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* API Keys & Rate Limiting Controls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Key className="w-4 h-4 text-indigo-400" />
            <span>API Gateway & Security Settings</span>
          </h3>

          <div className="space-y-4 text-xs text-slate-300">
            <div>
              <label className="font-bold block mb-1 text-slate-200">Gemini 3.6 API Key (Managed via Environment Secrets)</label>
              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-400 text-xs rounded-xl p-3 font-mono"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Injected automatically from Settings &gt; Secrets on server-side.</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <span className="font-bold text-slate-200 block">Rate Limiting Protection</span>
                <span className="text-[10px] text-slate-400">Limit clients to 60 requests/minute to prevent DDoS.</span>
              </div>
              <input
                type="checkbox"
                checked={rateLimitEnabled}
                onChange={(e) => setRateLimitEnabled(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-0"
              />
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {savedSettings ? <Check className="w-4 h-4" /> : null}
              <span>{savedSettings ? 'Settings Saved!' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
