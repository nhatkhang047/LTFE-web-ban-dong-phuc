import type { OrderPaymentMethod, OrderPaymentStatus, OrderStatus, OrderStatusFilter } from '@/types/order';

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  processing: 'Đang xử lý',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

export const orderStatusFilters: { value: OrderStatusFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: orderStatusLabels.pending },
  { value: 'processing', label: orderStatusLabels.processing },
  { value: 'shipping', label: orderStatusLabels.shipping },
  { value: 'delivered', label: orderStatusLabels.delivered },
  { value: 'cancelled', label: orderStatusLabels.cancelled },
];

export const orderPaymentMethodLabels: Record<OrderPaymentMethod, string> = {
  cod: 'Thanh toán khi nhận hàng',
  bank_transfer: 'Chuyển khoản ngân hàng',
};

export const orderPaymentStatusLabels: Record<OrderPaymentStatus, string> = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
};
