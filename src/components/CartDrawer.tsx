import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { formatCurrency } from '../lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const navigate = useNavigate();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 h-full w-full max-w-md bg-zinc-900 border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Seu Carrinho</h2>
                <span className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded-full border border-white/5">
                  {items.length} itens
                </span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-gray-600">
                    <ShoppingBag size={40} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Carrinho Vazio</h3>
                    <p className="text-gray-500 text-sm">Parece que você ainda não adicionou nenhum brinquedo 3D.</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                  >
                    Começar a Comprar
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-white/5 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-white font-bold truncate pr-2">{item.name}</h4>
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="text-gray-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">Cor: {item.selectedColor}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1 border border-white/5">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold text-white w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-white font-bold">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-md space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Frete</span>
                    <span className="text-green-400 font-medium">Grátis</span>
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-2xl font-black text-white">{formatCurrency(subtotal)}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    onClose();
                    setTimeout(() => navigate('/checkout', { replace: true }), 100);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20 group"
                >
                  Finalizar Compra
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest">
                  Pagamento 100% Seguro via Pix ou Cartão
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
