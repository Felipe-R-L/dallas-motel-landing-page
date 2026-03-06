import { motion } from 'framer-motion';
import { ImageOff } from 'lucide-react';
import type { MenuProduct } from '../../types/database';

interface ProductCardProps {
  product: MenuProduct;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const formatPrice = (price: number) =>
    price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-velvet-800/60 rounded-xl border border-velvet-700/40 overflow-hidden hover:border-gold-400/30 transition-all duration-300"
    >
      <div className="relative h-40 bg-velvet-900/50">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff size={32} className="text-velvet-700" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white text-sm truncate">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                {product.description}
              </p>
            )}
            {product.menu_categories?.name && (
              <span className="inline-block mt-2 text-[10px] text-gold-400/70 bg-gold-400/10 px-2 py-0.5 rounded-full">
                {product.menu_categories.name}
              </span>
            )}
          </div>
          <span className="flex-shrink-0 font-playfair font-bold text-gold-400 text-lg">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
