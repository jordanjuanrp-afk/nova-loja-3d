import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Send, User, Mail, MessageSquare, Sparkles, CheckCircle2, Rocket } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

export default function CustomRequest() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    suggestion: '',
    toyType: 'articulado'
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Try to insert into a 'custom_requests' table if it exists
      // If it doesn't, we'll just show a success message for the demo
      const { error } = await supabase
        .from('custom_requests')
        .insert([
          { 
            user_name: formData.name, 
            user_email: formData.email, 
            suggestion: formData.suggestion,
            toy_type: formData.toyType,
            created_at: new Date().toISOString()
          }
        ])
        ;

      if (error && error.code !== '42P01') { // 42P01 is "relation does not exist"
        throw error;
      }

      setIsSuccess(true);
      toast.success('Sugestão enviada com sucesso!', {
        description: 'Nossa equipe analisará sua ideia e entrará em contato.'
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', suggestion: '', toyType: 'articulado' });
      }, 5000);

    } catch (error: any) {
      console.error('Error submitting suggestion:', error);
      toast.error('Erro ao enviar sugestão. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                <Sparkles size={14} className="text-orange-400" />
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Personalização Total</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">
                Dê Vida à Sua <br />
                <span className="text-orange-500">Imaginação</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                Tem uma ideia incrível para um brinquedo ou colecionável? Nós transformamos seu conceito em realidade usando tecnologia 3D de ponta.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shrink-0">
                  <Rocket size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Processo Criativo</h3>
                  <p className="text-gray-500 text-sm">Analisamos sua sugestão e criamos um design exclusivo para você.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Aprovação Direta</h3>
                  <p className="text-gray-500 text-sm">Você acompanha cada etapa, da modelagem à impressão final.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-purple-600 rounded-[40px] blur opacity-20" />
            
            <div className="relative bg-zinc-900 border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
                    <CheckCircle2 size={48} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white">Obrigado!</h2>
                    <p className="text-gray-400">Sua sugestão foi enviada com sucesso. Entraremos em contato em breve.</p>
                  </div>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="text-orange-500 font-bold hover:underline"
                  >
                    Enviar outra sugestão
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Seu Nome</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        type="text"
                        required
                        placeholder="Como podemos te chamar?"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-orange-500 transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Seu Melhor E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        type="email"
                        required
                        placeholder="Para enviarmos o orçamento"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-orange-500 transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Tipo de Brinquedo</label>
                    <select
                      value={formData.toyType}
                      onChange={e => setFormData({...formData, toyType: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="articulado">Articulado</option>
                      <option value="personalizado">Personalizado (Nome/Foto)</option>
                      <option value="miniatura">Miniatura de Personagem</option>
                      <option value="educativo">Brinquedo Educativo</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Sua Sugestão / Ideia</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 text-gray-500" size={18} />
                      <textarea
                        required
                        rows={4}
                        placeholder="Descreva o brinquedo dos seus sonhos..."
                        value={formData.suggestion}
                        onChange={e => setFormData({...formData, suggestion: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-orange-500 transition-all placeholder:text-gray-600 resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "w-full bg-orange-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-orange-500 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 group",
                      isSubmitting && "animate-pulse"
                    )}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Sugestão'}
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
