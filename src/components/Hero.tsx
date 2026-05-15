import React from 'react';
import { ArrowRight, Star, Users, ChefHat } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 px-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 text-brand-coral rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              <div className="w-2 h-2 rounded-full bg-brand-coral animate-pulse" />
              <span>Smart Kitchen Assistant AI</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-display font-extrabold leading-[0.9] tracking-tighter mb-8">
              Cook.<br />
              Eat.<br />
              <span className="relative">
                Better!
                <svg className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-3 text-brand-salmon/40" viewBox="0 0 200 20" fill="none">
                  <path d="M2 17C40 7 160 7 198 17" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            <p className="text-lg text-white/50 max-w-md mb-10 leading-relaxed font-medium">
              Temukan ribuan resep lezat untuk setiap tingkat keahlian. Masak lebih pintar dengan bantuan asisten dapur digital premium.
            </p>

            <div className="flex flex-wrap gap-6 items-center">
              <Link 
                to="/search" 
                className="group relative flex items-center gap-4 bg-gradient-to-r from-brand-salmon to-brand-coral text-white px-10 py-5 rounded-full font-bold text-lg shadow-2xl shadow-brand-salmon/20 hover:scale-105 active:scale-95 transition-all"
              >
                Get Started
                <div className="bg-white text-brand-salmon w-6 h-6 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={14} strokeWidth={3} />
                </div>
              </Link>
              
              <div className="flex -space-x-3 items-center ml-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-11 h-11 rounded-full border-2 border-deep-dark bg-white/10 overflow-hidden backdrop-blur-md">
                    <img 
                      src={`https://i.pravatar.cc/100?img=${i + 20}`} 
                      alt="User" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
                <div className="w-11 h-11 rounded-full border-2 border-deep-dark bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40">
                  2K+
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Visuals */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            {/* Background Glows */}
            <div className="absolute w-[120%] h-[120%] bg-gradient-to-tr from-brand-coral/20 to-transparent rounded-full blur-[100px] -z-10" />
            
            {/* Main Image */}
            <div className="relative z-10 w-full max-w-[450px] aspect-[4/5] md:aspect-[4/5] rounded-[100px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 group">
                <img 
                  src="https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=1000" 
                  alt="Delicious Bowl" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Floating Card */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 md:-left-16 w-72 glass rounded-[2.5rem] p-6 shadow-2xl z-20 border-white/20"
            >
              <div className="flex items-center gap-4 mb-3">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-coral border border-white/10">
                    <ChefHat size={28} />
                 </div>
                 <div>
                    <div className="text-[10px] font-bold text-brand-peach uppercase tracking-[0.2em]">DAILY TIPS</div>
                    <div className="text-sm font-bold text-white leading-tight mt-0.5">Dari Hallo Jadi Jago</div>
                 </div>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                "Kunci ramen yang lezat ada pada kematangan telur onsen-nya."
              </p>
            </motion.div>

            {/* Floating Badge */}
            <div className="absolute -top-10 -right-4 w-32 h-32 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full flex flex-col items-center justify-center rotate-12 shadow-2xl z-20 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-brand-coral/20 to-transparent" />
               <span className="text-[10px] uppercase font-bold tracking-tighter text-white/60 relative">Trending</span>
               <span className="text-3xl font-black text-brand-coral relative">#1</span>
               <span className="text-[8px] opacity-40 uppercase font-bold relative">This Week</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
