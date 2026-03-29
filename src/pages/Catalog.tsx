import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, ChevronDown, Sparkles, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

interface CatalogProps {
  onAddToCart: (product: Product) => void;
}

export default function Catalog({ onAddToCart }: CatalogProps) {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest'>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          ;
        
        if (error) {
          // error handled silently
        }
        if (data && data.length > 0) {
          const mappedData = data.map(p => ({
            ...p,
            isNew: p.is_new,
            isBestSeller: p.is_best_seller
          }));
          setProducts(mappedData);
        }
      } catch (error) {
        // error handled silently
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'articulado', name: 'Articulados' },
    { id: 'personalizado', name: 'Personalizados' },
    { id: 'miniatura', name: 'Miniaturas' },
    { id: 'educativo', name: 'Educativos' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <Sparkles size={14} className="text-blue-400" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Catálogo Completo</span>
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter">
              Explore o <span className="text-blue-400">Universo</span> 3D
            </h1>
            <p className="text-gray-400 max-w-md">
              Navegue por nossa coleção exclusiva de brinquedos impressos em 3D com a mais alta tecnologia.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Buscar brinquedos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12 py-6 border-y border-white/5">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all border",
                  selectedCategory === cat.id
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white/5 border border-white/10 rounded-xl px-6 py-2.5 pr-12 text-sm font-bold text-gray-400 hover:text-white transition-all outline-none cursor-pointer"
              >
                <option value="newest">Mais Recentes</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            </div>

            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedCategory !== 'todos' || searchQuery) && (
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Filtros Ativos:</span>
            <div className="flex flex-wrap gap-2">
              {selectedCategory !== 'todos' && (
                <button 
                  onClick={() => setSelectedCategory('todos')}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest hover:bg-blue-500/20 transition-all"
                >
                  Categoria: {categories.find(c => c.id === selectedCategory)?.name}
                  <X size={12} />
                </button>
              )}
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest hover:bg-blue-500/20 transition-all"
                >
                  Busca: {searchQuery}
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-32 text-center space-y-6">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-600">
              <Search size={48} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tighter">Nenhum brinquedo encontrado</h3>
              <p className="text-gray-500 mt-2">Tente ajustar seus filtros ou buscar por outro termo.</p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('todos');
              }}
              className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-blue-500 hover:text-white transition-all"
            >
              Limpar Todos os Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
