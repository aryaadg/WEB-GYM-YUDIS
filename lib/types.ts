export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  condition: 'baru' | 'bekas';
  color?: string;
  transmission: 'manual' | 'otomatis';
  fuel_type: 'bensin' | 'diesel' | 'listrik';
  mileage?: number;
  description?: string;
  status: 'tersedia' | 'terjual';
  tax_pkb?: number;
  tax_bbnkb?: number;
  tax_ppn?: number;
  price_credit?: number;
  dp?: number;
  monthly_payment?: number;
  tenor?: number;
  license_plate?: string;
  created_at: string;
  updated_at: string;
}

export interface CarImage {
  id: string;
  car_id: string;
  image_url: string;
  is_primary: boolean;
  order_index: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  car_id: string;
  customer_name: string;
  customer_phone?: string;
  customer_address?: string;
  sale_price: number;
  payment_method: 'tunai' | 'kredit' | 'leasing';
  notes?: string;
  transaction_date: string;
  created_at: string;
}
