import { Link } from 'react-router-dom';
import { WHATSAPP_URL } from '../data/constants';

const navLinks = [
  { label: 'Suítes', href: '#suites' },
  { label: 'O Legado', href: '#legado' },
  { label: 'Localização', href: '#localizacao' },
  { label: 'Contato', href: '#contato' },
];

export default function Footer() {
  return (
    <footer className="bg-velvet-950 border-t border-velvet-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div>
            <a
              href="#"
              className="font-playfair text-2xl font-bold text-gold-400 tracking-wide"
            >
              Dallas Motel
            </a>
            <p className="text-gray-500 text-sm mt-4 leading-relaxed max-w-xs">
              Privacidade, conforto e tradição na zona rural de Pitangueiras.
              Uma história de sucesso a serviço dos seus melhores momentos.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-5">
              Navegação
            </h4>
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-gray-500 hover:text-gold-400 text-sm transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/cardapio"
                className="block text-gray-500 hover:text-gold-400 text-sm transition-colors duration-300"
              >
                Cardápio Digital
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-5">
              Contato
            </h4>
            <div className="space-y-3 text-gray-500 text-sm">
              <p>Estrada Municipal Pitangueiras-Viradouro, km 3,5</p>
              <p>Pitangueiras, SP</p>
              <p>(16) 99102-3129</p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-gold-400 hover:text-gold-300 transition-colors mt-2"
              >
                Reservar pelo WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-velvet-800/50 mt-12 pt-8 flex items-center justify-between">
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} Dallas Motel. Todos os direitos
            reservados.
          </p>
          <Link
            to="/admin"
            className="text-gray-700 hover:text-gray-500 text-xs transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
