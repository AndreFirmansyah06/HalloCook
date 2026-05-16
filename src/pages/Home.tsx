import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import RecipeCard from '../components/RecipeCard';
import { api } from '../services/api';
import { Recipe } from '../types';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, Mic } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    try {
      const data = await api.getRecipes();
      setRecipes(data);
      if (user) {
        const favs = await api.getFavorites(user.id);
        setFavorites(favs.map(f => f.recipe_id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleBookmarkToggle = async (recipeId: string) => {
    if (!user) return alert("Please login to bookmark recipes");
    try {
      const res = await api.toggleFavorite(user.id, recipeId);
      if (res.active) {
        setFavorites([...favorites, recipeId]);
      } else {
        setFavorites(favorites.filter(id => id !== recipeId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = recipes.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.ingredients.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen" id="hero">
      <Hero />
      
      {/* Smart Search Bar */}
      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-30" id="search">
        <div className="glass rounded-[2.5rem] p-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center gap-4 border-white/20">
          <div className="flex-1 flex items-center gap-4 bg-white/5 rounded-2xl px-6 py-4 border border-white/10">
            <Search className="text-brand-coral" size={24} />
            <input 
              type="text" 
              placeholder="Cari resep hari ini..." 
              className="bg-transparent border-none outline-none w-full text-lg font-medium text-white placeholder:text-white/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="p-2 hover:bg-brand-salmon/20 rounded-xl transition-colors text-white/40 hover:text-brand-salmon">
              <Mic size={20} />
            </button>
          </div>
          <button className="bg-white/5 p-4 rounded-2xl border border-white/10 text-white/40 hover:text-white transition-colors">
            <SlidersHorizontal size={24} />
          </button>
          <button className="bg-gradient-to-r from-brand-salmon to-brand-coral text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-brand-salmon/20 hidden md:block hover:scale-105 transition-transform">
            Search
          </button>
        </div>
      </div>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="inline-block px-3 py-1 bg-brand-coral/10 text-brand-coral rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">Discovery</div>
            <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter">Trending Recipes</h2>
            <p className="text-white/40 font-medium mt-2">Explore the most loved recipes this week.</p>
          </div>
          <div className="flex gap-4">
             {['All', 'Breakfast', 'Lunch', 'Dinner'].map(cat => (
               <button key={cat} className="px-6 py-2.5 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-brand-coral hover:border-brand-coral/50 transition-all bg-white/5">
                 {cat}
               </button>
             ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-white/5 animate-pulse rounded-[2.5rem] border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredRecipes.map(recipe => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                isBookmarked={favorites.includes(recipe.id)}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
