
import React, { useState } from 'react';
import { UserProfile, Recommendation, AppState } from './types';
import { STREAMING_PLATFORMS } from './constants';
import UserProfileCard from './components/UserProfileCard';
import RecommendationCard from './components/RecommendationCard';
import { fetchRecommendations } from './services/geminiService';

const INITIAL_USER: UserProfile = {
  id: '1',
  name: 'Aditi',
  preferredGenres: [],
  dislikedGenres: [],
  favoriteMovies: [],
  favoriteActors: []
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    users: [INITIAL_USER],
    recommendations: [],
    isLoading: false,
    error: null
  });

  const [runtimeLimit, setRuntimeLimit] = useState(130);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Netflix', 'Disney+', 'Amazon Prime Video']);

  const addUser = () => {
    const newUser: UserProfile = {
      id: Date.now().toString(),
      name: '',
      preferredGenres: [],
      dislikedGenres: [],
      favoriteMovies: [],
      favoriteActors: []
    };
    setState(prev => ({ ...prev, users: [...prev.users, newUser] }));
  };

  const removeUser = (id: string) => {
    setState(prev => ({ 
      ...prev, 
      users: prev.users.filter(u => u.id !== id) 
    }));
  };

  const updateUser = (updatedUser: UserProfile) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u)
    }));
  };

  const handleFetchRecommendations = async () => {
    if (state.users.some(u => !u.name.trim())) {
      setState(prev => ({ ...prev, error: "Oops! Everyone needs a name first." }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const results = await fetchRecommendations(state.users, runtimeLimit, selectedPlatforms);
      setState(prev => ({ ...prev, recommendations: results, isLoading: false }));
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message }));
    }
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-32">
      {/* Premium Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 py-5 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#B19CD9] w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-[#B19CD9]/30 transform -rotate-3">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-none tracking-tighter">JUST CHOOSE LAH</h1>
              <p className="text-[10px] text-[#B19CD9] font-black uppercase tracking-[0.3em] mt-1">Cinematic Overlap Engine</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={addUser}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 text-sm font-bold rounded-2xl border-2 border-slate-100 transition-all active:scale-95 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Add Friend
            </button>
            <button 
              onClick={handleFetchRecommendations}
              disabled={state.isLoading}
              className={`px-8 py-2.5 bg-[#B19CD9] hover:bg-[#a08cc9] text-white text-sm font-black rounded-2xl shadow-xl shadow-[#B19CD9]/30 transition-all active:scale-95 flex items-center gap-2 ${state.isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {state.isLoading ? 'Syncing...' : 'Start The Vibe'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Workspace */}
          <div className="lg:col-span-8 space-y-8">
            <header className="mb-10">
              <h2 className="text-4xl font-black text-slate-900 mb-2">The Group</h2>
              <p className="text-slate-400 font-medium">Define your friends' tastes. Veto power included.</p>
            </header>

            {state.users.map(user => (
              <UserProfileCard 
                key={user.id} 
                user={user} 
                onUpdate={updateUser} 
                onRemove={() => removeUser(user.id)}
              />
            ))}

            {state.users.length === 0 && (
              <div className="py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-400">Lonely Cinema?</h3>
                <button onClick={addUser} className="mt-4 text-[#B19CD9] font-black uppercase tracking-widest text-xs hover:underline">Add Your First Friend</button>
              </div>
            )}
          </div>

          {/* Precision Controls */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 sticky top-32">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#B19CD9]"></div>
                Global Precision
              </h3>
              
              <div className="space-y-10">
                <section>
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Runtime</label>
                    <span className="text-lg font-black text-[#B19CD9]">{runtimeLimit}m</span>
                  </div>
                  <input 
                    type="range" 
                    min="60" 
                    max="210" 
                    step="5" 
                    value={runtimeLimit}
                    onChange={(e) => setRuntimeLimit(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#B19CD9]"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 mt-3 font-bold uppercase tracking-tighter">
                    <span>Quick Clip</span>
                    <span>Sweet Spot</span>
                    <span>Epic Saga</span>
                  </div>
                </section>

                <section>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-5">Streaming (SG Catalog)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {STREAMING_PLATFORMS.map(platform => (
                      <button
                        key={platform}
                        onClick={() => togglePlatform(platform)}
                        className={`px-3 py-2.5 rounded-2xl text-[10px] font-black transition-all border-2 text-center uppercase tracking-wider ${
                          selectedPlatforms.includes(platform)
                            ? 'bg-[#B19CD9]/5 border-[#B19CD9] text-[#B19CD9]'
                            : 'bg-white border-slate-50 text-slate-400 hover:border-slate-100'
                        }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </section>

                <div className="pt-6">
                  <button 
                    onClick={handleFetchRecommendations}
                    disabled={state.isLoading}
                    className="w-full py-5 bg-[#B19CD9] hover:bg-[#a08cc9] text-white font-black rounded-3xl shadow-2xl shadow-[#B19CD9]/40 transition-all flex items-center justify-center gap-3 group overflow-hidden relative"
                  >
                    <span className="relative z-10">{state.isLoading ? 'Finding the Vibe...' : 'Calculate Results'}</span>
                    {!state.isLoading && (
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                    )}
                  </button>
                  {state.error && (
                    <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></div>
                      <p className="text-rose-500 text-[11px] font-bold">{state.error}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Results Area */}
        <section id="results-section" className="mt-32">
          {state.isLoading ? (
            <div className="text-center py-40">
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 border-8 border-slate-50 border-t-[#B19CD9] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-10 h-10 bg-[#77DD77] rounded-full animate-pulse shadow-lg shadow-[#77DD77]/40"></div>
                </div>
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Filtering the Noise...</h3>
              <p className="text-slate-400 mt-3 font-medium">Browsing Singapore's top streaming catalogs for you.</p>
            </div>
          ) : state.recommendations.length > 0 ? (
            <div className="space-y-12">
              <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-10">
                <div>
                  <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic">CHOOSE LAH!</h2>
                  <p className="text-slate-400 text-xl font-medium mt-2">The highest overlapping cinematic matches found.</p>
                </div>
                <div className="bg-[#77DD77]/10 px-6 py-3 rounded-2xl border border-[#77DD77]/20 text-[#77DD77] text-sm font-black uppercase tracking-widest shadow-sm">
                   Group Consensus: High
                </div>
              </header>
              
              <div className="grid grid-cols-1 gap-12">
                {state.recommendations.map((rec, index) => (
                  <RecommendationCard key={rec.title + index} recommendation={rec} rank={index + 1} />
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </main>

      <footer className="mt-60 py-32 bg-white border-t border-slate-50 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex justify-center gap-3 mb-12">
             <div className="w-2 h-2 rounded-full bg-slate-100"></div>
             <div className="w-2 h-2 rounded-full bg-[#B19CD9]"></div>
             <div className="w-2 h-2 rounded-full bg-[#77DD77]"></div>
          </div>
          <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.5em] mb-6">Built with Passion in Singapore</p>
          <p className="text-slate-400 text-xs max-w-lg mx-auto leading-loose font-medium px-8">
            An intelligent group-decision tool designed to kill decision fatigue. We respect your vetoes and prioritize collective joy.
          </p>
        </div>
        {/* Subtle decorative elements */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#B19CD9]/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#77DD77]/5 rounded-full blur-3xl"></div>
      </footer>
    </div>
  );
};

export default App;
