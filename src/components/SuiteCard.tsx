import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Minus, Plus, Clock } from 'lucide-react';
import type { SuiteRow } from '../types/database';
import type { RateMode } from '../lib/pricing';
import { getBasePrice } from '../lib/pricing';
import { buildBookingUrl } from '../data/constants';

interface SuiteCardProps {
  suite: SuiteRow;
  rateMode: RateMode;
  index: number;
}

const rateKey: Record<RateMode, keyof Pick<SuiteRow, 'weekday_hourly_rate' | 'weekend_hourly_rate' | 'holiday_hourly_rate'>> = {
  weekday: 'weekday_hourly_rate',
  weekend: 'weekend_hourly_rate',
  holiday: 'holiday_hourly_rate',
};

export default function SuiteCard({ suite, rateMode, index }: SuiteCardProps) {
  const minHours = suite.min_stay_hours;
  const [hours, setHours] = useState(minHours);
  const basePrice = getBasePrice(suite, rateMode);
  const additionalRate = Number(suite[rateKey[rateMode]]);
  const extraHours = Math.max(0, hours - minHours);
  const total = basePrice + extraHours * additionalRate;
  const bookingUrl = buildBookingUrl(suite.name, hours);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative bg-velvet-800/80 rounded-xl overflow-hidden border transition-all duration-500 hover:shadow-2xl hover:shadow-gold-400/5 ${
        suite.is_featured
          ? 'border-gold-400/30 hover:border-gold-400/60'
          : 'border-velvet-700/50 hover:border-gold-400/30'
      }`}
    >
      {suite.is_featured && (
        <div className="absolute top-4 right-4 bg-gold-400 text-velvet-900 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full z-10">
          Popular
        </div>
      )}

      <div className="relative h-48 overflow-hidden">
        {suite.image_url ? (
          <img
            src={suite.image_url}
            alt={suite.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-velvet-900/60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-velvet-900 via-velvet-900/50 to-transparent" />
        <h3 className="absolute bottom-4 left-6 right-6 font-playfair text-xl font-bold text-white drop-shadow-lg">
          {suite.name}
        </h3>
      </div>

      <div className="p-6">
        {suite.description && (
          <p className="text-gray-400 text-sm mb-5 leading-relaxed">
            {suite.description}
          </p>
        )}

        {suite.amenities.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
            {suite.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2">
                <Check size={14} className="text-gold-400 flex-shrink-0" />
                <span className="text-gray-300 text-xs">{amenity}</span>
              </div>
            ))}
          </div>
        )}

        <div className="bg-velvet-900/60 rounded-lg p-4 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Clock size={14} />
              <span>{`Dura\u00E7\u00E3o`}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHours((h) => Math.max(minHours, h - 1))}
                disabled={hours <= minHours}
                className="w-8 h-8 rounded-full bg-velvet-700/80 text-gray-300 flex items-center justify-center hover:bg-velvet-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="text-white font-semibold text-lg tabular-nums min-w-[3.5rem] text-center">
                {hours}h
              </span>
              <button
                onClick={() => setHours((h) => Math.min(12, h + 1))}
                disabled={hours >= 12}
                className="w-8 h-8 rounded-full bg-velvet-700/80 text-gray-300 flex items-center justify-center hover:bg-velvet-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-end justify-between pt-3 border-t border-velvet-700/50">
            <span className="text-gray-500 text-xs">
              +R$ {additionalRate.toFixed(0)},00/hora extra
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={`${total}-${rateMode}`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="font-playfair text-2xl font-bold text-gold-400"
              >
                R$ {total.toFixed(2).replace('.', ',')}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-gold-400/10 hover:bg-gold-400 text-gold-400 hover:text-velvet-900 py-3 rounded-lg font-semibold text-sm tracking-wide transition-all duration-300"
        >
          Reservar
        </a>
      </div>
    </motion.div>
  );
}
