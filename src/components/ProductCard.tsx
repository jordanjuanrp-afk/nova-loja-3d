import { ShoppingCart, Eye, Heart, Star, ZoomIn } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import ImageLightbox from './ImageLightbox';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/20">
            Novo
          </span>
        )}
        {product.isBestSeller && (
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-orange-500 text-white rounded-full shadow-lg shadow-orange-500/20">
            Destaque
          </span>
        )}
      </div>

      {/* Action Buttons (Hover) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="p-2 bg-black/60 backdrop-blur-md text-white rounded-full hover:bg-blue-500 transition-colors">
          <Heart size={18} />
        </button>
        <Link 
          to={`/produto/${product.id}`}
          className="p-2 bg-black/60 backdrop-blur-md text-white rounded-full hover:bg-purple-500 transition-colors"
        >
          <Eye size={18} />
        </Link>
      </div>

      {/* Image */}
      <div 
        className="relative aspect-square overflow-hidden bg-white/5 cursor-zoom-in"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLightboxOpen(true); }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Zoom Icon - always visible on mobile */}
        <div className="absolute bottom-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 sm:opacity-0 transition-opacity">
          <ZoomIn size={16} className="text-white" />
        </div>
        
        {/* Touch hint for mobile */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-0 sm:opacity-0 group-active:opacity-100 transition-opacity">
          <div className="p-3 bg-black/50 backdrop-blur-md rounded-full">
            <ZoomIn size={24} className="text-white" />
          </div>
        </div>
        
        {/* Quick Add Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="absolute bottom-4 left-4 right-4 py-3 bg-white text-black font-bold text-sm rounded-xl transform translate-y-12 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 hover:bg-blue-400 hover:text-white"
        >
          <ShoppingCart size={18} />
          Adicionar ao Carrinho
        </button>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className="fill-orange-500 text-orange-500" />
          ))}
          <span className="text-[10px] text-gray-500 ml-1">(4.9)</span>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-2 mb-4">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-black text-white">
            {formatCurrency(product.price)}
          </span>
          <span className="text-[10px] uppercase tracking-tighter text-gray-500">
            {product.category}
          </span>
        </div>
      </div>

      <ImageLightbox
        images={[product.image]}
        currentIndex={0}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        productName={product.name}
      />
    </motion.div>
  );
};

export default ProductCard;
