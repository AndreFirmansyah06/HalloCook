import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Flame, ChevronLeft, Bookmark, Share2, Play, CheckCircle2, BookmarkCheck, ChefHat, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { Recipe } from '../types';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadRecipe();
  }, [id, user]);

  async function loadRecipe() {
    try {
      const data = await api.getRecipeById(id!);
      setRecipe(data);
      if (user) {
        const [favs, sessions] = await Promise.all([
          api.getFavorites(user.id),
          api.getCookingSessions(user.id)
        ]);
        setIsBookmarked(favs.some(f => f.recipe_id === id));
        const activeSession = sessions.find(s => s.recipeId === id);
        if (activeSession) setSession(activeSession);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleStartCooking = async () => {
    if (!user) return alert("Please login to start cooking");
    try {
      const newSession = await api.startCooking(user.id, recipe!.id);
      setSession(newSession);
      alert("Let's start cooking! Access progress in Your Kitchen.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStep = async (stepIndex: number) => {
    if (!session) return;
    
    try {
      const completed = session.completed_steps || [];
      const newCompleted = completed.includes(stepIndex) 
        ? completed.filter((i: number) => i !== stepIndex)
        : [...completed, stepIndex];
      
      const progress = (newCompleted.length / recipe!.steps.length) * 100;
      const updated = await api.updateCookingProgress(session.id, newCompleted, progress);
      setSession(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBookmark = async () => {
    if (!user) return alert("Please login to save recipes");
    try {
      const res = await api.toggleFavorite(user.id, recipe!.id);
      setIsBookmarked(res.active);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToShoppingList = async () => {
    if (!user) return alert("Please login to add to shopping list");
    try {
      await api.addToShoppingList(user.id, recipe!.id);
      alert("Added to grocery list successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to grocery list");
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 border-4 border-brand-coral border-t-transparent rounded-full animate-spin" />
      <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Loading Masterpiece...</span>
    </div>
  );

  if (!recipe) return <div className="h-screen flex items-center justify-center text-white">Recipe not found</div>;

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* Back and Actions */}
        <div className="flex items-center justify-between mb-8">
           <button onClick={() => navigate(-1)} className="glass p-3 rounded-full hover:bg-white/10 transition-colors border-white/10 text-white">
              <ChevronLeft size={24} />
           </button>
           <div className="flex gap-4">
              <button 
                onClick={handleToggleBookmark} 
                className={cn(
                  "glass p-3 rounded-full transition-all border-white/10", 
                  isBookmarked ? "text-brand-coral bg-white/10 border-brand-coral/50 shadow-[0_0_20px_rgba(255,127,80,0.2)]" : "text-white/50 hover:text-brand-coral"
                )}
              >
                 {isBookmarked ? <BookmarkCheck size={24} fill="currentColor" /> : <Bookmark size={24} />}
              </button>
              <button className="glass p-3 rounded-full text-white/50 hover:text-brand-coral transition-colors border-white/10">
                 <Share2 size={24} />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left: Visuals */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
             <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-white/10 group">
                <img 
                  src={recipe.image_url} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]"
                  referrerPolicy="no-referrer"
                />
                <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-2xl p-10 rounded-full border border-white/20 hover:scale-110 transition-transform text-white shadow-2xl hover:bg-white hover:text-brand-coral">
                   <Play size={48} fill="currentColor" />
                </button>
                <div className="absolute bottom-10 left-10 right-10 glass rounded-3xl p-6 text-white text-sm font-medium border-white/10 shadow-2xl">
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-salmon mb-2">Hallocook Assistant</div>
                   "Asisten dapur digital kami merekomendasikan api kecil untuk kaldu yang lebih bening dan rasa rempah yang sempurna."
                </div>
             </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
             <div className="mb-12">
                <div className="flex items-center gap-2 text-brand-salmon font-black text-[10px] tracking-[0.3em] uppercase mb-6">
                   <Star size={14} fill="currentColor" />
                   <span>Highly Recommended</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-display font-extrabold tracking-tighter mb-8 leading-[0.9]">{recipe.title}</h1>
                <p className="text-xl text-white/40 leading-relaxed font-medium italic">
                  "{recipe.description}"
                </p>
             </div>

             {/* Stats Card */}
             <div className="glass rounded-[3rem] p-10 grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 border-white/10 shadow-2xl">
                <div className="flex flex-col items-center">
                   <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-[1.25rem] flex items-center justify-center text-brand-coral shadow-lg mb-4">
                      <Clock size={28} />
                   </div>
                   <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Time</span>
                   <span className="text-lg font-extrabold text-white">{recipe.duration}</span>
                </div>
                <div className="flex flex-col items-center border-l border-white/5">
                   <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-[1.25rem] flex items-center justify-center text-blue-400 shadow-lg mb-4">
                      <Users size={28} />
                   </div>
                   <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Pax</span>
                   <span className="text-lg font-extrabold text-white">{recipe.servings} Pax</span>
                </div>
                <div className="flex flex-col items-center border-l border-white/5">
                   <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-[1.25rem] flex items-center justify-center text-orange-400 shadow-lg mb-4">
                      <Flame size={28} />
                   </div>
                   <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Kcal</span>
                   <span className="text-lg font-extrabold text-white">{recipe.calories} kcal</span>
                </div>
                <div className="flex flex-col items-center border-l border-white/5">
                   <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-[1.25rem] flex items-center justify-center text-emerald-400 shadow-lg mb-4">
                      <ChefHat size={28} />
                   </div>
                   <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Level</span>
                   <span className="text-lg font-extrabold text-white">{recipe.difficulty}</span>
                </div>
             </div>

             {/* Sections */}
             <div className="space-y-16">
                <div>
                   <h3 className="text-3xl font-display font-extrabold tracking-tighter mb-8 flex items-center gap-4">
                      <span className="w-1.5 h-10 bg-brand-coral rounded-full shadow-[0_0_15px_rgba(255,127,80,0.5)]" />
                      Ingredients
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recipe.ingredients.map((ing, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white/5 p-5 rounded-[1.5rem] border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                           <div className="w-6 h-6 rounded-full border-2 border-white/10 flex items-center justify-center group-hover:border-brand-coral group-hover:bg-brand-coral text-transparent group-hover:text-white transition-all shadow-inner">
                              <CheckCircle2 size={14} />
                           </div>
                           <span className="font-bold text-white/70 group-hover:text-white transition-colors uppercase tracking-widest text-[10px]">{ing}</span>
                        </div>
                      ))}
                   </div>
                   <button 
                     onClick={handleAddToShoppingList}
                     className="mt-10 bg-white/5 px-8 py-3 rounded-full text-brand-salmon font-bold uppercase tracking-[0.2em] text-[10px] border border-brand-salmon/20 hover:bg-brand-salmon/20 transition-all shadow-lg active:scale-95"
                   >
                     Sync to Shopping List
                   </button>
                </div>

                <div>
                   <h3 className="text-3xl font-display font-extrabold tracking-tighter mb-8 flex items-center gap-4">
                      <span className="w-1.5 h-10 bg-brand-coral rounded-full shadow-[0_0_15px_rgba(255,127,80,0.5)]" />
                      Cooking Steps
                   </h3>
                   <div className="space-y-12 relative">
                      {recipe.steps.map((step, i) => (
                        <div 
                           key={i} 
                           className={cn(
                              "flex gap-10 items-start relative group cursor-pointer",
                              session?.completed_steps?.includes(i) && "opacity-40"
                           )}
                           onClick={() => session && handleToggleStep(i)}
                        >
                           <div className={cn(
                              "flex-shrink-0 w-12 h-12 backdrop-blur-xl border border-white/10 rounded-[1.25rem] flex items-center justify-center font-black transition-all",
                              session?.completed_steps?.includes(i) ? "bg-brand-coral text-white" : "bg-white/5 text-brand-coral group-hover:bg-brand-coral group-hover:text-white"
                           )}>
                               {session?.completed_steps?.includes(i) ? <CheckCircle2 size={24} /> : i + 1}
                           </div>
                           <div className="pt-2">
                               <p className={cn(
                                  "font-medium leading-relaxed text-lg transition-colors",
                                  session?.completed_steps?.includes(i) ? "line-through text-white/40" : "text-white/60 group-hover:text-white"
                               )}>
                                  {step}
                               </p>
                           </div>
                           {i < recipe.steps.length - 1 && (
                             <div className="absolute top-12 left-6 w-[1px] h-[calc(100%+32px)] bg-gradient-to-b from-white/10 to-transparent -z-10" />
                           )}
                        </div>
                      ))}
                   </div>

                   <div className="mt-16 flex gap-6">
                      {!session ? (
                        <button 
                           onClick={handleStartCooking}
                           className="flex-1 bg-white text-deep-dark py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl flex items-center justify-center gap-3"
                        >
                           <Play size={18} fill="currentColor" />
                           Mulai Memasak
                        </button>
                      ) : (
                        <div className="flex-1 glass p-8 rounded-[2.5rem] border-brand-coral/20 flex flex-col items-center">
                           <div className="text-[10px] font-black text-brand-salmon uppercase tracking-[0.2em] mb-4 text-center">Cooking in Progress</div>
                           <div className="w-full h-2 bg-white/5 rounded-full mb-4 overflow-hidden border border-white/5 shadow-inner">
                              <div className="h-full bg-gradient-to-r from-brand-peach to-brand-coral shadow-[0_0_15px_rgba(255,127,80,0.5)]" style={{ width: `${session.progress}%` }} />
                           </div>
                           <span className="text-white/40 font-bold text-xs">{Math.round(session.progress)}% Complete</span>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
