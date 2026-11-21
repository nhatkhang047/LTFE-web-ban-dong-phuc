export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled';

export type OrderPaymentMethod = 'cod' | 'bank_transfer';

export type OrderPaymentStatus = 'unpaid' | 'paid';

export type OrderCustomer = {
  name: string;
  email: string;
};

export type OrderRecipient = {
  name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detail: string;
  note: string;
};

export type OrderItem = {
  id: string;
  productId: string | number;
  name: string;
  image: string;
  unitPrice: number;
  color: string;
  size: string;
  quantity: number;
};

export type OrderStatusHistoryEntry = {
  status: OrderStatus;
  changedAt: string;
  note: string;
};

export type Order = {
  id: string;
  code: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  customer: OrderCustomer;
  recipient: OrderRecipient;
  items: OrderItem[];
  currency: 'VND';
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: OrderPaymentMethod;
  paymentStatus: OrderPaymentStatus;
  paidAt: string | null;
  statusHistory: OrderStatusHistoryEntry[];
  note: string;
  cancelledAt: string | null;
  cancellationReason: string;
};
