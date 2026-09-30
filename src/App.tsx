/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Copy,
  Check,
  Download,
  Sun,
  Moon,
  Printer,
  ArrowUpRight,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  POLICY_META,
  CORE_PRINCIPLES,
  CLIENT_STORAGE_INVENTORY,
  BACKEND_MEMORY_STORES,
  EXTERNAL_DATA_FLOWS,
  USER_CONTROL_MECHANISMS,
  POLICY_CHAPTERS,
  generatePolicyMarkdown,
} from './data/privacyPolicyData';
import { LiveStorageInspector } from './components/LiveStorageInspector';
import { PolicyExportModal } from './components/PolicyExportModal';

type ViewMode = 'full' | 'summary' | 'markdown';
type StorageScopeFilter = 'all' | 'localStorage' | 'sessionStorage';
type StorageCategoryFilter =
  | 'All'
  | 'Preferences'
  | 'History & Ephemeral'
  | 'Workspace & Curation'
  | 'Crawler & Indexing'
  | 'AI & Community';
type ExternalFlowFilter = 'all' | 'default' | 'optional';

export default function App() {
  // Persist theme in `isaac_theme` just as specified in the privacy architecture
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = window.localStorage.getItem('isaac_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore storage errors
    }
    return 'light';
  });

  const [viewMode, setViewMode] = useState<ViewMode>('full');
  const [activeSectionId, setActiveSectionId] = useState<string>('core-architecture');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Storage inventory filters
  const [storageSearch, setStorageSearch] = useState<string>('');
  const [storageScope, setStorageScope] = useState<StorageScopeFilter>('all');
  const [storageCategory, setStorageCategory] = useState<StorageCategoryFilter>('All');

  // External flow filter
  const [externalFilter, setExternalFilter] = useState<ExternalFlowFilter>('all');

  // Modals & clipboard states
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [copiedQuickMd, setCopiedQuickMd] = useState<boolean>(false);

  useEffect(() => {
    try {
      window.localStorage.setItem('isaac_theme', theme);
    } catch {
      // ignore
    }
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      setScrollProgress(pct);

      const sectionIds = POLICY_CHAPTERS.map((c) => c.id);
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180) {
            setActiveSectionId(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredStorageItems = useMemo(() => {
    return CLIENT_STORAGE_INVENTORY.filter((item) => {
      if (storageScope !== 'all' && item.storageType !== storageScope) return false;
      if (storageCategory !== 'All' && item.category !== storageCategory) return false;
      if (storageSearch.trim() !== '') {
        const q = storageSearch.toLowerCase();
        const matchKey = item.key.toLowerCase().includes(q);
        const matchComp = item.component.toLowerCase().includes(q);
        const matchPurpose = item.purpose.toLowerCase().includes(q);
        const matchType = item.dataType.toLowerCase().includes(q);
        return matchKey || matchComp || matchPurpose || matchType;
      }
      return true;
    });
  }, [storageScope, storageCategory, storageSearch]);

  const filteredExternalFlows = useMemo(() => {
    return EXTERNAL_DATA_FLOWS.filter((flow) => {
      if (externalFilter === 'default') return !flow.isOptionalServerConfig;
      if (externalFilter === 'optional') return flow.isOptionalServerConfig;
      return true;
    });
  }, [externalFilter]);

  const markdownFullText = useMemo(() => generatePolicyMarkdown(), []);

  const handleQuickCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdownFullText);
      setCopiedQuickMd(true);
      window.setTimeout(() => setCopiedQuickMd(false), 2500);
    } catch {
      setIsExportModalOpen(true);
    }
  };

  const scrollToSection = (id: string) => {
    if (viewMode !== 'full') {
      setViewMode('full');
      window.setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-150 ${
        theme === 'dark'
          ? 'dark bg-[#0C0D0E] text-stone-100'
          : 'bg-[#FBF9F5] text-stone-900'
      }`}
    >
      {/* Reading Depth Progress Line */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-stone-200 dark:bg-stone-800 z-40 no-print">
        <div
          className="h-full bg-amber-900 dark:bg-amber-500 transition-transform duration-100 origin-left"
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
        />
      </div>

      {/* Top Bar Contract: Exactly 3 zones (1: Brand wordmark, 2: 5 nav links, 3: 2 primary actions) */}
      <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 dark:bg-[#0C0D0E]/95 backdrop-blur-xs border-b border-stone-200 dark:border-stone-800 px-6 lg:px-12 py-4 flex items-center justify-between no-print">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="text-xl font-editorial font-semibold tracking-tight text-stone-950 dark:text-stone-50 whitespace-nowrap"
        >
          Isaac Search Engine
        </a>

        {/* Zone 2: 5 clean text navigation links */}
        <nav aria-label="Primary sections" className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600 dark:text-stone-400">
          <button
            type="button"
            onClick={() => scrollToSection('core-architecture')}
            className="hover:text-stone-950 dark:hover:text-stone-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
          >
            Principles
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('client-storage')}
            className="hover:text-stone-950 dark:hover:text-stone-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
          >
            Storage Ledger
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('backend-handling')}
            className="hover:text-stone-950 dark:hover:text-stone-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
          >
            Backend &amp; RAM
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('external-flows')}
            className="hover:text-stone-950 dark:hover:text-stone-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
          >
            External Flows
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('user-controls')}
            className="hover:text-stone-950 dark:hover:text-stone-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
          >
            User Controls
          </button>
        </nav>

        {/* Zone 3: Primary action */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2 text-xs font-medium bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-colors whitespace-nowrap cursor-pointer"
          >
            Export Policy
          </button>
        </div>
      </header>

      {/* Operational Utility Strip (Institutional Metadata Bar - Zero Pill Enclosures) */}
      <div
        id="top"
        className="border-b border-stone-200 dark:border-stone-800 bg-[#F5F1E9] dark:bg-stone-900/50 px-6 lg:px-12 py-2.5"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1 text-xs text-stone-600 dark:text-stone-400">
          <div className="flex flex-wrap items-center gap-x-2">
            <span>Document Governance: Privacy &amp; Data Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Effective Date: {POLICY_META.effectiveDate}</span>
            <span aria-hidden="true">·</span>
            <span>{POLICY_META.version}</span>
          </div>
          <div className="flex items-center gap-x-2 font-mono text-xs tabular-nums">
            <span>Mandatory Accounts: 0</span>
            <span aria-hidden="true">·</span>
            <span>Client Storage Keys: 17</span>
            <span aria-hidden="true">·</span>
            <span>External Proxy Flows: 7</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
        {/* Institutional Hero Header */}
        <section className="pb-12 border-b border-stone-300 dark:border-stone-800">
          <div className="text-xs tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans">
            Public Technical Disclosure · Zero-Account Local-First Specification
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-editorial font-normal tracking-tight text-stone-950 dark:text-stone-50 mt-3 leading-[1.12] max-w-4xl">
            Privacy Policy &amp; Data Handling Architecture
          </h1>

          <p className="mt-6 text-base sm:text-lg text-stone-700 dark:text-stone-300 leading-relaxed max-w-3xl">
            {POLICY_META.summaryStatement}
          </p>

          {/* Interactive Reading Mode Switcher & Quick Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-stone-200 dark:border-stone-800/80 no-print">
            {/* Functional Segmented Filter Control */}
            <div
              role="tablist"
              aria-label="Document reading mode"
              className="inline-flex items-center gap-1 p-1 bg-stone-200/75 dark:bg-stone-900 border border-stone-300/80 dark:border-stone-800"
            >
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === 'full'}
                onClick={() => setViewMode('full')}
                className={`px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  viewMode === 'full'
                    ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-stone-50 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Full Legal &amp; Technical Policy
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === 'summary'}
                onClick={() => setViewMode('summary')}
                className={`px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  viewMode === 'summary'
                    ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-stone-50 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Plain-Language Executive Brief
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === 'markdown'}
                onClick={() => setViewMode('markdown')}
                className={`px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  viewMode === 'markdown'
                    ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-stone-50 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Raw Markdown Source (.md)
              </button>
            </div>

            {/* Direct Copy & Print Utilities */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleQuickCopyMarkdown}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors whitespace-nowrap cursor-pointer"
              >
                {copiedQuickMd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedQuickMd ? 'Copied Markdown' : 'Copy Markdown'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

          {/* 4 Core Architectural Pillars Grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-stone-200 dark:border-stone-800">
            {CORE_PRINCIPLES.map((pillar) => (
              <div key={pillar.index} className="flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-amber-900 dark:text-amber-400 tabular-nums">
                    Principle {pillar.index}
                  </div>
                  <h2 className="text-lg font-editorial font-medium text-stone-950 dark:text-stone-100 mt-1">
                    {pillar.title}
                  </h2>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                    {pillar.detail}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-200/80 dark:border-stone-800/80 text-xs font-medium text-stone-800 dark:text-stone-300">
                  {pillar.summary}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MODE 2: PLAIN-LANGUAGE EXECUTIVE BRIEF */}
        {viewMode === 'summary' && (
          <section className="py-12 space-y-12">
            <div className="max-w-3xl">
              <div className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400">
                Executive Privacy Summary
              </div>
              <h2 className="text-3xl font-editorial text-stone-950 dark:text-stone-50 mt-1">
                How Isaac Search Engine Protects Your Privacy in Plain English
              </h2>
              <p className="mt-4 text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                This summary distills our technical architecture into clear, verifiable commitments. For the complete
                storage key ledger and backend endpoint rules, switch to the{' '}
                <button
                  type="button"
                  onClick={() => setViewMode('full')}
                  className="underline text-amber-900 dark:text-amber-400 font-medium cursor-pointer"
                >
                  Full Legal &amp; Technical Policy
                </button>
                .
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-stone-200 dark:border-stone-800 pt-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-editorial font-medium text-stone-950 dark:text-stone-100">
                    What Stays 100% On Your Device
                  </h3>
                  <ul className="mt-3 space-y-3 text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    <li>
                      <strong className="text-stone-900 dark:text-stone-100">Search Collections &amp; Bookmarks:</strong>{' '}
                      Stored locally in <code className="font-mono text-xs">localStorage[&quot;isaac_collections&quot;]</code>.
                    </li>
                    <li>
                      <strong className="text-stone-900 dark:text-stone-100">Research Projects &amp; Markdown Notebooks:</strong>{' '}
                      Tasks, subtasks, target dates, and autosaved Markdown drafts (<code className="font-mono text-xs">isaac_notebook_draft_&lt;projectId&gt;</code>) never leave your browser.
                    </li>
                    <li>
                      <strong className="text-stone-900 dark:text-stone-100">Voice Search &amp; Read-Aloud Audio:</strong>{' '}
                      Processed locally by your browser&rsquo;s native Web Speech API (<code className="font-mono text-xs">SpeechRecognition</code> and <code className="font-mono text-xs">window.speechSynthesis</code>). Raw audio is never uploaded to our servers.
                    </li>
                    <li>
                      <strong className="text-stone-900 dark:text-stone-100">Theme, Tag Hierarchies &amp; Blocked Domains:</strong>{' '}
                      Persisted in browser Web Storage so your preferences work without a user account.
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-stone-200 dark:border-stone-800">
                  <h3 className="text-xl font-editorial font-medium text-stone-950 dark:text-stone-100">
                    How Ephemeral Session History Works
                  </h3>
                  <p className="mt-2 text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    On page load, Isaac generates a random in-memory <code className="font-mono text-xs">sessionId</code> (<code className="font-mono text-xs">uuidv4()</code>) to scope your active session&rsquo;s search history. You can wipe this history at any time via <strong className="text-stone-900 dark:text-stone-100">Settings (Ctrl+,)</strong>, or enable <strong className="text-stone-900 dark:text-stone-100">Clear History on Exit</strong> so your search history automatically self-destructs when you close the tab.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-editorial font-medium text-stone-950 dark:text-stone-100">
                    What Happens When You Search Live Web or AI
                  </h3>
                  <ul className="mt-3 space-y-3 text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    <li>
                      <strong className="text-stone-900 dark:text-stone-100">Query-Only External Transmission:</strong>{' '}
                      When local results fall back to SearXNG, Wikipedia, Hacker News Algolia, or DuckDuckGo, our backend sends <em>only</em> the search query string (and optional domain filter).
                    </li>
                    <li>
                      <strong className="text-stone-900 dark:text-stone-100">Optional AI Synthesis (Fireplexity):</strong>{' '}
                      When configured with <code className="font-mono text-xs">FIRECRAWL_API_KEY</code>, <code className="font-mono text-xs">GROQ_API_KEY</code>, or <code className="font-mono text-xs">GEMINI_API_KEY</code>, only your search query and scraped public web excerpts are sent to synthesize cited answers.
                    </li>
                    <li>
                      <strong className="text-stone-900 dark:text-stone-100">Volatile Server RAM by Default:</strong>{' '}
                      The Express backend (<code className="font-mono text-xs">server.ts</code>) stores the search index, crawler state, and session history in volatile memory that resets cleanly whenever the server process restarts.
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-stone-200 dark:border-stone-800">
                  <h3 className="text-xl font-editorial font-medium text-stone-950 dark:text-stone-100">
                    Your Instant Data Export &amp; Deletion Controls
                  </h3>
                  <p className="mt-2 text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    You can export Search Results to PDF, Collections to JSON/CSV/Markdown, Research Projects to Markdown/JSON/CSV/PDF, and Crawler Logs to <code className="font-mono text-xs">.log</code> files—or execute a full local cache reset in one click.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <LiveStorageInspector />
            </div>
          </section>
        )}

        {/* MODE 3: RAW MARKDOWN SOURCE VIEW */}
        {viewMode === 'markdown' && (
          <section className="py-12">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h2 className="text-2xl font-editorial text-stone-950 dark:text-stone-100">
                  Complete Privacy Policy — Markdown Source
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Copy or download this Markdown document to include as <code className="font-mono">PRIVACY.md</code> in the Isaac Search Engine codebase.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleQuickCopyMarkdown}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-colors whitespace-nowrap cursor-pointer"
                >
                  {copiedQuickMd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedQuickMd ? 'Copied to Clipboard' : 'Copy All Markdown'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>More Export Formats</span>
                </button>
              </div>
            </div>

            <div className="mt-6 border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 overflow-x-auto">
              <pre className="text-xs font-mono leading-relaxed text-stone-800 dark:text-stone-200 whitespace-pre-wrap break-words select-all">
                {markdownFullText}
              </pre>
            </div>
          </section>
        )}

        {/* MODE 1: FULL LEGAL & TECHNICAL POLICY (Asymmetric Editorial Canvas + Interactive Ledgers) */}
        {viewMode === 'full' && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Sticky Chapter Navigation Rail (3 cols on desktop) */}
            <aside className="lg:col-span-3 no-print">
              <div className="sticky top-24 space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-sans">
                    Table of Contents
                  </div>
                  <nav aria-label="Policy chapters" className="mt-3 flex flex-col border-l border-stone-200 dark:border-stone-800">
                    {POLICY_CHAPTERS.map((chap) => {
                      const isActive = activeSectionId === chap.id;
                      return (
                        <button
                          key={chap.id}
                          type="button"
                          onClick={() => scrollToSection(chap.id)}
                          className={`text-left pl-4 py-2 text-xs transition-colors border-l-2 -ml-[1px] cursor-pointer ${
                            isActive
                              ? 'border-amber-900 dark:border-amber-400 text-stone-950 dark:text-stone-50 font-semibold'
                              : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                          }`}
                        >
                          <span className="font-mono text-[11px] text-stone-400 dark:text-stone-500 mr-2 tabular-nums">
                            {chap.number}.
                          </span>
                          <span>{chap.title}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Archival Specification Card */}
                <div className="pt-6 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 space-y-2">
                  <div className="font-medium text-stone-900 dark:text-stone-200">
                    Architecture Coverage
                  </div>
                  <p className="leading-relaxed">
                    Covers React SPA client storage, <code className="font-mono">server.ts</code> Express in-memory routes, optional Python FastAPI / Firestore / Whoosh services, and third-party metasearch/AI proxies.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsExportModalOpen(true)}
                      className="inline-flex items-center gap-1 text-amber-900 dark:text-amber-400 font-medium hover:underline cursor-pointer"
                    >
                      <span>Download Policy (.md / .html)</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Main Editorial & Technical Column (9 cols on desktop) */}
            <div className="lg:col-span-9 space-y-16">
              {POLICY_CHAPTERS.map((chapter, chapterIdx) => (
                <article
                  key={chapter.id}
                  id={chapter.id}
                  className="scroll-mt-24 pb-16 border-b border-stone-200 dark:border-stone-800 last:border-b-0"
                >
                  {/* Section Kicker & Title */}
                  <div className="text-xs font-mono uppercase tracking-widest text-amber-900 dark:text-amber-400 tabular-nums">
                    Section {chapter.number} / Technical &amp; Legal Disclosure
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-editorial font-normal text-stone-950 dark:text-stone-50 mt-1.5">
                    {chapter.title}
                  </h2>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                    {chapter.subtitle}
                  </p>

                  {/* Asymmetric 70/30 Reading Canvas: Main Prose + Margin Callout */}
                  <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                    {/* Main Prose Column (65-75ch measure) */}
                    <div className="xl:col-span-8 space-y-4 text-[15px] leading-[1.75] text-stone-800 dark:text-stone-200 max-w-[70ch]">
                      {chapter.paragraphs.map((para, pIdx) => (
                        <p
                          key={pIdx}
                          className={
                            chapterIdx === 0 && pIdx === 0
                              ? 'first-letter:text-4xl first-letter:font-editorial first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none first-letter:text-stone-950 dark:first-letter:text-stone-100'
                              : ''
                          }
                        >
                          {para}
                        </p>
                      ))}

                      {chapter.bulletPoints && chapter.bulletPoints.length > 0 && (
                        <dl className="mt-6 space-y-4 pt-4 border-t border-stone-200/80 dark:border-stone-800/80">
                          {chapter.bulletPoints.map((bp) => (
                            <div key={bp.label} className="text-sm leading-relaxed">
                              <dt className="font-semibold text-stone-950 dark:text-stone-100">
                                {bp.label}
                              </dt>
                              <dd className="text-stone-700 dark:text-stone-300 mt-0.5">
                                {bp.detail}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </div>

                    {/* Right Margin Note Callout */}
                    <aside className="xl:col-span-4 border-l-2 border-amber-900/60 dark:border-amber-500/60 pl-4 py-1">
                      <div className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                        {chapter.marginNoteTitle}
                      </div>
                      <p className="mt-1.5 text-xs font-editorial italic text-stone-700 dark:text-stone-300 leading-relaxed">
                        &ldquo;{chapter.marginNoteBody}&rdquo;
                      </p>
                    </aside>
                  </div>

                  {/* SECTION 03 SPECIALIZED EMBED: Interactive Client-Side Web Storage Inventory */}
                  {chapter.id === 'client-storage' && (
                    <div className="mt-10 space-y-6">
                      <div className="border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5">
                        {/* Filter Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
                          <div>
                            <h3 className="text-base font-semibold text-stone-950 dark:text-stone-100">
                              Client-Side Web Storage Inventory ({filteredStorageItems.length} of {CLIENT_STORAGE_INVENTORY.length} keys)
                            </h3>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                              Complete manifest of <code className="font-mono">localStorage</code> (15 keys) and <code className="font-mono">sessionStorage</code> (2 keys) scoped to the application origin.
                            </p>
                          </div>

                          {/* Scope Segmented Buttons */}
                          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 self-start">
                            <button
                              type="button"
                              onClick={() => setStorageScope('all')}
                              className={`px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                                storageScope === 'all'
                                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                              }`}
                            >
                              All Scopes (17)
                            </button>
                            <button
                              type="button"
                              onClick={() => setStorageScope('localStorage')}
                              className={`px-2.5 py-1 text-xs font-mono transition-colors whitespace-nowrap cursor-pointer ${
                                storageScope === 'localStorage'
                                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                              }`}
                            >
                              localStorage (15)
                            </button>
                            <button
                              type="button"
                              onClick={() => setStorageScope('sessionStorage')}
                              className={`px-2.5 py-1 text-xs font-mono transition-colors whitespace-nowrap cursor-pointer ${
                                storageScope === 'sessionStorage'
                                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                              }`}
                            >
                              sessionStorage (2)
                            </button>
                          </div>
                        </div>

                        {/* Search Input & Functional Category Filter Bar */}
                        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 no-print">
                          <div className="relative flex-1 max-w-sm">
                            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={storageSearch}
                              onChange={(e) => setStorageSearch(e.target.value)}
                              placeholder="Filter by key name, component, or purpose..."
                              aria-label="Filter client storage inventory"
                              className="w-full pl-8 pr-8 py-1.5 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-900 dark:focus:border-amber-400"
                            />
                            {storageSearch && (
                              <button
                                type="button"
                                onClick={() => setStorageSearch('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                                aria-label="Clear search filter"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5">
                            {(
                              [
                                'All',
                                'Preferences',
                                'History & Ephemeral',
                                'Workspace & Curation',
                                'Crawler & Indexing',
                                'AI & Community',
                              ] as StorageCategoryFilter[]
                            ).map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setStorageCategory(cat)}
                                className={`px-2.5 py-1 text-xs transition-colors whitespace-nowrap cursor-pointer border ${
                                  storageCategory === cat
                                    ? 'border-stone-900 dark:border-stone-200 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 font-medium'
                                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Storage Inventory Data Table */}
                        <div className="mt-4 overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-stone-300 dark:border-stone-700 text-xs text-stone-500 dark:text-stone-400">
                                <th className="py-2.5 pr-4 font-medium">Storage Key</th>
                                <th className="py-2.5 px-3 font-medium">API &amp; Domain</th>
                                <th className="py-2.5 px-3 font-medium">Component / Hook</th>
                                <th className="py-2.5 px-3 font-medium">Data Stored</th>
                                <th className="py-2.5 px-3 font-medium">Purpose &amp; Lifecycle</th>
                                <th className="py-2.5 pl-3 font-medium">Erasure Mechanism</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-xs">
                              {filteredStorageItems.length === 0 ? (
                                <tr>
                                  <td colSpan={6} className="py-8 text-center text-stone-500">
                                    No storage keys match your current filter criteria.{' '}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setStorageSearch('');
                                        setStorageScope('all');
                                        setStorageCategory('All');
                                      }}
                                      className="underline text-amber-900 dark:text-amber-400 ml-1 cursor-pointer"
                                    >
                                      Reset filters
                                    </button>
                                  </td>
                                </tr>
                              ) : (
                                filteredStorageItems.map((item) => (
                                  <tr
                                    key={`${item.storageType}:${item.key}`}
                                    className="hover:bg-stone-50/90 dark:hover:bg-stone-800/40 align-top"
                                  >
                                    <td className="py-3 pr-4 font-mono font-medium text-stone-950 dark:text-stone-100 whitespace-nowrap">
                                      {item.key}
                                    </td>
                                    <td className="py-3 px-3 text-stone-600 dark:text-stone-400 whitespace-nowrap">
                                      <span className="font-mono">{item.storageType}</span>
                                      <span className="mx-1.5" aria-hidden="true">·</span>
                                      <span>{item.category}</span>
                                    </td>
                                    <td className="py-3 px-3 font-mono text-stone-600 dark:text-stone-400">
                                      {item.component}
                                    </td>
                                    <td className="py-3 px-3 font-mono text-stone-700 dark:text-stone-300">
                                      {item.dataType}
                                    </td>
                                    <td className="py-3 px-3 text-stone-700 dark:text-stone-300 leading-relaxed min-w-[220px]">
                                      {item.purpose}
                                    </td>
                                    <td className="py-3 pl-3 text-stone-600 dark:text-stone-400 leading-relaxed min-w-[170px]">
                                      {item.deletionMethod}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION 04 SPECIALIZED EMBED: Backend In-Memory & Optional Firestore Table */}
                  {chapter.id === 'backend-handling' && (
                    <div className="mt-10 border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5">
                      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
                        <h3 className="text-base font-semibold text-stone-950 dark:text-stone-100">
                          Backend Server Memory Structures &amp; Optional Cloud Persistence Matrix
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                          Breakdown of volatile Node.js structures in <code className="font-mono">server.ts</code> versus optional Python FastAPI / Firestore persistence.
                        </p>
                      </div>

                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-stone-300 dark:border-stone-700 text-xs text-stone-500 dark:text-stone-400">
                              <th className="py-2.5 pr-4 font-medium">State Identifier</th>
                              <th className="py-2.5 px-3 font-medium">Service Layer</th>
                              <th className="py-2.5 px-3 font-medium">API Endpoints</th>
                              <th className="py-2.5 px-3 font-medium">Data Stored</th>
                              <th className="py-2.5 pl-3 font-medium">Persistence &amp; Reset Lifecycle</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-xs">
                            {BACKEND_MEMORY_STORES.map((store) => (
                              <tr key={store.identifier} className="hover:bg-stone-50/90 dark:hover:bg-stone-800/40 align-top">
                                <td className="py-3 pr-4 font-mono font-medium text-stone-950 dark:text-stone-100">
                                  {store.identifier}
                                </td>
                                <td className="py-3 px-3 text-stone-700 dark:text-stone-300 whitespace-nowrap">
                                  {store.layer}
                                </td>
                                <td className="py-3 px-3 font-mono text-stone-600 dark:text-stone-400">
                                  {store.apiRoutes}
                                </td>
                                <td className="py-3 px-3 text-stone-700 dark:text-stone-300 leading-relaxed min-w-[220px]">
                                  {store.dataStored}
                                </td>
                                <td className="py-3 pl-3 text-stone-600 dark:text-stone-400 leading-relaxed min-w-[200px]">
                                  {store.persistenceBehavior}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* SECTION 05 SPECIALIZED EMBED: External & Third-Party API Flows Table */}
                  {chapter.id === 'external-flows' && (
                    <div className="mt-10 border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
                        <div>
                          <h3 className="text-base font-semibold text-stone-950 dark:text-stone-100">
                            External Metasearch, Archive &amp; AI Provider Ledger ({filteredExternalFlows.length} of {EXTERNAL_DATA_FLOWS.length})
                          </h3>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            Every external integration receives strictly the search query or target domain—never personal data or client storage.
                          </p>
                        </div>

                        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 self-start no-print">
                          <button
                            type="button"
                            onClick={() => setExternalFilter('all')}
                            className={`px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                              externalFilter === 'all'
                                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                            }`}
                          >
                            All Providers (7)
                          </button>
                          <button
                            type="button"
                            onClick={() => setExternalFilter('default')}
                            className={`px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                              externalFilter === 'default'
                                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                            }`}
                          >
                            Core Metasearch (5)
                          </button>
                          <button
                            type="button"
                            onClick={() => setExternalFilter('optional')}
                            className={`px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                              externalFilter === 'optional'
                                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                            }`}
                          >
                            Optional API Keys (2)
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-stone-300 dark:border-stone-700 text-xs text-stone-500 dark:text-stone-400">
                              <th className="py-2.5 pr-4 font-medium">External Provider &amp; Endpoint</th>
                              <th className="py-2.5 px-3 font-medium">Trigger Condition</th>
                              <th className="py-2.5 px-3 font-medium">Exact Data Sent</th>
                              <th className="py-2.5 px-3 font-medium">Data Explicitly Withheld</th>
                              <th className="py-2.5 pl-3 font-medium">Functional Purpose</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-xs">
                            {filteredExternalFlows.map((flow) => (
                              <tr key={flow.provider} className="hover:bg-stone-50/90 dark:hover:bg-stone-800/40 align-top">
                                <td className="py-3 pr-4">
                                  <div className="font-semibold text-stone-950 dark:text-stone-100">
                                    {flow.provider}
                                  </div>
                                  <div className="font-mono text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                                    {flow.endpoint}
                                    <span className="mx-1.5" aria-hidden="true">·</span>
                                    <span>{flow.isOptionalServerConfig ? 'Optional Server Key' : 'Standard Fallback'}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-stone-700 dark:text-stone-300 leading-relaxed min-w-[180px]">
                                  {flow.triggerCondition}
                                </td>
                                <td className="py-3 px-3 font-mono text-stone-800 dark:text-stone-200 leading-relaxed min-w-[160px]">
                                  {flow.dataTransmitted}
                                </td>
                                <td className="py-3 px-3 text-stone-600 dark:text-stone-400 leading-relaxed min-w-[170px]">
                                  {flow.dataExcluded}
                                </td>
                                <td className="py-3 pl-3 text-stone-700 dark:text-stone-300 leading-relaxed min-w-[190px]">
                                  {flow.purpose}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* SECTION 06 SPECIALIZED EMBED: User Controls Matrix */}
                  {chapter.id === 'user-controls' && (
                    <div className="mt-10 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {USER_CONTROL_MECHANISMS.map((ctrl, idx) => (
                          <div
                            key={ctrl.id}
                            className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 p-5 flex flex-col justify-between"
                          >
                            <div>
                              <div className="text-xs font-mono text-stone-500 dark:text-stone-400 tabular-nums">
                                Control 0{idx + 1} · {ctrl.scope}
                              </div>
                              <h3 className="text-base font-semibold text-stone-950 dark:text-stone-100 mt-1">
                                {ctrl.title}
                              </h3>
                              <p className="text-xs text-stone-700 dark:text-stone-300 mt-2 leading-relaxed">
                                {ctrl.technicalEffect}
                              </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-stone-200/70 dark:border-stone-800 text-xs font-mono text-stone-500 dark:text-stone-400">
                              UI Location: {ctrl.uiLocation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Quiet Institutional Footer */}
      <footer className="border-t border-stone-300 dark:border-stone-800 bg-[#F5F1E9] dark:bg-stone-950 px-6 lg:px-12 py-10 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-stone-600 dark:text-stone-400">
          <div className="space-y-1">
            <div className="font-editorial text-base text-stone-950 dark:text-stone-100 font-medium">
              {POLICY_META.appName} — Privacy &amp; Data Architecture Specification
            </div>
            <div>
              Effective {POLICY_META.effectiveDate} · Inquiries:{' '}
              <a
                href={`mailto:${POLICY_META.contactEmail}`}
                className="underline hover:text-stone-950 dark:hover:text-stone-100"
              >
                {POLICY_META.contactEmail}
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 no-print">
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-stone-800 dark:text-stone-200 hover:underline font-medium cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Export Markdown / HTML / JSON</span>
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-stone-800 dark:text-stone-200 hover:underline font-medium cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Formal Policy</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Export / Download Modal */}
      <PolicyExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
}
