import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WHATSAPP_URL } from '../data/constants';

const anchorLinks = [
  { label: 'Suítes', href: '#suites' },
  { label: 'O Legado', href: '#legado' },
  { label: 'Localização', href: '#localizacao' },
  { label: 'Contato', href: '#contato' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-velvet-950/90 backdrop-blur-lg shadow-lg shadow-black/20'
          : 'bg-gradient-to-b from-black/60 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a
            href="#"
            className="font-playfair text-2xl font-bold text-gold-400 tracking-wide"
          >
            Dallas Motel
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {anchorLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-gold-400 transition-colors duration-300 text-sm tracking-widest uppercase"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/cardapio"
              className="text-gray-300 hover:text-gold-400 transition-colors duration-300 text-sm tracking-widest uppercase"
            >
              Cardápio
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold-400 hover:bg-gold-500 text-velvet-900 px-6 py-2.5 rounded text-sm font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-gold-400/20"
            >
              Reservar Agora
            </a>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-300 hover:text-gold-400 transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-velvet-950/98 backdrop-blur-lg border-t border-gold-400/10 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {anchorLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-gray-300 hover:text-gold-400 transition-colors text-sm tracking-widest uppercase py-3 border-b border-velvet-800/50"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/cardapio"
                onClick={() => setMobileOpen(false)}
                className="block text-gray-300 hover:text-gold-400 transition-colors text-sm tracking-widest uppercase py-3 border-b border-velvet-800/50"
              >
                Cardápio
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gold-400 hover:bg-gold-500 text-velvet-900 px-6 py-3 rounded text-sm font-semibold text-center mt-4 transition-all"
              >
                Reservar Agora
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
