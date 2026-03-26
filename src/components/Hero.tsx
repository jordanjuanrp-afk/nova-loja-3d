import { motion } from 'motion/react';
import { ArrowRight, Box, Zap, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface HeroProps {
  products: Product[];
}

export default function Hero({ products }: HeroProps) {
  const displayProduct = products && products.length > 0 ? products[0] : null;

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
              <Sparkles size={16} className="text-blue-400" />
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Tecnologia de Impressão 3D de Ponta</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              Transformando <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400">Ideias</span> em Diversão Real.
            </h1>
            
            <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
              Descubra o universo dos brinquedos 3D. Articulados, personalizados e colecionáveis únicos criados com a mais alta tecnologia de impressão.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/catalogo"
                className="px-8 py-4 bg-white text-black font-bold rounded-2xl flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-white/5 group"
              >
                Explorar Catálogo
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/personalizados"
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all backdrop-blur-md"
              >
                Personalizar Agora
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5">
              <div>
                <div className="text-3xl font-black text-white">5k+</div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">Clientes Felizes</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white">200+</div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">Modelos Únicos</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white">24h</div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">Produção Rápida</div>
              </div>
            </div>
          </motion.div>

          {/* 3D Visual Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative flex items-center justify-center"
          >
            <div className="relative z-10 w-full aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-[40px] border border-white/10 backdrop-blur-3xl p-8 flex items-center justify-center group overflow-hidden">
              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-10 right-10 w-20 h-20 bg-orange-500/20 rounded-2xl border border-orange-500/30 flex items-center justify-center backdrop-blur-md"
              >
                <Box size={32} className="text-orange-400" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-10 left-10 w-20 h-20 bg-blue-500/20 rounded-2xl border border-blue-500/30 flex items-center justify-center backdrop-blur-md"
              >
                <Zap size={32} className="text-blue-400" />
              </motion.div>

              {/* Main Image Placeholder */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src={displayProduct?.image || "https://picsum.photos/seed/3dtoy/1000/1000"} 
                  alt={displayProduct?.name || "3D Toy Showcase"} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-white font-bold text-xl mb-1">{displayProduct?.name || "Dragão de Cristal Articulado"}</div>
                  <div className="text-blue-400 font-medium text-sm">{displayProduct ? `${displayProduct.price}` : "O mais vendido da semana"}</div>
                </div>
              </div>
            </div>

            {/* Decorative Rings */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
