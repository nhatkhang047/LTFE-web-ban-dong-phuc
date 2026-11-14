export type CartProduct = {
  id: string | number;
  image: string;
  name: string;
  priceValue: number;
};

export type CartItem = {
  id: string;
  productId: string | number;
  image: string;
  name: string;
  unitPrice: number;
  color: string;
  size: string;
  quantity: number;
};
