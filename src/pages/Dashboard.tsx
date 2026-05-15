import React, { useState, useEffect } from 'react';
import { ChefHat, Heart, List, Clock, TrendingUp, Settings, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [shoppingList, setShoppingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadUserData();
  }, [user]);

  async function loadUserData() {
    try {
      const [favs, list] = await Promise.all([
        api.getFavorites(user!.id),
        api.getShoppingList(user!.id)
      ]);
      setFavorites(favs);
      setShoppingList(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
       <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="glass rounded-[3rem] p-10 mb-16 flex flex-col md:flex-row gap-12 items-center border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
              <div className="relative">
                 <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-brand-salmon to-brand-coral flex items-center justify-center text-white text-6xl font-black shadow-2xl shadow-brand-salmon/40">
                    {user.username.charAt(0).toUpperCase()}
                 </div>
                 <div className="absolute -bottom-2 -right-2 bg-white/10 backdrop-blur-2xl px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border border-white/20 flex items-center gap-2 text-white">
                    <TrendingUp size={14} className="text-brand-coral" />
                    Pro Cook
                 </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                  <div className="text-[10px] font-black text-brand-salmon uppercase tracking-[0.4em] mb-4">MEMBER SINCE 2024</div>
                  <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter mb-4 leading-none">Hello, {user.username}!</h1>
                  <p className="text-white/40 font-medium mb-8 text-lg">Siap mengeksplorasi mahakarya kuliner hari ini?</p>
                  <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                      <div className="bg-white/5 px-8 py-3 rounded-2xl border border-white/10 shadow-inner">
                          <span className="block text-[10px] uppercase font-bold text-white/20 tracking-[0.2em] mb-1">Recipes</span>
                          <span className="text-2xl font-black text-white">{favorites.length}</span>
                      </div>
                      <div className="bg-white/5 px-8 py-3 rounded-2xl border border-white/10 shadow-inner">
                          <span className="block text-[10px] uppercase font-bold text-white/20 tracking-[0.2em] mb-1">Experience</span>
                          <span className="text-2xl font-black text-white">Lv. 04</span>
                      </div>
                  </div>
              </div>
              <button className="bg-white/5 p-5 rounded-[2rem] border border-white/10 text-white/40 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-xl">
                  <Settings size={28} />
              </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
             {/* Left: Saved Content */}
             <div className="lg:col-span-2 space-y-16">
                <div>
                   <div className="flex items-center justify-between mb-10">
                      <h3 className="text-3xl font-display font-extrabold tracking-tighter flex items-center gap-4">
                         <Heart className="text-brand-coral" fill="currentColor" />
                         Your Collection
                      </h3>
                      <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-brand-coral transition-colors flex items-center gap-2">
                         View All <ChevronRight size={14} />
                      </button>
                   </div>
                   
                   {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
                         <div className="h-80 bg-white/5 rounded-[2.5rem]" />
                         <div className="h-80 bg-white/5 rounded-[2.5rem]" />
                      </div>
                   ) : favorites.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         {favorites.slice(0, 4).map(fav => (
                            <RecipeCard key={fav.recipe_id} recipe={fav.recipes} isBookmarked />
                         ))}
                      </div>
                   ) : (
                      <div className="glass rounded-[3rem] p-16 text-center border-dashed border-2 border-white/5">
                         <p className="text-white/30 font-medium text-lg">Belum ada resep di koleksi Anda.</p>
                         <Link to="/search" className="inline-block mt-6 px-10 py-4 bg-white text-deep-dark rounded-full font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">Mulai Berburu Resep</Link>
                      </div>
                   )}
                </div>

                <div>
                   <h3 className="text-3xl font-display font-extrabold tracking-tighter mb-10 flex items-center gap-4">
                      <Clock className="text-brand-peach" />
                      Active Kitchen
                   </h3>
                   <div className="glass rounded-[3rem] p-10 border-white/10 relative overflow-hidden shadow-2xl">
                      <div className="relative z-10">
                        <div className="text-[10px] font-black text-brand-salmon uppercase tracking-[0.3em] mb-4">NOW COOKING</div>
                        <h4 className="text-3xl font-display font-extrabold tracking-tighter mb-4">Rawon Setan Masterclass</h4>
                        <p className="text-white/40 font-medium mb-8">Anda berada di langkah 03 dari 08 resep ini.</p>
                        <div className="w-full h-2 bg-white/5 rounded-full mb-10 overflow-hidden border border-white/5 shadow-inner">
                           <div className="w-[40%] h-full bg-gradient-to-r from-brand-peach to-brand-coral shadow-[0_0_15px_rgba(255,127,80,0.5)]" />
                        </div>
                        <button className="bg-white text-deep-dark px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl active:scale-95">
                           Continue Session
                        </button>
                      </div>
                      <ChefHat className="absolute -bottom-16 -right-16 text-white/[0.03] w-80 h-80 -rotate-12" />
                   </div>
                </div>
             </div>

             {/* Right: Sidebar */}
             <div className="space-y-16">
                <div>
                   <h3 className="text-3xl font-display font-extrabold tracking-tighter mb-10 flex items-center gap-4">
                      <List className="text-brand-coral" />
                      Groceries
                   </h3>
                   <div className="glass rounded-[3rem] p-10 border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] space-y-4">
                      {shoppingList.length > 0 ? shoppingList.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-[1.5rem] border border-white/5 hover:bg-white/10 transition-all group">
                           <div className="font-bold text-white/70 group-hover:text-white uppercase tracking-widest text-[10px]">{item.recipes?.title}</div>
                           <button className="text-white/20 hover:text-red-400 transition-colors">
                              <X size={18} />
                           </button>
                        </div>
                      )) : (
                         <div className="text-center py-12 text-white/20">
                            <List size={40} className="mx-auto mb-4 opacity-50" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">List is Empty</p>
                         </div>
                      )}
                      <button className="w-full bg-white/5 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] text-white/40 border border-white/5 hover:bg-white/10 transition-colors mt-6 shadow-xl active:scale-95">
                         Add Ingredient
                      </button>
                   </div>
                </div>

                <div className="bg-gradient-to-br from-brand-salmon/20 to-brand-coral/5 backdrop-blur-3xl rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/10">
                   <h4 className="text-3xl font-display font-extrabold tracking-tighter mb-4">Go Pro Chef</h4>
                   <p className="text-white/40 text-xs leading-relaxed mb-8 font-medium italic">Unlock exclusive masterclasses from world-renowned chefs and remove all distractions.</p>
                   <button className="w-full bg-brand-coral text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-brand-salmon/20 hover:scale-[1.03] transition-all active:scale-95">
                      Upgrade to Premium
                   </button>
                   <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-coral/20 rounded-full blur-3xl -z-10" />
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
