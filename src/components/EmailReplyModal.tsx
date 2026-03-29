import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Mail, User, MessageSquare } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';

interface EmailReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestion: {
    user_name: string;
    user_email: string;
    suggestion: string;
    toy_type: string;
  };
}

export default function EmailReplyModal({ isOpen, onClose, suggestion }: EmailReplyModalProps) {
  const [isSending, setIsSending] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSend = async () => {
    if (!replyText.trim()) {
      toast.error('Por favor, escreva uma resposta');
      return;
    }

    setIsSending(true);

    try {
      const templateParams = {
        to_name: suggestion.user_name,
        to_email: suggestion.user_email,
        from_name: 'ToyVerse 3D',
        subject: 'Resposta à sua sugestão - ToyVerse 3D',
        original_suggestion: suggestion.suggestion,
        toy_type: suggestion.toy_type,
        reply_message: replyText
      };

      await emailjs.send(
        'service_toyverse', // Service ID - precisa ser configurado no EmailJS
        'template_reply', // Template ID - precisa ser configurado no EmailJS
        templateParams,
        'YOUR_PUBLIC_KEY' // Public Key - precisa ser configurado no EmailJS
      );

      toast.success('Email enviado com sucesso!');
      setReplyText('');
      onClose();
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast.error('Erro ao enviar email. Verifique as configurações do EmailJS.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-zinc-900 sticky top-0 z-10">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <Mail size={24} className="text-blue-400" />
                Responder por E-mail
              </h2>
              <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Informações do Cliente */}
              <div className="bg-white/5 rounded-2xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Informações do Cliente</h3>
                <div className="flex items-center gap-3">
                  <User size={16} className="text-gray-500" />
                  <span className="text-white font-bold">{suggestion.user_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-500" />
                  <span className="text-white">{suggestion.user_email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare size={16} className="text-gray-500" />
                  <span className="text-white text-sm">Tipo: {suggestion.toy_type}</span>
                </div>
              </div>

              {/* Sugestão Original */}
              <div className="bg-white/5 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Sugestão Original</h3>
                <p className="text-gray-300 italic">"{suggestion.suggestion}"</p>
              </div>

              {/* Campo de Resposta */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Sua Resposta</label>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  rows={6}
                  placeholder="Escreva sua resposta para o cliente..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all resize-none placeholder:text-gray-600"
                />
              </div>

              {/* Botões */}
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSend}
                  disabled={isSending || !replyText.trim()}
                  className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Enviar Resposta
                    </>
                  )}
                </button>
              </div>

              {/* Nota de Configuração */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
                <p className="text-yellow-400 text-sm">
                  <strong>Nota:</strong> Para funcionar, configure o EmailJS com:
                </p>
                <ul className="text-yellow-400/80 text-sm mt-2 list-disc list-inside">
                  <li>Service ID</li>
                  <li>Template ID</li>
                  <li>Public Key</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}