export type MenuCategory = {
  id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
};

export type MenuProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string | null;
  is_available: boolean;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  menu_categories?: { name: string } | null;
};

export type SuiteRow = {
  id: string;
  name: string;
  description: string;
  amenities: string[];
  image_url: string;
  base_price: number;
  weekday_base_price: number;
  weekend_base_price: number;
  min_stay_hours: number;
  weekday_hourly_rate: number;
  weekend_hourly_rate: number;
  holiday_hourly_rate: number;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type HolidayRow = {
  id: string;
  date: string;
  name: string;
  created_by: string | null;
  created_at: string;
};
