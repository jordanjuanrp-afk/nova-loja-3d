import { motion } from 'motion/react';
import { Sparkles, Rocket, Heart, ShieldCheck } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6 relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <Sparkles size={14} className="text-blue-400" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Nossa História</span>
            </div>
            <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter leading-none">
              Inovação em <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-orange-500">
                Cada Detalhe
              </span>
            </h1>
          </motion.div>

          {/* Background Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-0 opacity-20 blur-[120px]">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600 rounded-full animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600 rounded-full animate-pulse delay-700" />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <p className="text-2xl font-medium text-gray-300 leading-relaxed">
                Somos uma loja especializada em brinquedos feitos com tecnologia de impressão 3D, criada para transformar criatividade em diversão real. Nosso objetivo é oferecer produtos únicos, modernos e de alta qualidade, que encantam crianças, jovens e colecionadores.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Trabalhamos com designs inovadores, peças personalizáveis e materiais duráveis, garantindo que cada brinquedo seja especial e diferente de tudo que você já viu. Acreditamos que a tecnologia pode dar vida à imaginação, criando experiências únicas para nossos clientes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-4">
                  <Rocket size={24} />
                </div>
                <h3 className="text-white font-bold text-lg">Inovação</h3>
                <p className="text-gray-500 text-sm">Tecnologia de ponta em cada impressão.</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-4">
                  <Heart size={24} />
                </div>
                <h3 className="text-white font-bold text-lg">Paixão</h3>
                <p className="text-gray-500 text-sm">Criamos com amor e dedicação total.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative flex items-center justify-center"
          >
            <div className="aspect-square rounded-[40px] overflow-hidden border border-white/10 relative group">
              <img 
                src="https://picsum.photos/seed/3dprint/1000/1000" 
                alt="Impressão 3D em ação" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Qualidade Premium</h4>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Materiais de Alta Durabilidade</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Element */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-3xl opacity-30"
            />
          </motion.div>
        </div>

        {/* Mission Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 p-12 md:p-20 bg-zinc-900 border border-white/10 rounded-[60px] text-center space-y-8 relative overflow-hidden"
        >
          <div className="relative z-10 space-y-6">
            <h2 className="text-sm font-black text-blue-400 uppercase tracking-[0.3em]">Nossa Missão</h2>
            <p className="text-4xl md:text-5xl font-black text-white tracking-tighter max-w-4xl mx-auto leading-tight">
              "Nossa missão é levar alegria, inovação e exclusividade através de brinquedos criados com paixão e tecnologia 3D."
            </p>
          </div>
          
          {/* Decorative background for mission */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}
