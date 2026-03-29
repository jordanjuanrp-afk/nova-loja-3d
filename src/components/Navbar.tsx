import { ShoppingCart, User, Search, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  user: any;
}

export default function Navbar({ cartCount, onOpenCart, user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao sair');
    } else {
      toast.success('Sessão encerrada');
      navigate('/');
    }
  };

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Catálogo', path: '/catalogo' },
    { name: 'Personalizados', path: '/personalizados' },
    { name: 'Sobre Nós', path: '/sobre' },
    { name: 'Contato', path: '/contato' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">3D</span>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tighter">
              ToyVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full" />
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors relative group flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                Painel Admin
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Search size={20} />
            </button>
            <Link 
              to={user ? (user.role === 'admin' ? '/admin' : '/') : '/login'}
              className="p-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <User size={20} />
              {user && <span className="hidden lg:inline text-sm">{user.email.split('@')[0]}</span>}
            </Link>
            {user && (
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            )}
            <button 
              onClick={onOpenCart}
              className="p-2 text-gray-400 hover:text-white transition-colors relative"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block px-3 py-4 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="block px-3 py-4 text-base font-bold text-purple-400 hover:text-purple-300 hover:bg-white/5 rounded-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Painel Admin
                </Link>
              )}
              {!user && (
                <Link
                  to="/login"
                  className="block px-3 py-4 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
              )}
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-4 text-base font-bold text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-all"
                >
                  <LogOut size={20} />
                  Sair
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
