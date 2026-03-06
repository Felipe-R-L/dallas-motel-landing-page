import { supabase } from './supabase';

export type RateMode = 'weekday' | 'weekend' | 'holiday';

export async function detectRateMode(): Promise<RateMode> {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  const { data } = await supabase
    .from('holidays')
    .select('id')
    .eq('date', dateStr)
    .maybeSingle();

  if (data) return 'holiday';

  const dow = today.getDay();
  if (dow === 0 || dow === 5 || dow === 6) return 'weekend';

  return 'weekday';
}

export function getBasePrice(
  suite: { weekday_base_price: number; weekend_base_price: number },
  mode: RateMode
): number {
  if (mode === 'weekday') return Number(suite.weekday_base_price);
  return Number(suite.weekend_base_price);
}
