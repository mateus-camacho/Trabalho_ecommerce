export interface Cart {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  quantity: number;
  image_url: string;
  brand: string;
}

export interface CartItem {
  id: string;
  quantity: number;
}
