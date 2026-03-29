import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, Sparkles, ArrowRight, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (error) throw error;
        
        if (data.user) {
          toast.success('Conta criada com sucesso!', {
            description: 'Verifique seu e-mail para confirmar o cadastro.'
          });
          setIsRegistering(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          const isAdmin = data.user.email === 'jordanjuanrp@gmail.com';
          toast.success('Login realizado com sucesso!', {
            description: `Bem-vindo de volta!`
          });
          
          if (isAdmin) {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }
      }
    } catch (error: any) {
      let errorMessage = 'Erro na autenticação';
      let errorDescription = error.message;

      if (error.message === 'Invalid login credentials') {
        errorMessage = 'Credenciais Inválidas';
        errorDescription = 'E-mail ou senha incorretos. Se você ainda não tem uma conta, use a opção "Cadastre-se" abaixo.';
      } else if (error.message === 'Email not confirmed') {
        errorMessage = 'E-mail não confirmado';
        errorDescription = 'Por favor, verifique sua caixa de entrada e confirme seu e-mail antes de fazer login.';
      }

      toast.error(errorMessage, {
        description: errorDescription
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black overflow-hidden flex items-center justify-center px-4">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[40px] blur opacity-20" />
        
        <div className="relative bg-zinc-900 border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full mx-auto">
              <Sparkles size={14} className="text-purple-400" />
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                {isRegistering ? 'Novo Cadastro' : 'Acesso Restrito'}
              </span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              {isRegistering ? 'Criar ' : 'Painel '}
              <span className="text-purple-400">{isRegistering ? 'Conta' : 'Admin'}</span>
            </h1>
            <p className="text-gray-500 text-sm">
              {isRegistering 
                ? 'Junte-se ao ToyVerse e comece a colecionar!' 
                : 'Entre com suas credenciais para gerenciar a ToyVerse 3D.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {isRegistering && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-purple-500 transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-purple-500 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Senha</label>
                {!isRegistering && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!email) {
                        toast.error('Informe seu e-mail primeiro');
                        return;
                      }
                      const { error } = await supabase.auth.resetPasswordForEmail(email);
                      if (error) {
                        toast.error('Erro ao enviar e-mail de recuperação');
                      } else {
                        toast.success('E-mail de recuperação enviado!');
                      }
                    }}
                    className="text-[10px] text-purple-400 hover:text-purple-300 transition-colors uppercase font-bold tracking-widest"
                  >
                    Esqueceu?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-purple-500 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full bg-purple-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-purple-500 transition-all shadow-xl shadow-purple-500/20 disabled:opacity-50 group",
                isLoading && "animate-pulse"
              )}
            >
              {isLoading ? 'Processando...' : (isRegistering ? 'Criar Conta' : 'Entrar no Painel')}
              <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm font-bold text-gray-400 hover:text-purple-400 transition-colors"
            >
              {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Cadastre-se'}
            </button>
          </div>

          <div className="pt-6 border-t border-white/5">
            <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
              <Sparkles size={18} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Olá! Seja muito bem-vindo(a) 😊<br/>
                Estamos felizes em ter você aqui!<br/><br/>
                ✔️ Complete seu cadastro com dados corretos para uma melhor experiência<br/>
                ✔️ Explore todas as funcionalidades disponíveis na plataforma<br/>
                ✔️ Fique atento às nossas atualizações e novidades<br/>
                ✔️ Em caso de dúvidas, nosso suporte está sempre pronto para ajudar
              </p>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors"
            >
              Voltar para a Loja
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
