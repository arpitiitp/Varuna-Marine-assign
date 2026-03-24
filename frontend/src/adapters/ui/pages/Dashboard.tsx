import React, { useState, Suspense } from 'react';

// Lazy load complex tab components for code-splitting optimization
const RoutesTab = React.lazy(() => import('../components/RoutesTab').then(m => ({ default: m.RoutesTab })));
const CompareTab = React.lazy(() => import('../components/CompareTab').then(m => ({ default: m.CompareTab })));
const BankingTab = React.lazy(() => import('../components/BankingTab').then(m => ({ default: m.BankingTab })));
const PoolingTab = React.lazy(() => import('../components/PoolingTab').then(m => ({ default: m.PoolingTab })));

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'routes' | 'compare' | 'banking' | 'pooling'>('routes');

  const tabs = [
    { id: 'routes', label: 'Routes Registry', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { id: 'compare', label: 'Comparisons', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'banking', label: 'Banking (Art. 20)', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
    { id: 'pooling', label: 'Pooling (Art. 21)', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-cyan-100 selection:text-cyan-900 flex flex-col">
      {/* Glassmorphic Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              {/* Static anchor icon — ocean teal-to-navy gradient */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-blue-900 flex items-center justify-center shadow-md">
                <svg
                  aria-label="FuelEU Maritime Platform logo"
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  {/* Anchor icon */}
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4a2 2 0 100 4 2 2 0 000-4zm0 4v12M4 12h16M4 17c0 2.761 3.582 5 8 5s8-2.239 8-5" />
                </svg>
              </div>
              <h1
                className="text-xl font-extrabold tracking-tight text-slate-800"
                style={{ fontFamily: 'Sora, system-ui, sans-serif' }}
              >
                FuelEU Maritime Platform
              </h1>
            </div>
            {/* Regulation badge */}

          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Tab Bar */}
        <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 max-w-fit mx-auto sm:mx-0">
          <nav className="flex space-x-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }} aria-label="Main navigation tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    relative flex items-center gap-2 whitespace-nowrap py-2.5 px-5 rounded-xl text-sm font-semibold
                    transition-all duration-200 ease-out border-b-2
                    ${isActive
                      ? 'text-teal-700 bg-teal-50/80 border-teal-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-transparent'}
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <svg
                    aria-hidden="true"
                    className={`w-4 h-4 transition-colors ${isActive ? 'text-teal-600' : 'text-slate-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Tab Content with Suspense Loading State */}
        <div className="flex-1 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
          <Suspense fallback={
            <div className="w-full h-64 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-slate-500">Loading module...</p>
              </div>
            </div>
          }>
            {activeTab === 'routes' && <RoutesTab />}
            {activeTab === 'compare' && <CompareTab />}
            {activeTab === 'banking' && <BankingTab />}
            {activeTab === 'pooling' && <PoolingTab />}
          </Suspense>
        </div>
      </main>

      <footer className="bg-white/60 backdrop-blur border-t-2 border-teal-600/20 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-400">
            FuelEU Maritime Platform · Build 1.0.0
          </p>
        </div>
      </footer>
    </div>
  );
}

