import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, Share2, Star, Shield, Zap, Box, Check, ZoomIn, Eye } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { Product, CartItem } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import ImageLightbox from '../components/ImageLightbox';
import ProductPreview from '../components/ProductPreview';

interface ProductDetailProps {
  onAddToCart: (product: Product, quantity: number, color: string) => void;
}

export default function ProductDetail({ onAddToCart }: ProductDetailProps) {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'preview' | 'desc' | 'spec' | 'eval'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const allImages = product ? [product.image, ...(product.images || [])] : [''];

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()
          ;
        
        if (error) throw error;
        if (data) {
          const mappedData = {
            ...data,
            isNew: data.is_new,
            isBestSeller: data.is_best_seller,
            videoUrl: data.video_url,
            images: Array.isArray(data.images) ? data.images : []
          };
          setProduct(mappedData);
          if (mappedData.colors && mappedData.colors.length > 0) {
            setSelectedColor(mappedData.colors[0]);
          }
          setMainImageIndex(0);
        }
      } catch (error) {
        console.error('Error fetching product from Supabase:', error);
        // Fallback to static PRODUCTS
        const found = PRODUCTS.find(p => p.id === id);
        if (found) {
          setProduct(found);
          setSelectedColor(found.colors[0]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-black mb-4 tracking-tighter">Produto não encontrado</h2>
        <Link to="/catalogo" className="text-blue-400 font-bold hover:underline">Voltar ao catálogo</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Início</Link>
          <span>/</span>
          <Link to="/catalogo" className="hover:text-white transition-colors">Catálogo</Link>
          <span>/</span>
          <span className="text-blue-400">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Product Image Section */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-[40px] overflow-hidden bg-white/5 border border-white/10 group shadow-2xl cursor-zoom-in"
              onClick={() => { setLightboxIndex(mainImageIndex); setLightboxOpen(true); }}
            >
              <img
                src={allImages[mainImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.isNew && <span className="px-4 py-1.5 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-500/20">Novo</span>}
                {product.isBestSeller && <span className="px-4 py-1.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-orange-500/20">Destaque</span>}
              </div>
              <div className="absolute bottom-6 right-6 p-3 bg-black/60 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={20} className="text-white" />
              </div>
            </motion.div>

            {/* Thumbnail Gallery */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Galeria de Imagens
                </span>
                {product.images && product.images.length > 0 && (
                  <span className="text-xs text-blue-400 font-medium">
                    {allImages.length} imagens
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                <div 
                  className={cn(
                    "aspect-square rounded-xl bg-white/5 border overflow-hidden cursor-pointer transition-all hover:scale-105 relative",
                    mainImageIndex === 0 ? "border-blue-500 ring-2 ring-blue-500/50" : "border-white/10 hover:border-blue-500"
                  )}
                  onClick={() => setMainImageIndex(0)}
                >
                  <img src={product.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                    1
                  </div>
                </div>
                {product.images && product.images.length > 0 ? (
                  product.images.map((img, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "aspect-square rounded-xl bg-white/5 border overflow-hidden cursor-pointer transition-all hover:scale-105 relative",
                        mainImageIndex === i + 1 ? "border-blue-500 ring-2 ring-blue-500/50" : "border-white/10 hover:border-blue-500"
                      )}
                      onClick={() => setMainImageIndex(i + 1)}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                        {i + 2}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center text-gray-500 py-4 text-sm">
                    Adicione mais imagens no painel admin
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 text-center">
                Clique em uma imagem para ampliar
              </p>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <span className="text-sm text-gray-400 font-bold ml-2">4.9 (124 avaliações)</span>
              </div>
              
              <h1 className="text-5xl font-black text-white tracking-tighter leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black text-white">{formatCurrency(product.price)}</span>
                <span className="text-sm text-gray-500 line-through">{formatCurrency(product.price * 1.2)}</span>
              </div>
            </div>

            <p className="text-lg text-gray-400 leading-relaxed">
              {product.description}
            </p>

            {/* Selection Options */}
            <div className="space-y-8 py-8 border-y border-white/5">
              {/* Color Selection */}
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Escolha a Cor</label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "px-6 py-3 rounded-xl font-bold text-sm transition-all border",
                        selectedColor === color 
                          ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                          : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="flex items-center gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">Quantidade</label>
                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-2">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                      -
                    </button>
                    <span className="text-lg font-bold text-white w-8 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">Ações Rápidas</label>
                  <div className="flex gap-4">
                    <button className="flex-1 p-4 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                      <Heart size={20} />
                      Favoritar
                    </button>
                    <button className="p-4 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => onAddToCart(product, quantity, selectedColor)}
              className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-xl rounded-2xl flex items-center justify-center gap-3 hover:from-blue-500 hover:to-purple-500 transition-all shadow-2xl shadow-blue-500/20 group"
            >
              <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
              Adicionar ao Carrinho
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><Zap size={20} /></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Envio Rápido</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl"><Shield size={20} /></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Compra Segura</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl"><Box size={20} /></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Material Premium</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-32">
          <div className="flex gap-12 border-b border-white/5 mb-12">
            {[
              { id: 'preview', label: 'Preview 3D' },
              { id: 'desc', label: 'Descrição' },
              { id: 'spec', label: 'Especificações' },
              { id: 'eval', label: 'Avaliações' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "pb-6 text-sm font-black uppercase tracking-widest transition-all relative flex items-center gap-2",
                  activeTab === tab.id ? "text-white" : "text-gray-500 hover:text-gray-300"
                )}
              >
                {tab.id === 'preview' && <Eye size={16} />}
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl text-gray-400 leading-relaxed text-lg">
            {activeTab === 'preview' && (
              <div className="space-y-6">
                <ProductPreview
                  imageUrl={product.image}
                  productName={product.name}
                />
              </div>
            )}
            
            {activeTab === 'desc' && (
              <div className="space-y-6">
                <p>{product.description}</p>
                <p>Nossos brinquedos 3D são criados com a mais alta precisão, garantindo que cada detalhe seja fiel ao design original. O material utilizado é o PLA Premium, que além de ser resistente, é biodegradável e seguro para todas as idades.</p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3"><Check size={20} className="text-green-500" /> Impressão em alta resolução (0.1mm)</li>
                  <li className="flex items-center gap-3"><Check size={20} className="text-green-500" /> Acabamento manual para remoção de suportes</li>
                  <li className="flex items-center gap-3"><Check size={20} className="text-green-500" /> Cores vibrantes que não desbotam</li>
                </ul>
              </div>
            )}
            {activeTab === 'spec' && (
              <div className="grid grid-cols-2 gap-8 bg-white/5 p-8 rounded-3xl border border-white/10">
                <div className="space-y-6">
                  <div>
                    <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Material</div>
                    <div className="text-white font-bold">{product.material}</div>
                  </div>
                  <div>
                    <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Tamanho</div>
                    <div className="text-white font-bold">{product.size}</div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Categoria</div>
                    <div className="text-white font-bold uppercase">{product.category}</div>
                  </div>
                  <div>
                    <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Tecnologia</div>
                    <div className="text-white font-bold">FDM / SLA (Resina)</div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'eval' && (
              <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">U</div>
                        <div>
                          <div className="text-white font-bold">Usuário Satisfeito</div>
                          <div className="text-xs text-gray-500">Comprado há 2 semanas</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={14} className="fill-orange-500 text-orange-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300">"Simplesmente incrível! A qualidade da impressão é muito superior ao que eu esperava. O dragão articulado se move perfeitamente e a cor neon brilha muito sob luz UV. Recomendo demais!"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ImageLightbox
        images={allImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setLightboxIndex(prev => (prev + 1) % allImages.length)}
        onPrev={() => setLightboxIndex(prev => (prev - 1 + allImages.length) % allImages.length)}
        productName={product.name}
      />
    </div>
  );
}
