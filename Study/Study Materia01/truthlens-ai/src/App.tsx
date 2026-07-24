import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, saveUserProfile } from './lib/firebase';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { AnalysisModal } from './components/AnalysisModal';
import { ResultDashboard } from './components/ResultDashboard';
import { TrendingFeed } from './components/TrendingFeed';
import { HistoryView } from './components/HistoryView';
import { AiChatAssistant } from './components/AiChatAssistant';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { AnalysisReport, AnalysisRequest, TrendingItem, LanguageCode } from './types';
import { INITIAL_TRENDING } from './data/mockTrending';

export default function App() {
  const [activeTab, setActiveTab] = useState<'detector' | 'trending' | 'history' | 'assistant' | 'admin'>('detector');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [currentReport, setCurrentReport] = useState<AnalysisReport | null>(null);
  const [historyReports, setHistoryReports] = useState<AnalysisReport[]>([]);
  const [trendingList, setTrendingList] = useState<TrendingItem[]>(INITIAL_TRENDING);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        saveUserProfile(user);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch initial history and trending from server
  useEffect(() => {
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setHistoryReports(data);
        }
      })
      .catch(err => console.warn('Could not fetch server history', err));

    fetch('/api/trending')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTrendingList(data);
        }
      })
      .catch(err => console.warn('Could not fetch server trending', err));
  }, []);

  const handleStartAnalysis = async (request: AnalysisRequest) => {
    setIsAnalyzing(true);
    setIsModalOpen(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      const newReport: AnalysisReport = await res.json();

      // Store in pending state so when modal animation completes, we display it
      (window as any).__pendingReport = newReport;
    } catch (err) {
      console.error('Error during analysis request:', err);
    }
  };

  const handleAnalysisCompleted = () => {
    setIsModalOpen(false);
    setIsAnalyzing(false);

    const report: AnalysisReport | undefined = (window as any).__pendingReport;
    if (report) {
      setCurrentReport(report);
      setHistoryReports(prev => [report, ...prev.filter(r => r.id !== report.id)]);
      (window as any).__pendingReport = null;
    }
  };

  const handleBookmarkToggle = async (id: string) => {
    try {
      const res = await fetch('/api/history/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setHistoryReports(prev => prev.map(r => r.id === id ? { ...r, bookmarked: data.bookmarked } : r));
        if (currentReport && currentReport.id === id) {
          setCurrentReport(prev => prev ? { ...prev, bookmarked: data.bookmarked } : null);
        }
      }
    } catch (e) {
      console.error('Error toggling bookmark', e);
    }
  };

  const handleSelectTrending = (item: TrendingItem) => {
    // Generate a full report view from the trending item
    const trendingReport: AnalysisReport = {
      id: 'tr-rep-' + item.id,
      title: item.title,
      platform: item.platform as any,
      contentType: 'link',
      timestamp: new Date().toISOString(),
      verdict: item.verdict,
      trustScore: item.trustScore,
      fakePercentage: 100 - item.trustScore,
      confidenceScore: 95,
      authenticityScore: item.trustScore,
      manipulationScore: 100 - item.trustScore,
      viralityScore: 92,
      aiSummary: item.summary,
      whatIsTrue: [
        'The media assets correspond to real underlying event recordings.',
        'Public statements regarding the topic exist in official news archives.'
      ],
      whatIsFalse: [
        'Audio tracks/headlines were altered or extracted out of context.',
        'Claimed dates misrepresent event timeline by several months.'
      ],
      missingContext: [
        'Viral social media clips omitted crucial explanatory context issued by primary sources.'
      ],
      possibleManipulations: [
        'AI Voice Cloning / Spliced Frame Overlay',
        'Out-of-Context Recirculation'
      ],
      timeline: {
        originalUploadDate: item.date,
        firstAppearance: item.platform,
        viralPeakDate: 'Recent 24 Hours',
        historyNotes: 'Viral growth peak achieved across video sharing networks.'
      },
      evidenceSources: [
        {
          title: 'Official Fact-Check Verification Entry',
          source: 'TruthLens Forensic Registry',
          url: item.sourceUrl || 'https://reuters.com',
          rating: item.verdict.toUpperCase(),
          publishDate: item.date,
          credibilityScore: 96
        }
      ],
      bookmarked: false
    };

    setCurrentReport(trendingReport);
    setActiveTab('detector');
  };

  const savedCount = historyReports.filter(r => r.bookmarked).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'assistant') {
            setIsAssistantOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        language={language}
        setLanguage={setLanguage}
        savedCount={savedCount}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onSignOut={() => signOut(auth)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'detector' && (
          <>
            {currentReport ? (
              <ResultDashboard
                report={currentReport}
                onBookmarkToggle={handleBookmarkToggle}
                onOpenAssistant={() => setIsAssistantOpen(true)}
                onNewScan={() => setCurrentReport(null)}
              />
            ) : (
              <HeroSearch
                onStartAnalysis={(req) => {
                  if (!currentUser) {
                    setAuthModalOpen(true);
                  }
                  handleStartAnalysis(req);
                }}
                isAnalyzing={isAnalyzing}
              />
            )}
          </>
        )}

        {activeTab === 'trending' && (
          <TrendingFeed
            items={trendingList}
            onSelectTrending={handleSelectTrending}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            reports={historyReports}
            onSelectReport={(report) => {
              setCurrentReport(report);
              setActiveTab('detector');
            }}
            onBookmarkToggle={handleBookmarkToggle}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel />
        )}
      </main>

      {/* Auth Gate / Sign In Sign Up Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Analysis Progress Scanner Overlay */}
      <AnalysisModal
        isOpen={isModalOpen}
        onCompleted={handleAnalysisCompleted}
      />

      {/* AI Assistant Drawer ("Lens AI") */}
      <AiChatAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
