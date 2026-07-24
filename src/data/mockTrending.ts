import { TrendingItem } from '../types';

export const INITIAL_TRENDING: TrendingItem[] = [
  {
    id: 'tr-01',
    title: 'Viral Video Claiming AI Robot Passed Bar Exam Without Human Prompts',
    platform: 'X (Twitter)',
    verdict: 'misleading',
    trustScore: 32,
    shares: '240K',
    category: 'AI Deepfake',
    summary: 'Video features a manipulated voiceover from a 2023 robotics exhibition staged with spliced footage from a legal research simulation.',
    date: '2 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    sourceUrl: 'https://twitter.com/example/status/123456'
  },
  {
    id: 'tr-02',
    title: 'Fabricated Audio Clip of Major Political Leader Resigning Before Debate',
    platform: 'Instagram Reel',
    verdict: 'fake',
    trustScore: 8,
    shares: '1.2M',
    category: 'Politics',
    summary: 'Voice cloning analysis reveals high frequency spectral repetition characteristic of ElevenLabs AI audio voice model with added background tape hiss.',
    date: '5 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    sourceUrl: 'https://instagram.com/p/example123'
  },
  {
    id: 'tr-03',
    title: 'Altered Photo Showing Volcano Eruption Next to Metropolitan Skyline',
    platform: 'Facebook',
    verdict: 'fake',
    trustScore: 12,
    shares: '850K',
    category: 'Global News',
    summary: 'Composite image made by layering a 2018 Chilean volcano plume onto a Tokyo night skyscraper shot using Photoshop composite blending.',
    date: '1 day ago',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    sourceUrl: 'https://facebook.com/watch/example'
  },
  {
    id: 'tr-04',
    title: 'Official WHO Release Confirming New Dietary Guideline Update',
    platform: 'News Article',
    verdict: 'genuine',
    trustScore: 98,
    shares: '45K',
    category: 'Health',
    summary: 'Verified press document matching WHO official press registry and confirmed by international public health correspondents.',
    date: '1 day ago',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    sourceUrl: 'https://who.int/news/item/example'
  },
  {
    id: 'tr-05',
    title: 'Cloned Deepfake Reel of Tech CEO Handing Out Free Cryptocurrency',
    platform: 'YouTube Shorts',
    verdict: 'fake',
    trustScore: 4,
    shares: '3.1M',
    category: 'Finance',
    summary: 'Classic lip-sync deepfake using lip-animation models applied over a 2022 key-note livestream to promote a fraudulent crypto wallet site.',
    date: '2 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=800&q=80',
    sourceUrl: 'https://youtube.com/shorts/example'
  },
  {
    id: 'tr-06',
    title: 'Threads Post Claiming Major Solar Flare Outage Disrupted Global Banking',
    platform: 'Threads',
    verdict: 'misleading',
    trustScore: 28,
    shares: '190K',
    category: 'Global News',
    summary: 'NASA observed a routine solar flare class M, but bank disruptions were caused by a localized undersea cloud datacenter routine maintenance window.',
    date: '3 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    sourceUrl: 'https://threads.net/@example'
  }
];
