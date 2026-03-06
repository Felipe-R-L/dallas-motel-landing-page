import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-bg2.jpg"
      >
        <source src="/images/hero-video.mp4" type="video/mp4" />
        <img
          src="/images/hero-bg2.jpg"
          alt=""
          className="absolute inset-0 w-full h-full mb-4 object-cover"
        />
      </video>
      <div className="absolute inset-0 bg-velvet-950/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-velvet-950/60 via-transparent to-velvet-950/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08),transparent_60%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-gold-400/60" />
            <span className="text-gold-400/80 text-xs tracking-[0.4em] uppercase font-medium">
              Pitangueiras, SP
            </span>
            <div className="w-12 h-px bg-gold-400/60" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
        >
          Privacidade, Conforto e{' '}
          <br className="hidden sm:block" />
          uma{' '}
          <span className="text-gold-400 italic">História de Sucesso</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          O refúgio perfeito para seus momentos especiais.
          <br className="hidden sm:block" />
          Tradição e discrição na Zona Rural de Pitangueiras.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a
            href="#suites"
            className="inline-block bg-gold-400 hover:bg-gold-500 text-velvet-900 px-10 py-4 rounded font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-gold-400/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            Ver Suítes
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.a
          href="#suites"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="block"
        >
          <ChevronDown className="text-gold-400/50" size={28} />
        </motion.a>
      </motion.div>
    </section>
  );
}
