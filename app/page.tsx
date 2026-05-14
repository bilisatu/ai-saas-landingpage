'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Star, Users } from 'lucide-react';
import { PlatformSelector } from '@/components/PlatformSelector';
import { InputBox } from '@/components/InputBox';
import { GenerateButton } from '@/components/GenerateButton';
import { ResultCard } from '@/components/ResultCard';

export default function LaunchglowLanding() {
  const [idea, setIdea] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['tiktok', 'instagram', 'linkedin']);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleGenerate = async () => {
    if (!idea.trim()) return;

    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: idea.trim(), platforms: selectedPlatforms }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedContent(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">Launchglow</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm">
            <a href="#features" className="hover:text-purple-400 transition">Features</a>
            <a href="#how" className="hover:text-purple-400 transition">How it Works</a>
            <a href="#pricing" className="hover:text-purple-400 transition">Pricing</a>
          </div>
          <a href="#generator" className="px-6 py-2.5 bg-white text-black rounded-full font-medium hover:bg-purple-500 hover:text-white transition">
            Try for Free
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_30%,rgba(168,85,247,0.15),transparent_70%)]" />
        
        <div className="max-w-5xl mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6"
          >
            <span className="text-purple-400">✦</span> Now in Public Beta
          </motion.div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none mb-6">
            Turn <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">One Idea</span><br />
            Into Content Everywhere
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            The smartest AI content engine for creators & founders. 
            TikTok hooks, Instagram carousels, LinkedIn posts — all in one click.
          </p>

          <div className="flex items-center justify-center gap-4">
            <motion.a
              href="#generator"
              whileHover={{ scale: 1.05 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold text-lg flex items-center gap-3 group"
            >
              Start Creating Free
              <ArrowRight className="group-hover:translate-x-1 transition" />
            </motion.a>
          </div>

          <div className="mt-12 flex justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2"><Star className="text-yellow-400" /> 4.9/5</div>
            <div>Used by 12,450+ creators</div>
            <div className="flex items-center gap-1"><Users /> Trusted by founders</div>
          </div>
        </div>
      </section>

      {/* Content Generator */}
      <section id="generator" className="max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-10 shadow-2xl">
          <PlatformSelector
            selectedPlatforms={selectedPlatforms}
            onPlatformChange={setSelectedPlatforms}
          />
          
          <InputBox
            value={idea}
            onChange={setIdea}
            placeholder="Describe your business or content idea..."
          />

          <GenerateButton 
            onClick={handleGenerate} 
            disabled={!idea.trim() || isGenerating} 
            isLoading={isGenerating} 
          />

          <AnimatePresence>
            {generatedContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <h2 className="text-3xl font-bold text-center mb-8 text-white">Your Generated Content</h2>
                <div className="grid gap-8 md:grid-cols-3">
                  {selectedPlatforms.includes('tiktok') && generatedContent.tiktok && (
                    <ResultCard
                      platform="TikTok"
                      icon="🎵"
                      content={{
                        hooks: generatedContent.tiktok.hooks || [],
                        captions: generatedContent.tiktok.captions || [],
                      }}
                      onCopy={handleCopy}
                      copiedStates={copiedStates}
                    />
                  )}
                  {selectedPlatforms.includes('instagram') && generatedContent.instagram && (
                    <ResultCard
                      platform="Instagram"
                      icon="📸"
                      content={{
                        bio: generatedContent.instagram.bio || '',
                        captions: generatedContent.instagram.captions || [],
                        hashtags: generatedContent.instagram.hashtags || [],
                      }}
                      onCopy={handleCopy}
                      copiedStates={copiedStates}
                    />
                  )}
                  {selectedPlatforms.includes('linkedin') && generatedContent.linkedin && (
                    <ResultCard
                      platform="LinkedIn"
                      icon="💼"
                      content={{
                        posts: generatedContent.linkedin.posts || [],
                      }}
                      onCopy={handleCopy}
                      copiedStates={copiedStates}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <footer className="border-t border-white/10 py-12 text-center text-gray-500 text-sm">
        Made with ❤️ for my brother Safraeel • Launchglow.tech
      </footer>
    </div>
  );
}
