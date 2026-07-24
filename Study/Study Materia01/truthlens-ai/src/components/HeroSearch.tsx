import React, { useState, useRef } from 'react';
import { 
  Search, Link as LinkIcon, Upload, Mic, MicOff, FileText, Sparkles, 
  ArrowRight, ShieldAlert, Image as ImageIcon, Video, FileCheck2, Zap 
} from 'lucide-react';
import { AnalysisRequest } from '../types';

interface HeroSearchProps {
  onStartAnalysis: (request: AnalysisRequest) => void;
  isAnalyzing: boolean;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onStartAnalysis, isAnalyzing }) => {
  const [activeInputTab, setActiveInputTab] = useState<'url' | 'upload' | 'text'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [fileSelected, setFileSelected] = useState<{ name: string; dataUrl: string; type: string } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Sample quick test presets
  const samplePresets = [
    { label: 'Viral Deepfake Reel', url: 'https://instagram.com/reels/sample-ai-deepfake-tech-ceo' },
    { label: 'X (Twitter) Claim', url: 'https://x.com/news/status/188239012' },
    { label: 'Manipulated Audio Clip', text: 'Viral audio clip claiming emergency economic shutdown has been confirmed.' },
    { label: 'YouTube Video Link', url: 'https://youtube.com/watch?v=sample-fake-news-report' }
  ];

  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const mimeType = file.type;
      let detectedType = 'image';
      if (mimeType.startsWith('video/')) detectedType = 'video';
      else if (mimeType.startsWith('audio/')) detectedType = 'audio';
      else if (mimeType.includes('pdf')) detectedType = 'pdf';

      setFileSelected({
        name: file.name,
        dataUrl: result,
        type: detectedType
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Mic recording simulation / Web Speech handling
  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setFileSelected({
              name: 'Voice_Recording_' + new Date().toLocaleTimeString() + '.webm',
              dataUrl: base64data,
              type: 'audio'
            });
            setActiveInputTab('upload');
          };
          reader.readAsDataURL(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        alert('Microphone access unavailable or denied. You can paste audio text claims directly.');
      }
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isAnalyzing) return;

    if (activeInputTab === 'url') {
      if (!urlInput.trim()) return alert('Please enter or paste a valid link or URL.');
      onStartAnalysis({
        type: 'url',
        inputUrl: urlInput.trim()
      });
    } else if (activeInputTab === 'text') {
      if (!textInput.trim()) return alert('Please enter the text claim or headline to analyze.');
      onStartAnalysis({
        type: 'text',
        textPayload: textInput.trim()
      });
    } else if (activeInputTab === 'upload') {
      if (!fileSelected) return alert('Please upload an image, video, audio, or PDF file to analyze.');
      onStartAnalysis({
        type: fileSelected.type as any,
        fileData: fileSelected.dataUrl,
        fileName: fileSelected.name
      });
    }
  };

  return (
    <div className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      {/* Background Subtle Glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Startup Tag */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6 shadow-xl backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
        <span>Next-Gen Deepfake & Misinformation Detection</span>
      </div>

      {/* Large Heading */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-[1.15]">
        Detect Fake News <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
          Before You Believe It.
        </span>
      </h1>

      {/* Subheading */}
      <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
        Analyze videos, reels, posts, images and social media links using Artificial Intelligence, 
        spectral forensics, and real-time news verification.
      </p>

      {/* Supported Platform Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs font-semibold text-slate-400">
        <span className="text-slate-500 font-medium mr-1">Supports:</span>
        {['Instagram', 'Facebook', 'YouTube', 'Twitter / X', 'Threads', 'Reddit', 'TikTok', 'News Websites'].map((plat) => (
          <span 
            key={plat}
            className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800/80 text-slate-300 hover:border-blue-500/40 hover:text-white transition-all"
          >
            {plat}
          </span>
        ))}
      </div>

      {/* Main Glassmorphic Search & Analysis Container */}
      <div className="relative bg-slate-900/70 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-2xl p-4 sm:p-6 transition-all duration-300 hover:border-slate-700">
        
        {/* Input Mode Selector Tabs */}
        <div className="flex items-center justify-center gap-2 mb-6 border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveInputTab('url')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeInputTab === 'url'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950/40 border border-slate-800/60'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Paste Link / URL</span>
          </button>

          <button
            onClick={() => setActiveInputTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeInputTab === 'upload'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950/40 border border-slate-800/60'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Media / File</span>
          </button>

          <button
            onClick={() => setActiveInputTab('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeInputTab === 'text'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950/40 border border-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Text Claim / Audio</span>
          </button>
        </div>

        {/* Input Tab Contents */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TAB 1: PASTE URL */}
          {activeInputTab === 'url' && (
            <div className="relative flex items-center">
              <div className="absolute left-4 text-slate-400">
                <LinkIcon className="w-5 h-5 text-blue-400" />
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste Instagram Reel, YouTube, X Post, TikTok or News Article URL..."
                className="w-full bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm sm:text-base rounded-xl pl-12 pr-12 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              {urlInput && (
                <button
                  type="button"
                  onClick={() => setUrlInput('')}
                  className="absolute right-4 text-slate-500 hover:text-slate-300 text-xs font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* TAB 2: UPLOAD FILE */}
          {activeInputTab === 'upload' && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <input
                type="file"
                accept="image/*,video/*,audio/*,application/pdf"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {fileSelected ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <FileCheck2 className="w-10 h-10 text-emerald-400 animate-bounce" />
                  <p className="text-sm font-semibold text-white">{fileSelected.name}</p>
                  <p className="text-xs text-slate-400 uppercase font-mono">Type: {fileSelected.type}</p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFileSelected(null); }}
                    className="mt-2 text-xs text-rose-400 hover:underline"
                  >
                    Remove & choose another
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-center gap-3 text-slate-400">
                    <ImageIcon className="w-6 h-6 text-blue-400" />
                    <Video className="w-6 h-6 text-indigo-400" />
                    <FileText className="w-6 h-6 text-cyan-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-200">
                    Drag and drop your Video, Image, Screenshot or PDF document here
                  </p>
                  <p className="text-xs text-slate-500">
                    Supports MP4, MOV, PNG, JPG, WEBP, MP3, PDF up to 50MB
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TEXT CLAIM & VOICE MIC */}
          {activeInputTab === 'text' && (
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={3}
                  placeholder="Type or paste the headline, quote, or rumor you want to fact-check..."
                  className="w-full bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm rounded-xl p-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                />
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`absolute bottom-3 right-3 p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                    isRecording
                      ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-blue-400" />}
                  <span>{isRecording ? 'Listening...' : 'Voice Search'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Large Action Button: ANALYZE NOW */}
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Zap className="w-5 h-5 text-yellow-300 animate-bounce" />
                <span>Running Forensic Scan...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5 text-white" />
                <span>Analyze Now</span>
                <ArrowRight className="w-5 h-5 text-white/80" />
              </>
            )}
          </button>
        </form>

        {/* Preset Sample Quick Tests */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-left">
          <p className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Or try a quick test sample:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (preset.url) {
                    setActiveInputTab('url');
                    setUrlInput(preset.url);
                  } else if (preset.text) {
                    setActiveInputTab('text');
                    setTextInput(preset.text);
                  }
                }}
                className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 hover:text-blue-400 hover:border-blue-500/40 transition-all"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
