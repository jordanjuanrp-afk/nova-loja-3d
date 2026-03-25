import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { ArrowRight, Sparkles, Zap, Shield, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface HomeProps {
  onAddToCart: (product: Product) => void;
}

export default function Home({ onAddToCart }: HomeProps) {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) throw error;
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products from Supabase:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const featuredProducts = products.filter(p => p.isBestSeller).slice(0, 4);
  const newProducts = products.filter(p => p.isNew).slice(0, 4);

  const features = [
    {
      icon: <Zap className="text-blue-400" size={24} />,
      title: 'Produção Rápida',
      description: 'Seu brinquedo 3D pronto em tempo recorde com tecnologia de ponta.'
    },
    {
      icon: <Shield className="text-purple-400" size={24} />,
      title: 'Material Resistente',
      description: 'Utilizamos PLA e Resina de alta qualidade para máxima durabilidade.'
    },
    {
      icon: <Box className="text-orange-400" size={24} />,
      title: 'Personalização Total',
      description: 'Escolha cores, tamanhos e adicione detalhes exclusivos ao seu pedido.'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Hero />

      {/* Features Section */}
      <section className="py-20 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
              >
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-16">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                <Sparkles size={14} className="text-orange-400" />
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Mais Vendidos</span>
              </div>
              <h2 className="text-5xl font-black text-white tracking-tighter">
                Destaques da <span className="text-orange-400">Semana</span>
              </h2>
            </div>
            <Link 
              to="/catalogo" 
              className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors group"
            >
              Ver Catálogo Completo
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Banner / CTA */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto relative rounded-[40px] overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 p-12 lg:p-20">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent blur-3xl" />
          </div>
          
          <div className="relative z-10 max-w-2xl space-y-8">
            <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight tracking-tighter">
              Quer algo <span className="text-blue-200 underline decoration-wavy decoration-2">Único</span>? Personalize seu brinquedo 3D agora!
            </h2>
            <p className="text-xl text-blue-100/80">
              Escolha cores, tamanhos e adicione seu nome. Nossa equipe de designers transformará seu sonho em realidade.
            </p>
            <Link
              to="/personalizados"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-2xl shadow-black/20 group"
            >
              Começar Personalização
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-16">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <Zap size={14} className="text-blue-400" />
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Novidades</span>
              </div>
              <h2 className="text-5xl font-black text-white tracking-tighter">
                Lançamentos <span className="text-blue-400">Recentes</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-white/5 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl font-black text-white tracking-tighter">Fique por dentro das novidades!</h2>
          <p className="text-gray-400">Receba ofertas exclusivas, cupons de desconto e saiba primeiro sobre nossos novos modelos 3D.</p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Seu melhor e-mail" 
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all"
            />
            <button className="px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
              Inscrever-se
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
