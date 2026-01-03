
import React from 'react';
import { UserProfile } from '../types';
import { GENRE_OPTIONS } from '../constants';

interface Props {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
  onRemove: () => void;
}

const UserProfileCard: React.FC<Props> = ({ user, onUpdate, onRemove }) => {
  const toggleGenre = (genre: string, type: 'liked' | 'disliked') => {
    const field = type === 'liked' ? 'preferredGenres' : 'dislikedGenres';
    const current = user[field];
    const next = current.includes(genre)
      ? current.filter(g => g !== genre)
      : [...current, genre];
    
    const otherField = type === 'liked' ? 'dislikedGenres' : 'preferredGenres';
    const otherList = user[otherField].filter(g => g !== genre);

    onUpdate({
      ...user,
      [field]: next,
      [otherField]: otherList
    });
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/30 transition-all hover:border-[#B19CD9]/40 group">
      <div className="flex justify-between items-start mb-10">
        <div className="flex-1">
          <input
            type="text"
            value={user.name}
            onChange={(e) => onUpdate({ ...user, name: e.target.value })}
            className="bg-transparent text-4xl font-black text-slate-900 focus:outline-none border-b-4 border-slate-50 focus:border-[#B19CD9] px-1 py-2 w-full max-w-md transition-all placeholder-slate-200 tracking-tighter"
            placeholder="Friend's Name..."
          />
        </div>
        <button 
          onClick={onRemove}
          className="text-slate-200 hover:text-rose-400 hover:bg-rose-50 p-4 rounded-3xl transition-all"
          title="Remove Friend"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <div className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#B19CD9]"></div>
               Vibe Check: Likes
            </label>
            <div className="flex flex-wrap gap-2.5">
              {GENRE_OPTIONS.map(genre => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre, 'liked')}
                  className={`px-5 py-2 rounded-2xl text-[11px] font-black transition-all border-2 uppercase tracking-wider ${
                    user.preferredGenres.includes(genre)
                      ? 'bg-[#B19CD9] text-white border-[#B19CD9] shadow-lg shadow-[#B19CD9]/30 scale-105'
                      : 'bg-white text-slate-400 border-slate-50 hover:border-slate-100 hover:text-slate-600'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
               Deal Breakers: Dislikes
            </label>
            <div className="flex flex-wrap gap-2.5">
              {GENRE_OPTIONS.map(genre => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre, 'disliked')}
                  className={`px-5 py-2 rounded-2xl text-[11px] font-black transition-all border-2 uppercase tracking-wider ${
                    user.dislikedGenres.includes(genre)
                      ? 'bg-rose-50 text-rose-500 border-rose-200 scale-105'
                      : 'bg-white text-slate-400 border-slate-50 hover:border-rose-100'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Cinematic Blueprint</label>
            <textarea
              value={user.favoriteMovies.join(', ')}
              onChange={(e) => onUpdate({ ...user, favoriteMovies: e.target.value.split(',').map(s => s.trim()) })}
              placeholder="Fav Movies (e.g. Inception, Dark, The Bear)"
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-[2rem] p-6 text-sm text-slate-700 font-medium focus:ring-4 focus:ring-[#B19CD9]/10 focus:bg-white focus:border-[#B19CD9]/30 focus:outline-none h-32 transition-all resize-none"
            />
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Talent Preference</label>
            <textarea
              value={user.favoriteActors.join(', ')}
              onChange={(e) => onUpdate({ ...user, favoriteActors: e.target.value.split(',').map(s => s.trim()) })}
              placeholder="Actors/Directors (e.g. Nolan, Greta Gerwig)"
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-[2rem] p-6 text-sm text-slate-700 font-medium focus:ring-4 focus:ring-[#B19CD9]/10 focus:bg-white focus:border-[#B19CD9]/30 focus:outline-none h-32 transition-all resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
