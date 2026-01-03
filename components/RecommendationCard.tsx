
import React from 'react';
import { Recommendation } from '../types';

interface Props {
  recommendation: Recommendation;
  rank: number;
}

const RecommendationCard: React.FC<Props> = ({ recommendation, rank }) => {
  const handleWatchTrailer = () => {
    if (recommendation.trailerUrl) {
      window.open(recommendation.trailerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50 transition-all hover:translate-y-[-8px] hover:shadow-indigo-500/10 flex flex-col lg:flex-row group">
      {/* Poster Column */}
      <div className="w-full lg:w-[380px] relative h-[500px] lg:h-auto overflow-hidden">
        <img 
          src={recommendation.posterUrl} 
          alt={recommendation.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        {/* Rank Badge */}
        <div className="absolute top-8 left-8 bg-[#B19CD9] text-white w-16 h-16 rounded-3xl flex items-center justify-center font-black text-2xl shadow-2xl shadow-black/30 ring-8 ring-white/10 backdrop-blur-sm">
          {rank}
        </div>
        
        {/* Bottom Overlay Info */}
        <div className="absolute bottom-8 left-8 right-8 space-y-3">
           <div className="bg-black/40 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center justify-between">
              <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">{recommendation.type}</span>
              <span className="text-white text-xs font-black">{recommendation.runtime}</span>
           </div>
           <div className="bg-[#77DD77] p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-[#77DD77]/20">
              <span className="text-white text-[10px] font-black uppercase tracking-widest">IMDB Rating</span>
              <span className="text-white text-sm font-black">{recommendation.imdbRating}</span>
           </div>
        </div>
      </div>
      
      {/* Content Column */}
      <div className="p-10 lg:p-14 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
            <div className="flex-1">
              <h3 className="text-5xl font-black text-slate-900 mb-3 leading-[1.1] tracking-tighter">{recommendation.title}</h3>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-black text-sm uppercase tracking-widest">{recommendation.year}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                <div className="flex flex-wrap gap-2">
                  {recommendation.genres.map(genre => (
                    <span key={genre} className="text-[10px] font-black text-[#B19CD9] uppercase tracking-widest">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="shrink-0 flex flex-col items-center gap-1">
              <div className="bg-[#77DD77]/10 text-[#77DD77] w-24 h-24 rounded-full border-4 border-[#77DD77]/20 flex flex-col items-center justify-center shadow-inner">
                <span className="text-2xl font-black leading-none">{recommendation.score}%</span>
                <span className="text-[8px] font-black uppercase tracking-tighter mt-1 opacity-60">Vibe Score</span>
              </div>
            </div>
          </div>

          {/* Director and Cast Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                Director / Showrunner
              </h4>
              <p className="text-slate-800 font-bold text-lg">{recommendation.director}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                Top Cast
              </h4>
              <p className="text-slate-600 font-medium text-sm leading-relaxed">
                {recommendation.topCast.join(', ')}
              </p>
            </div>
          </div>

          {/* AI Explanation */}
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mb-10 relative">
            <div className="absolute -top-4 left-8 bg-white px-5 py-1.5 border border-slate-100 rounded-full flex items-center gap-2 shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-[#B19CD9] animate-pulse"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Match Intelligence</span>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed font-medium italic">
              "{recommendation.matchExplanation}"
            </p>
          </div>
        </div>

        {/* Footer/Streaming */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-50 mt-auto">
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Streaming In SG</span>
            <div className="flex flex-wrap gap-3">
              {recommendation.streamingOn.map(platform => (
                <span key={platform} className="bg-white border-2 border-slate-100 px-5 py-2 rounded-2xl text-[10px] font-black text-slate-600 shadow-sm transition-all hover:border-[#B19CD9]/30">
                  {platform}
                </span>
              ))}
              {recommendation.streamingOn.length === 0 && (
                 <div className="flex items-center gap-2 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-50">Checking secondary catalogs...</span>
                 </div>
              )}
            </div>
          </div>
          
          <button 
            onClick={handleWatchTrailer}
            className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2 group/btn active:scale-95"
          >
             Watch Trailer
             <svg className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
