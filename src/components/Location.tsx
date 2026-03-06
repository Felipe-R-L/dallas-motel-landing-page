import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation, MessageCircle } from 'lucide-react';
import { WHATSAPP_URL, MAPS_URL } from '../data/constants';
import SectionTitle from './SectionTitle';

const MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3712.5!2d-48.22!3d-20.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zRGFsbGFzIE1vdGVs!5e0!3m2!1spt-BR!2sbr&q=Dallas+Motel+Estrada+Municipal+Pitangueiras+Viradouro';

const MAPS_SEARCH_EMBED_URL =
  'https://www.google.com/maps?q=Dallas+Motel+Estrada+Municipal+Pitangueiras+Viradouro&output=embed';

export default function Location() {
  const [mapError, setMapError] = useState(false);

  return (
    <section
      id="localizacao"
      className="py-24 sm:py-32 px-4 sm:px-6 bg-velvet-950/50"
    >
      <div className="max-w-6xl mx-auto" id="contato">
        <SectionTitle
          title={"Localiza\u00E7\u00E3o e Contato"}
          subtitle={"Venha nos conhecer. Estamos na zona rural de Pitangueiras, com f\u00E1cil acesso pela estrada municipal."}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-velvet-800/60 border border-velvet-700/40 rounded-xl overflow-hidden min-h-[320px] relative"
          >
            {!mapError ? (
              <iframe
                src={MAPS_SEARCH_EMBED_URL}
                className="w-full h-full min-h-[320px] border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={"Localiza\u00E7\u00E3o Dallas Motel"}
                onError={() => setMapError(true)}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center relative z-10 p-8">
                  <div className="w-16 h-16 rounded-full bg-gold-400/10 flex items-center justify-center mx-auto mb-5">
                    <MapPin className="text-gold-400" size={28} />
                  </div>
                  <p className="text-white font-playfair text-lg font-semibold mb-1">
                    Zona Rural
                  </p>
                  <p className="text-gray-400 text-sm mb-6">Pitangueiras, SP</p>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gold-400 text-sm hover:text-gold-300 transition-colors border border-gold-400/20 hover:border-gold-400/40 px-5 py-2.5 rounded-lg"
                  >
                    <Navigation size={14} />
                    Abrir no Google Maps
                  </a>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <div className="bg-velvet-800/60 border border-velvet-700/40 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-gold-400" size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 text-sm">
                    {`Endere\u00E7o`}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Estrada Municipal Pitangueiras-Viradouro, km 3,5
                    <br />
                    Pitangueiras, SP
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-velvet-800/60 border border-velvet-700/40 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-gold-400" size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 text-sm">
                    WhatsApp
                  </h3>
                  <p className="text-gray-400 text-sm">(16) 99102-3129</p>
                </div>
              </div>
            </div>

            <div className="bg-velvet-800/60 border border-velvet-700/40 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="text-gold-400" size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 text-sm">
                    Funcionamento
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Todos os dias, 24 horas
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-velvet-800/80 hover:bg-velvet-700 border border-velvet-700/50 text-white py-3.5 rounded-lg text-sm font-medium transition-all duration-300"
              >
                <Navigation size={16} />
                Como Chegar
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-lg text-sm font-medium transition-all duration-300"
              >
                <MessageCircle size={16} />
                Fale Conosco
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
