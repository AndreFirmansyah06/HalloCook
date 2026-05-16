import React, { useState, useEffect } from 'react';
import { ChefHat, Heart, List, Clock, TrendingUp, Settings, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types';
import { motion } from 'motion/react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [shoppingList, setShoppingList] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [recipeToRemove, setRecipeToRemove] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadUserData();
  }, [user]);

  async function loadUserData() {
    try {
      const [favs, list, sessions] = await Promise.all([
        api.getFavorites(user!.id),
        api.getShoppingList(user!.id),
        api.getCookingSessions(user!.id)
      ]);
      setFavorites(favs);
      setShoppingList(list);
      setActiveSessions(sessions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteGrocery = async (id: string) => {
    try {
      await api.deleteFromShoppingList(id);
      setShoppingList(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  const handleToggleIngredient = async (itemId: string, ingredient: string) => {
    try {
      const item = shoppingList.find(s => s.id === itemId);
      if (!item) return;

      const checked = item.checked_ingredients || [];
      const newChecked = checked.includes(ingredient)
        ? checked.filter((i: string) => i !== ingredient)
        : [...checked, ingredient];

      await api.updateShoppingListItem(itemId, { checked_ingredients: newChecked });
      setShoppingList(prev => prev.map(s => s.id === itemId ? { ...s, checked_ingredients: newChecked } : s));
    } catch (err) {
      console.error(err);
    }
};

  const handleRemoveBookmark = (recipeId: string) => {
    setRecipeToRemove(recipeId);
    setShowConfirmModal(true);
  };

  const confirmRemoveBookmark = async () => {
    if (!user || !recipeToRemove) return;
    try {
      await api.toggleFavorite(user.id, recipeToRemove);
      setFavorites(prev => prev.filter(f => f.recipe_id !== recipeToRemove));
      setShowConfirmModal(false);
      setRecipeToRemove(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
       <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
             {/* Left: Saved Content */}
             <div className="lg:col-span-2 space-y-16">
                <div>
                   <div className="flex items-center justify-between mb-10">
                      <h3 className="text-3xl font-display font-extrabold tracking-tighter flex items-center gap-4">
                         <Heart className="text-brand-coral" fill="currentColor" />
                         Your Collection
                      </h3>
                   </div>
                   
                   {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
                         <div className="h-80 bg-white/5 rounded-[2.5rem]" />
                         <div className="h-80 bg-white/5 rounded-[2.5rem]" />
                      </div>
                   ) : favorites.length > 0 ? (
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 ${favorites.length >= 5 ? 'max-h-[850px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10' : ''}`}>
                         {favorites.filter(fav => !!fav.recipes).map((fav, idx) => (
                            <RecipeCard 
                               key={fav.recipe_id || idx} 
                               recipe={fav.recipes} 
                               isBookmarked 
                               onBookmarkToggle={() => handleRemoveBookmark(fav.recipe_id)}
                            />
                         ))}
                      </div>
                   ) : (
                      <div className="glass rounded-[3rem] p-16 text-center border-dashed border-2 border-white/5">
                         <p className="text-white/30 font-medium text-lg">Belum ada resep di koleksi Anda.</p>
                         <Link to="/search" className="inline-block mt-6 px-10 py-4 bg-white text-deep-dark rounded-full font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">Mulai Berburu Resep</Link>
                      </div>
                   )}
                </div>
             </div>

             {/* Right: Sidebar */}
             <div className="space-y-16">
                <div>
                   <h3 className="text-3xl font-display font-extrabold tracking-tighter mb-10 flex items-center gap-4">
                      <List className="text-brand-coral" />
                      Groceries
                   </h3>
                   <div className="glass rounded-[3rem] p-10 border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] space-y-6">
                      {shoppingList.length > 0 ? shoppingList.filter(item => !!item.recipes).map((item, idx) => (
                        <div key={item.id || idx} className="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-4">
                           <div className="flex items-center justify-between">
                              <Link to={`/recipes/${item.recipe_id}`} className="font-bold text-white/70 hover:text-brand-coral uppercase tracking-widest text-[10px] transition-colors">{item.recipes?.title}</Link>
                              <button onClick={() => handleDeleteGrocery(item.id)} className="text-white/20 hover:text-red-400 transition-colors">
                                 <X size={18} />
                              </button>
                           </div>
                           <div className="space-y-2">
                              {item.recipes?.ingredients.map((ing: string, idx: number) => (
                                 <label key={`${item.id}-${idx}`} className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                       type="checkbox" 
                                       className="w-5 h-5 rounded-full border-white/10 bg-white/5 text-brand-coral focus:ring-brand-coral cursor-pointer appearance-none checked:bg-brand-coral checked:border-transparent transition-all relative after:content-[''] after:hidden checked:after:block after:absolute after:left-[5px] after:top-[2px] after:w-[6px] after:h-[10px] after:border-white after:border-r-2 after:border-b-2 after:rotate-45"
                                       checked={!!item.checked_ingredients?.includes(ing)}
                                       onChange={() => handleToggleIngredient(item.id, ing)}
                                    />
                                    <span className={`text-[11px] font-medium transition-all ${item.checked_ingredients?.includes(ing) ? 'text-white/20 line-through' : 'text-white/50 group-hover:text-white'}`}>{ing}</span>
                                 </label>
                              ))}
                           </div>
                           {item.recipes?.ingredients.every((ing: string) => item.checked_ingredients?.includes(ing)) && (
                              <div className="bg-brand-coral/10 py-2 px-4 rounded-xl border border-brand-coral/20">
                                 <p className="text-[10px] font-black text-brand-salmon uppercase tracking-wider text-center">Semua bahan sudah dibeli!</p>
                              </div>
                           )}
                        </div>
                      )) : (
                         <div className="text-center py-12 text-white/20">
                            <List size={40} className="mx-auto mb-4 opacity-50" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">List is Empty</p>
                         </div>
                      )}
                   </div>
                </div>
              </div>
           </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowConfirmModal(false)}
                className="absolute inset-0 bg-deep-dark/80 backdrop-blur-md"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="glass relative w-full max-w-md p-10 rounded-[3rem] border-white/10 shadow-2xl text-center"
              >
                 <div className="w-20 h-20 bg-brand-coral/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Heart className="text-brand-coral" size={32} />
                 </div>
                 <h4 className="text-3xl font-display font-black tracking-tighter mb-4">Hapus Resep?</h4>
                 <p className="text-white/50 mb-10 font-medium font-sans">Apakah Anda yakin ingin menghapus resep ini dari koleksi kesukaan Anda?</p>
                 <div className="flex flex-col gap-4">
                    <button 
                       onClick={confirmRemoveBookmark}
                       className="w-full bg-brand-coral text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
                    >
                       Ya, Hapus Koleksi
                    </button>
                    <button 
                       onClick={() => setShowConfirmModal(false)}
                       className="w-full bg-white/5 text-white/50 py-5 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all"
                    >
                       Batalkan
                    </button>
                 </div>
              </motion.div>
           </div>
        )}
     </div>
   );
 }
