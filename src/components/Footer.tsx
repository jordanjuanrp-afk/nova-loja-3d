import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl">3D</span>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tighter">
                ToyVerse
              </span>
            </Link>
            <p className="text-gray-500 leading-relaxed">
              Transformando o mundo dos brinquedos com inovação e tecnologia de impressão 3D. Criatividade sem limites para todas as idades.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <button key={i} className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Navegação</h3>
            <ul className="space-y-4">
              {['Início', 'Catálogo', 'Personalizados', 'Sobre Nós', 'Contato'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Categorias</h3>
            <ul className="space-y-4">
              {['Articulados', 'Personalizados', 'Miniaturas', 'Educativos', 'Colecionáveis'].map((item) => (
                <li key={item}>
                  <Link to="/catalogo" className="text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-500">
                <MapPin size={20} className="text-blue-500 flex-shrink-0" />
                <span>Av. da Inovação, 3D - CURITIBA, PR</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Phone size={20} className="text-purple-500 flex-shrink-0" />
                <span>(41) 98712-2246</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Mail size={20} className="text-orange-500 flex-shrink-0" />
                <span>junincarvalhos22@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">
            © {currentYear} ToyVerse 3D - Todos os direitos reservados.
          </p>
          <div className="flex gap-8">
            <Link to="/privacidade" className="text-gray-600 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Privacidade</Link>
            <Link to="/termos" className="text-gray-600 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Termos de Uso</Link>
            <Link to="/cookies" className="text-gray-600 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
