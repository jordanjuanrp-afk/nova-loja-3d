import { useState, FormEvent, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, MapPin, Package, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import { CartItem } from '../types';
import { toast } from 'sonner';

interface CheckoutProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToPayment: (customerData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    cep: string;
    complement: string;
  }) => void;
}

export default function Checkout({ items, onUpdateQuantity, onRemoveItem, onProceedToPayment }: CheckoutProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    cep: '',
    complement: '',
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.state || !formData.cep) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    onProceedToPayment(formData);
    navigate('/payment');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-black flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-600">
            <Package size={48} />
          </div>
          <h2 className="text-2xl font-black text-white">Seu carrinho está vazio</h2>
          <p className="text-gray-500">Adicione produtos ao carrinho para continuar</p>
          <button
            onClick={() => navigate('/catalogo')}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all"
          >
            Ver Catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ChevronLeft size={20} />
          Voltar
        </button>

        <h1 className="text-4xl font-black text-white mb-12">
          Dados de <span className="text-blue-400">Entrega</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <MapPin className="text-blue-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Informações de Entrega</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nome Completo *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500 transition-all mt-2"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">E-mail *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500 transition-all mt-2"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Telefone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500 transition-all mt-2"
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Endereço *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500 transition-all mt-2"
                      placeholder="Rua, número, bairro"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Cidade *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500 transition-all mt-2"
                      placeholder="Cidade"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Estado *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500 transition-all mt-2"
                      placeholder="UF"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">CEP *</label>
                    <input
                      type="text"
                      name="cep"
                      required
                      value={formData.cep}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500 transition-all mt-2"
                      placeholder="00000-000"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Complemento</label>
                    <input
                      type="text"
                      name="complement"
                      value={formData.complement}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500 transition-all mt-2"
                      placeholder="Apto, bloco, etc"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-xl rounded-2xl flex items-center justify-center gap-3 hover:from-blue-500 hover:to-purple-500 transition-all shadow-2xl shadow-blue-500/20 group"
              >
                Continuar para Pagamento
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 sticky top-32">
              <h2 className="text-xl font-bold text-white mb-6">Resumo do Pedido</h2>
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{item.name}</p>
                      <p className="text-gray-500 text-xs">Qtd: {item.quantity}</p>
                      <p className="text-white font-bold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Frete</span>
                  <span>Grátis</span>
                </div>
                <div className="flex justify-between text-white font-bold text-xl pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
