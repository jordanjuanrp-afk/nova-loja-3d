import { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Smartphone, Check, Receipt, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import { CartItem } from '../types';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

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
  } | null;
  user: { id: string; name: string; email: string } | null;
  onSuccess: () => void;
}

type PaymentMethod = 'pix' | 'credit' | 'boleto';

export default function Payment({ items, customerData, user, onSuccess }: PaymentProps) {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [selectedInstallments, setSelectedInstallments] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = async () => {
    if (!selectedPayment) {
      toast.error('Selecione uma forma de pagamento');
      return;
    }

    if (!customerData || !user) {
      toast.error('Dados incompletos. Volte ao checkout.');
      navigate('/checkout');
      return;
    }

    setIsLoading(true);

    try {
      const orderNumber = `ORD-${Date.now()}`;
      
      const { error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            order_number: orderNumber,
            total: subtotal,
            payment_method: selectedPayment,
            status: 'pending',
            customer_name: customerData.name,
            customer_email: customerData.email,
            shipping_address: `${customerData.address}, ${customerData.complement}, ${customerData.city} - ${customerData.state}, ${customerData.cep}`,
            items: items.map(item => ({
              product_id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              color: item.selectedColor
            }))
          }
        ]);

      if (orderError) throw orderError;

      const paymentNames: Record<string, string> = {
        pix: 'PIX',
        credit: 'Cartão de Crédito',
        boleto: 'Boleto'
      };

      toast.success('Pedido realizado com sucesso!', {
        description: `Pedido ${orderNumber} - Pagamento via ${paymentNames[selectedPayment]}`
      });

      onSuccess();
      navigate('/');
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error('Erro ao processar pagamento: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-black flex items-center justify-center">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-black text-white">Seu carrinho está vazio</h2>
          <button
            onClick={() => navigate('/catalogo')}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500"
          >
            Ver Catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => navigate('/checkout')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Voltar para dados de entrega
        </button>

        <h1 className="text-4xl font-black text-white mb-8">
          Escolha a forma de <span className="text-green-400">Pagamento</span>
        </h1>

        {/* Order Summary */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Resumo do Pedido</h2>
          <div className="space-y-3 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-gray-400">
                <span>{item.quantity}x {item.name}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4 flex justify-between text-white font-bold text-xl">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <button
            onClick={() => setSelectedPayment('pix')}
            className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${
              selectedPayment === 'pix' 
                ? 'border-green-500 bg-green-500/10' 
                : 'border-white/10 bg-white/5 hover:border-green-500/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Smartphone className="text-green-400" size={28} />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-lg">PIX</p>
                <p className="text-sm text-gray-400">Aprovação instantânea</p>
              </div>
            </div>
            {selectedPayment === 'pix' && <Check className="text-green-400" size={28} />}
          </button>
          
          <button
            onClick={() => setSelectedPayment('credit')}
            className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${
              selectedPayment === 'credit' 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-white/10 bg-white/5 hover:border-blue-500/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <CreditCard className="text-blue-400" size={28} />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-lg">Cartão de Crédito</p>
                <p className="text-sm text-gray-400">Parcele em até 4x</p>
              </div>
            </div>
            {selectedPayment === 'credit' && <Check className="text-blue-400" size={28} />}
          </button>

          <button
            onClick={() => setSelectedPayment('boleto')}
            className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${
              selectedPayment === 'boleto' 
                ? 'border-yellow-500 bg-yellow-500/10' 
                : 'border-white/10 bg-white/5 hover:border-yellow-500/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Receipt className="text-yellow-400" size={28} />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-lg">Boleto</p>
                <p className="text-sm text-gray-400">Vencimento em 3 dias úteis</p>
              </div>
            </div>
            {selectedPayment === 'boleto' && <Check className="text-yellow-400" size={28} />}
          </button>

          {selectedPayment === 'credit' && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-3">
              <p className="text-sm font-bold text-white">Escolha o número de parcelas:</p>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelectedInstallments(num)}
                    className={`p-3 rounded-xl text-sm font-bold transition-all ${
                      selectedInstallments === num
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {num}x
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center">
                {selectedInstallments === 1 
                  ? 'À vista' 
                  : `${formatCurrency(subtotal / selectedInstallments)} por mês`}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Button */}
        <button
          onClick={handlePayment}
          disabled={!selectedPayment || isLoading}
          className="w-full mt-8 py-6 bg-gradient-to-r from-green-600 to-blue-600 text-white font-black text-xl rounded-2xl flex items-center justify-center gap-3 hover:from-green-500 hover:to-blue-500 transition-all shadow-2xl disabled:opacity-50"
        >
          {isLoading ? 'Processando...' : 'Confirmar Pagamento'}
        </button>
      </div>
    </div>
  );
}
