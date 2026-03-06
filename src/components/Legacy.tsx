import { motion } from 'framer-motion';
import { HardHat, Lightbulb, HandHeart, Building2, TreePine, Flame } from 'lucide-react';
import SectionTitle from './SectionTitle';

const milestones = [
  {
    icon: HardHat,
    title: 'Raízes de Trabalho',
    text: 'Valdir Rodrigues iniciou sua jornada como servente de pedreiro. Com determinação e honestidade, transformou o trabalho braçal nos alicerces de um sonho que mudaria a história de Pitangueiras.',
  },
  {
    icon: Lightbulb,
    title: 'Visão Empreendedora',
    text: 'Sem nunca perder o foco, Valdir migrou para a revenda de caminhões, revelando um faro para negócios que poucos acreditavam possível. Cada desafio era mais uma oportunidade.',
  },
  {
    icon: HandHeart,
    title: 'Raízes na Comunidade',
    text: 'Com a abertura de uma loja popular em Pitangueiras, Valdir se tornou parte do dia a dia da cidade, conquistando a confiança e o carinho de toda a comunidade.',
  },
  {
    icon: Building2,
    title: 'O Marco: Hotel Dallas',
    text: 'O grande sonho se concretizou com a inauguração do Hotel Dallas no coração de Pitangueiras — um marco que provou que trabalho árduo e visão transformam realidades.',
  },
  {
    icon: TreePine,
    title: 'A Expansão',
    text: 'Ampliando horizontes, nasceu o Dallas Motel na zona rural, oferecendo privacidade e conforto em um refúgio discreto e acolhedor, com a mesma excelência da marca Dallas.',
  },
  {
    icon: Flame,
    title: 'Um Legado Vivo',
    text: 'Desde 2007, a família Rodrigues mantém viva a chama de excelência e dedicação que sempre marcou o nome Dallas. O legado de Valdir é mais que um negócio — é inspiração para toda uma cidade.',
  },
];

export default function Legacy() {
  return (
    <section id="legado" className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/legacy-bg.png')" }}
      />
      
      <div className="absolute inset-0 bg-velvet-950/85" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <SectionTitle
          title="O Legado Dallas"
          subtitle="Uma história de determinação, trabalho e sucesso que se tornou referência em Pitangueiras."
        />

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold-400/0 via-gold-400/30 to-gold-400/0 md:-translate-x-px" />

          <div className="space-y-10 md:space-y-16">
            {milestones.map((milestone, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="relative pl-12 md:pl-0"
                >
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-gold-400 rounded-full -translate-x-1.5 mt-6 shadow-lg shadow-gold-400/30 z-10" />

                  <div
                    className={`md:w-[calc(50%-2rem)] ${
                      isLeft ? 'md:mr-auto md:text-right' : 'md:ml-auto'
                    }`}
                  >
                    <div className="bg-velvet-800/60 border border-velvet-700/40 rounded-xl p-6 hover:border-gold-400/20 transition-colors duration-300 group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gold-400/10 group-hover:bg-gold-400/20 transition-colors duration-300 shrink-0">
                          <milestone.icon className="text-gold-400" size={18} />
                        </div>
                        <span className="text-gold-400/60 text-xs tracking-widest uppercase font-medium">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="font-playfair text-xl font-bold text-white mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {milestone.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
