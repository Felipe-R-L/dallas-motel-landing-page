import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '../data/constants';

export default function WhatsAppFAB() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 200 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-400 rounded-full shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-110"
        aria-label="Fale conosco pelo WhatsApp"
      >
        <MessageCircle className="text-white" size={24} />

        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />

        <span className="absolute right-full mr-3 bg-velvet-800 text-white text-xs py-2 px-3 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
          Fale Conosco
        </span>
      </a>
    </motion.div>
  );
}
