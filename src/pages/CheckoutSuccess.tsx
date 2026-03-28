import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto px-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle size={64} className="text-green-500" />
        </motion.div>
        
        <h1 className="text-4xl font-black text-white mb-4">
          Pagamento Aprovado!
        </h1>
        
        <p className="text-gray-400 text-lg mb-8">
          Seu pedido foi confirmado com sucesso. Você receberá um e-mail com os detalhes do pedido e informações de rastreamento em breve.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Package size={20} />
            Voltar para Home
          </Link>
          
          <Link
            to="/catalogo"
            className="block w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            Continuar Comprando
            <ArrowRight size={20} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
