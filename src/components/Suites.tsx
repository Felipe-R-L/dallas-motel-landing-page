import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import type { SuiteRow } from '../types/database';
import type { RateMode } from '../lib/pricing';
import { detectRateMode } from '../lib/pricing';
import SuiteCard from './SuiteCard';
import SectionTitle from './SectionTitle';

const modes: { key: RateMode; label: string }[] = [
  { key: 'weekday', label: 'Segunda a Sexta' },
  { key: 'weekend', label: 'Fim de Semana' },
  { key: 'holiday', label: 'Feriados' },
];

export default function Suites() {
  const [rateMode, setRateMode] = useState<RateMode>('weekday');
  const [suites, setSuites] = useState<SuiteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [detected, result] = await Promise.all([
        detectRateMode(),
        supabase
          .from('suites')
          .select('*')
          .eq('is_active', true)
          .order('sort_order'),
      ]);
      setRateMode(detected);
      if (result.error) {
        setError(true);
      } else if (result.data) {
        setSuites(result.data);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <section id="suites" className="py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title={"Nossas Su\u00EDtes"}
          subtitle={"Escolha o ambiente perfeito para o seu momento. Conforto, privacidade e sofistica\u00E7\u00E3o em cada detalhe."}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-velvet-800/80 rounded-lg p-1 border border-velvet-700/50">
            {modes.map((m) => (
              <button
                key={m.key}
                onClick={() => setRateMode(m.key)}
                className={`px-4 sm:px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${
                  rateMode === m.key
                    ? 'bg-gold-400 text-velvet-900 shadow-lg shadow-gold-400/20'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-center text-gray-500 py-16">
            {`N\u00E3o foi poss\u00EDvel carregar as su\u00EDtes. Tente novamente mais tarde.`}
          </p>
        ) : suites.length === 0 ? (
          <p className="text-center text-gray-500 py-16">
            {`Nenhuma su\u00EDte dispon\u00EDvel no momento.`}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suites.map((suite, index) => (
              <SuiteCard
                key={suite.id}
                suite={suite}
                rateMode={rateMode}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
