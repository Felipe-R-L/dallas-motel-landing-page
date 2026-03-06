import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed, ArrowRight } from 'lucide-react';

export default function MenuCTA() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-2xl border border-gold-400/20 px-8 py-14 sm:px-16 text-center"
        >
          <img
            src="/images/menu-cta-bg.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-velvet-950/90 via-velvet-900/80 to-velvet-950/90" />

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-400/10 border border-gold-400/20 mb-6">
              <UtensilsCrossed className="text-gold-400" size={24} />
            </div>

            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-4">
              Cardápio de Room Service
            </h2>
            <p className="text-gray-400 text-base leading-relaxed max-w-xl mx-auto mb-8">
              Petiscos, bebidas e muito mais disponíveis direto na sua suíte.
              Consulte nosso cardápio digital e peça sem sair do quarto.
            </p>

            <Link
              to="/cardapio"
              className="group inline-flex items-center gap-2.5 bg-gold-400 hover:bg-gold-300 text-velvet-900 font-semibold px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg shadow-gold-400/20 hover:shadow-gold-400/40 hover:gap-4"
            >
              Ver Cardápio
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
