export type VerdictType = 'fake' | 'misleading' | 'genuine' | 'unverified';

export interface SourceMatch {
  title: string;
  source: string;
  url: string;
  rating: string;
  publishDate: string;
  credibilityScore: number;
}

export interface DeepfakeIndicator {
  type: string;
  confidence: number;
  description: string;
  detectedFrameTime?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface AudioAnalysis {
  transcript: string;
  voiceCloningScore: number; // 0-100
  syntheticFrequencyDetected: boolean;
  backgroundAudioNote: string;
}

export interface ImageForensics {
  exifAvailable: boolean;
  softwareUsed?: string;
  aiGeneratedScore: number; // 0-100
  photoshopManipulatedScore: number; // 0-100
  elaNotes: string;
}

export interface VideoForensics {
  deepfakeScore: number; // 0-100
  frameManipulationScore: number; // 0-100
  reusedVideoMatch: boolean;
  keyframeThumbnails: string[];
  indicators: DeepfakeIndicator[];
}

export interface AnalysisReport {
  id: string;
  title: string;
  platform: 'Instagram' | 'Facebook' | 'YouTube' | 'Twitter' | 'Threads' | 'Reddit' | 'TikTok' | 'News Article' | 'Upload' | 'Audio/Claim';
  contentUrl?: string;
  contentType: 'link' | 'image' | 'video' | 'audio' | 'pdf' | 'text';
  timestamp: string;
  verdict: VerdictType;
  trustScore: number; // 0-100 (0 = 100% Fake, 100 = 100% Genuine)
  fakePercentage: number;
  confidenceScore: number;
  authenticityScore: number;
  manipulationScore: number;
  viralityScore: number;
  
  aiSummary: string;
  whatIsTrue: string[];
  whatIsFalse: string[];
  missingContext: string[];
  possibleManipulations: string[];

  audioAnalysis?: AudioAnalysis;
  imageForensics?: ImageForensics;
  videoForensics?: VideoForensics;
  
  timeline: {
    originalUploadDate: string;
    firstAppearance: string;
    viralPeakDate: string;
    historyNotes: string;
  };
  
  evidenceSources: SourceMatch[];
  extractedText?: string;
  bookmarked?: boolean;
}

export interface AnalysisRequest {
  type: 'url' | 'image' | 'video' | 'audio' | 'text' | 'pdf';
  inputUrl?: string;
  textPayload?: string;
  fileData?: string; // base64
  fileName?: string;
  platformHint?: string;
}

export interface TrendingItem {
  id: string;
  title: string;
  platform: string;
  verdict: VerdictType;
  trustScore: number;
  shares: string;
  category: 'Politics' | 'Health' | 'AI Deepfake' | 'Celebrity' | 'Finance' | 'Global News';
  summary: string;
  date: string;
  imageUrl?: string;
  sourceUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  reportContextId?: string;
}

export type LanguageCode = 'en' | 'es' | 'hi' | 'fr' | 'de' | 'ar';

export interface AdminStats {
  totalScans: number;
  fakeDetectedCount: number;
  genuineCount: number;
  deepfakesBlocked: number;
  avgScanTimeMs: number;
  apiSuccessRate: number;
  topPlatforms: { platform: string; count: number }[];
  recentLogs: { id: string; action: string; timestamp: string; status: 'success' | 'warn' | 'error' }[];
}
