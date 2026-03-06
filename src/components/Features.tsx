import { motion } from 'framer-motion';
import { EyeOff, Star, Sparkles, Car } from 'lucide-react';
import SectionTitle from './SectionTitle';

const features = [
  {
    icon: EyeOff,
    title: 'Privacidade Total',
    description:
      'Entrada e garagens individuais garantem total discrição para você e seu acompanhante.',
    image: '/images/feature-privacy.jpg',
  },
  {
    icon: Star,
    title: 'Padrão Hotel Dallas',
    description:
      'O mesmo padrão de qualidade do reconhecido Hotel Dallas no centro de Pitangueiras.',
    image: '/images/feature-standard.jpg',
  },
  {
    icon: Sparkles,
    title: 'Higienização Rigorosa',
    description:
      'Processo completo de limpeza e higienização em cada suíte, garantindo segurança e conforto.',
    image: '/images/feature-hygiene.jpg',
  },
  {
    icon: Car,
    title: 'Garagem Privativa',
    description:
      'Estacionamento coberto e privativo integrado à sua suíte, com entrada independente.',
    image: '/images/feature-garage.jpg',
  },
];

export default function Features() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="Por Que Escolher o Dallas"
          subtitle="Tradição, qualidade e atenção aos detalhes em cada aspecto da sua experiência."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-velvet-800/50 border border-velvet-700/40 rounded-xl overflow-hidden hover:border-gold-400/30 hover:bg-velvet-800/80 transition-all duration-500"
            >
              {/* Card image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay so content below blends nicely */}
                <div className="absolute inset-0 bg-gradient-to-t from-velvet-800/80 via-transparent to-transparent" />

                {/* Icon badge on top of the image */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center justify-center w-12 h-12 rounded-full bg-velvet-900/80 border border-gold-400/30 backdrop-blur-sm group-hover:bg-gold-400/20 transition-colors duration-300">
                  <feature.icon className="text-gold-400" size={22} />
                </div>
              </div>

              {/* Text content */}
              <div className="p-6 text-center">
                <h3 className="font-playfair text-lg font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
