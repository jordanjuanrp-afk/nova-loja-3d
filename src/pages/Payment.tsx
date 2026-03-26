import { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Smartphone, Check, ArrowLeft, MessageCircle, Copy, CheckCircle } from 'lucide-react';
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

type PaymentMethod = 'pix' | 'credit';

export default function Payment({ items, customerData, user, onSuccess }: PaymentProps) {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [selectedInstallments, setSelectedInstallments] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [copied, setCopied] = useState(false);

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
      const newOrderNumber = `ORD-${Date.now()}`;
      
      const { error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            order_number: newOrderNumber,
            total: subtotal,
            payment_method: selectedPayment,
            status: 'pending'
          }
        ]);

      if (orderError) throw orderError;

      setOrderNumber(newOrderNumber);
      setOrderComplete(true);
      onSuccess();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error('Erro ao processar pagamento: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWhatsAppLink = () => {
    const phoneNumber = '5521999999999'; // Substitua pelo número da loja
    const message = `📢 *Aviso Importante*\n\nPara concluir seu pedido, peça que finalize a compra e, em seguida, você será automaticamente redirecionado para o nosso atendimento no WhatsApp 📲.\n\nPor lá, confirmaremos os detalhes do seu pedido e daremos continuidade ao seu atendimento de forma rápida e segura.\n\nAgradecemos pela preferência! 😊\n\n*ID do Pedido:* ${orderNumber}\n*Valor:* ${formatCurrency(subtotal)}`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  // Página de sucesso
  if (orderComplete) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-black">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-3xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-green-500" size={40} />
              </div>
              <h1 className="text-3xl font-black text-white mb-2">Pedido Realizado!</h1>
              <p className="text-gray-400">Agora realize o pagamento para confirmar seu pedido</p>
            </div>

            {/* Order ID */}
            <div className="bg-white/5 rounded-2xl p-4 mb-6">
              <p className="text-sm text-gray-400 mb-2">ID do Pedido</p>
              <div className="flex items-center justify-between bg-black/40 rounded-xl p-3">
                <span className="text-white font-mono font-bold text-lg">{orderNumber}</span>
                <button onClick={copyOrderId} className="text-gray-400 hover:text-white transition-colors">
                  {copied ? <CheckCircle size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            {/* QR Code for PIX */}
            {selectedPayment === 'pix' && (
              <div className="text-center mb-6">
                <p className="text-sm text-gray-400 mb-4">Escaneie o QR Code para pagar</p>
                <div className="inline-block bg-white p-4 rounded-2xl">
                  <img 
                    src="/qrcode-pix.png" 
                    alt="QR Code PIX" 
                    className="w-48 h-48"
                  />
                </div>
              </div>
            )}

            {/* WhatsApp Button */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-colors"
            >
              <MessageCircle size={24} />
              Enviar Comprovante via WhatsApp
            </a>

            <p className="text-center text-xs text-gray-500 mt-6">
              Após o pagamento, envie o comprovante pelo WhatsApp
            </p>

            <button
              onClick={() => {
                setOrderComplete(false);
                navigate('/');
              }}
              className="w-full mt-4 py-3 text-gray-400 hover:text-white transition-colors text-sm"
            >
              Voltar para Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

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
