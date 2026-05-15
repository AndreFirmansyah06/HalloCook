import React from 'react';
import { Instagram, Twitter, Facebook, ChefHat, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-deep-dark/50 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Brand */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-brand-salmon to-brand-coral p-2 rounded-lg text-white shadow-xl shadow-brand-salmon/20 group-hover:scale-110 transition-transform">
                <ChefHat size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                HalloCook
              </span>
            </Link>
            <p className="text-white/40 leading-relaxed text-sm font-medium italic">
              Premium digital kitchen assistant elevating your daily cooking experience with smart insights and a global recipe library.
            </p>
            <div className="flex gap-4">
               {[Instagram, Twitter, Facebook].map((Icon, i) => (
                 <a key={i} href="#" className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-white/40 hover:bg-brand-coral hover:text-white hover:border-brand-coral transition-all hover:-translate-y-1 shadow-lg shadow-black/20">
                    <Icon size={20} />
                 </a>
               ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-10">Discovery</h4>
            <ul className="space-y-6 text-white/40 text-xs font-bold uppercase tracking-widest">
               <li><Link to="/search" className="hover:text-brand-coral transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-4 h-[2px] bg-brand-coral transition-all" />Trending Recipes</Link></li>
               <li><Link to="/search" className="hover:text-brand-coral transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-4 h-[2px] bg-brand-coral transition-all" />Smart Ingredients</Link></li>
               <li><Link to="/search" className="hover:text-brand-coral transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-4 h-[2px] bg-brand-coral transition-all" />Popular Categories</Link></li>
               <li><Link to="/search" className="hover:text-brand-coral transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-4 h-[2px] bg-brand-coral transition-all" />Chef Guides</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-10">Account</h4>
            <ul className="space-y-6 text-white/40 text-xs font-bold uppercase tracking-widest">
               <li><Link to="/dashboard" className="hover:text-brand-coral transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-4 h-[2px] bg-brand-coral transition-all" />My Kitchen</Link></li>
               <li><Link to="/dashboard" className="hover:text-brand-coral transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-4 h-[2px] bg-brand-coral transition-all" />Saved Recipes</Link></li>
               <li><Link to="/dashboard" className="hover:text-brand-coral transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-4 h-[2px] bg-brand-coral transition-all" />Shopping List</Link></li>
               <li><Link to="/login" className="hover:text-brand-coral transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-4 h-[2px] bg-brand-coral transition-all" />Sign In / Join</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="glass rounded-[2rem] p-8 border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-coral/10 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-transform duration-1000" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-4">Newsletter</h4>
            <p className="text-[10px] text-white/40 mb-8 leading-relaxed font-bold">Dapatkan inspirasi mahakarya kuliner setiap akhir pekan.</p>
            <div className="space-y-3">
               <input 
                 type="email" 
                 placeholder="your@email.com" 
                 className="bg-white/5 border border-white/10 outline-none rounded-xl px-5 py-4 w-full text-[10px] font-bold text-white placeholder:text-white/20 focus:border-brand-coral/50 transition-colors"
               />
               <button className="w-full bg-gradient-to-r from-brand-salmon to-brand-coral text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-salmon/20 active:scale-95 transition-transform">
                 Subscribe Protocol
               </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
           <p>© 2026 HalloCook Protocol. Built with <Heart size={10} className="inline text-brand-salmon animate-pulse" fill="currentColor" /> for Smart Kitchens.</p>
           <div className="flex gap-12">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Masterclass</a>
           </div>
        </div>
      </div>
    </footer>
  );
}

function ArrowRight({ size, className }: { size?: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
    )
}
