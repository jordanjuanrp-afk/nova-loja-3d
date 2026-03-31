import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Box, Zap, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useState, useEffect, useCallback, useRef } from 'react';

interface HeroProps {
  products: Product[];
}

export default function Hero({ products }: HeroProps) {
  const displayProducts = products && products.length > 0 ? products.slice(0, 6) : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % displayProducts.length);
  }, [displayProducts.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + displayProducts.length) % displayProducts.length);
  }, [displayProducts.length]);

  useEffect(() => {
    if (displayProducts.length <= 1 || isPaused) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [displayProducts.length, isPaused, nextSlide]);

  const currentProduct = displayProducts[currentIndex] || null;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr,1fr] gap-8 lg:gap-12 items-center pl-0 lg:pl-8">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 pl-2 lg:pl-0"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
              <Sparkles size={16} className="text-blue-400" />
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Tecnologia de Impressão 3D de Ponta</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.9] tracking-tight">
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

          {/* 3D Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative flex items-center justify-center lg:translate-x-16"
          >
            <div 
              className="relative z-10 w-full aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-[40px] border border-white/10 backdrop-blur-3xl p-8 flex items-center justify-center group overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
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

              {/* Carousel Container */}
              <div className="relative w-full h-full">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: 'spring', stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                  >
                    <img 
                      src={currentProduct?.image || "https://picsum.photos/seed/3dtoy/1000/1000"} 
                      alt={currentProduct?.name || "3D Toy Showcase"} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Product Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-center gap-2 mb-2">
                        {currentProduct?.isNew && (
                          <span className="px-3 py-1 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                            Novo
                          </span>
                        )}
                        {currentProduct?.isBestSeller && (
                          <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                            Destaque
                          </span>
                        )}
                      </div>
                      <div className="text-white font-black text-2xl mb-1">{currentProduct?.name || "Dragão de Cristal Articulado"}</div>
                      <div className="flex items-center justify-between">
                        <div className="text-blue-400 font-bold text-xl">{formatCurrency(currentProduct?.price || 0)}</div>
                        <Link 
                          to={`/produto/${currentProduct?.id}`}
                          className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
                        >
                          Ver Detalhes
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {displayProducts.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-colors z-10"
                    >
                      <ChevronLeft size={24} className="text-white" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-colors z-10"
                    >
                      <ChevronRight size={24} className="text-white" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {displayProducts.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                          }}
                          className={`h-2 rounded-full transition-all ${
                            index === currentIndex 
                              ? 'bg-white w-6' 
                              : 'bg-white/40 hover:bg-white/60 w-2'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Decorative Rings */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
          </motion.div>
        </div>

        {/* Products Loop Banner */}
        {displayProducts.length > 1 && (
          <motion.div 
            className="mt-16 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Destaques</span>
            </div>
            
            <div 
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <motion.div
                ref={scrollRef}
                className="flex gap-4"
                animate={{ x: [0, -400] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                  },
                }}
                style={{ width: 'max-content' }}
              >
                {[...displayProducts, ...displayProducts].map((product, index) => (
                  <Link
                    key={`${product.id}-${index}`}
                    to={`/produto/${product.id}`}
                    className="flex-shrink-0 w-48 group"
                  >
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-blue-500/50 transition-all">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      {(product.isNew || product.isBestSeller) && (
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {product.isNew && (
                            <span className="px-2 py-0.5 bg-blue-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-full">
                              Novo
                            </span>
                          )}
                          {product.isBestSeller && (
                            <span className="px-2 py-0.5 bg-orange-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-full">
                              Destaque
                            </span>
                          )}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="mt-3 px-1">
                      <div className="text-white font-bold text-sm truncate group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </div>
                      <div className="text-blue-400 font-bold text-sm mt-1">
                        {formatCurrency(product.price)}
                      </div>
                    </div>
                  </Link>
                ))}
              </motion.div>

              {/* Gradient Fades */}
              <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
              <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
