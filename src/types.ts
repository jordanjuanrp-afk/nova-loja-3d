export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'articulado' | 'personalizado' | 'miniatura' | 'educativo';
  image: string;
  images?: string[];
  videoUrl?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  material: string;
  size: string;
  colors: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}
