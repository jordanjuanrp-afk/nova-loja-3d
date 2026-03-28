import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, CreditCard } from 'lucide-react';
import { CartItem } from '../types';
import { createMercadoPagoPreference } from '../lib/mercadopago';
import MercadoPagoCheckout from '../components/MercadoPagoCheckout';

interface PaymentProps {
  items: CartItem[];
  customerData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    cep: string;
    complement: string;
  };
}

export default function Payment({ items, customerData }: PaymentProps) {
  const navigate = useNavigate();
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function createPreference() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await createMercadoPagoPreference(items, {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: {
            street_name: customerData.address,
            street_number: '0',
            zip_code: customerData.cep,
          },
        });
        
        setPreferenceId(response.id);
      } catch (err: any) {
        console.error('Erro ao criar preferência:', err);
        setError(err.message || 'Erro ao carregar checkout');
      } finally {
        setIsLoading(false);
      }
    }

    if (items.length > 0) {
      createPreference();
    }
  }, [items, customerData]);

  if (items.length === 0) {
    navigate('/checkout');
    return null;
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/checkout')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ChevronLeft size={20} />
          Voltar
        </button>

        <h1 className="text-4xl font-black text-white mb-12">
          Finalizar <span className="text-green-400">Pagamento</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 space-y-6 h-fit">
            <h2 className="text-xl font-bold text-white">Resumo do Pedido</h2>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold truncate">{item.name}</h3>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-white font-bold">
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Frete</span>
                <span className="text-green-400">A calcular</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                <span>Total</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
              <div className="text-gray-400">
                <span className="font-bold text-gray-300">Cliente:</span> {customerData.name}
              </div>
              <div className="text-gray-400">
                <span className="font-bold text-gray-300">Email:</span> {customerData.email}
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-6">
            {error ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-6">
                <p className="text-red-400 text-center">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : (
              <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6">
                <MercadoPagoCheckout
                  preferenceId={preferenceId}
                  isLoading={isLoading}
                  onError={setError}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
