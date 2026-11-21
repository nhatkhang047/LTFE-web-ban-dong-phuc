import type { Order, OrderItem, OrderStatus, OrderStatusFilter } from '@/types/order';

export const ordersStorageKey = 'verde-orders';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAmount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

function isTimestamp(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && Number.isFinite(Date.parse(value));
}

function isOrderStatus(value: unknown): value is OrderStatus {
  return value === 'pending' || value === 'processing' || value === 'shipping'
    || value === 'delivered' || value === 'cancelled';
}

function isOrderItem(value: unknown): value is OrderItem {
  if (!isRecord(value)) {
    return false;
  }

  const hasProductId = (typeof value.productId === 'string' && value.productId.trim().length > 0)
    || (typeof value.productId === 'number' && Number.isSafeInteger(value.productId));

  return typeof value.id === 'string' && value.id.trim().length > 0
    && hasProductId
    && typeof value.name === 'string'
    && typeof value.image === 'string'
    && isAmount(value.unitPrice)
    && typeof value.color === 'string'
    && typeof value.size === 'string'
    && typeof value.quantity === 'number'
    && Number.isSafeInteger(value.quantity)
    && value.quantity > 0;
}

export function getOrderTotals(items: readonly OrderItem[], shippingFee = 0, discountAmount = 0) {
  if (!isAmount(shippingFee) || !isAmount(discountAmount)) {
    throw new Error('Phí vận chuyển hoặc số tiền giảm giá không hợp lệ.');
  }

  let quantity = 0;
  let subtotal = 0;

  for (const item of items) {
    if (!isOrderItem(item)) {
      throw new Error('Sản phẩm trong đơn hàng không hợp lệ.');
    }

    quantity += item.quantity;
    subtotal += item.unitPrice * item.quantity;

    if (!Number.isSafeInteger(quantity) || !Number.isSafeInteger(subtotal)) {
      throw new Error('Số lượng hoặc số tiền đơn hàng vượt giới hạn.');
    }
  }

  const totalAmount = subtotal + shippingFee - discountAmount;

  if (!Number.isSafeInteger(subtotal + shippingFee) || !isAmount(totalAmount)) {
    throw new Error('Tổng tiền đơn hàng không hợp lệ.');
  }

  return { quantity, subtotal, shippingFee, discountAmount, totalAmount };
}

export function isOrder(value: unknown): value is Order {
  if (!isRecord(value)) {
    return false;
  }

  if (
    typeof value.id !== 'string' || !value.id.trim()
    || typeof value.code !== 'string' || !value.code.trim()
    || !isOrderStatus(value.status)
    || !isTimestamp(value.createdAt) || !isTimestamp(value.updatedAt)
    || value.currency !== 'VND'
    || !isAmount(value.subtotal) || !isAmount(value.shippingFee)
    || !isAmount(value.discountAmount) || !isAmount(value.totalAmount)
    || (value.paymentMethod !== 'cod' && value.paymentMethod !== 'bank_transfer')
    || (value.paymentStatus !== 'unpaid' && value.paymentStatus !== 'paid')
    || typeof value.note !== 'string'
    || typeof value.cancellationReason !== 'string'
  ) {
    return false;
  }

  if (
    !isRecord(value.customer)
    || typeof value.customer.name !== 'string'
    || typeof value.customer.email !== 'string'
    || !isRecord(value.recipient)
    || typeof value.recipient.name !== 'string'
    || typeof value.recipient.phone !== 'string'
    || typeof value.recipient.province !== 'string'
    || typeof value.recipient.district !== 'string'
    || typeof value.recipient.ward !== 'string'
    || typeof value.recipient.detail !== 'string'
    || typeof value.recipient.note !== 'string'
  ) {
    return false;
  }

  if (!Array.isArray(value.items) || value.items.length === 0 || !value.items.every(isOrderItem)) {
    return false;
  }

  if (new Set(value.items.map((item) => item.id)).size !== value.items.length) {
    return false;
  }

  if (!Array.isArray(value.statusHistory) || value.statusHistory.length === 0) {
    return false;
  }

  let previousTime = Date.parse(value.createdAt);

  for (const entry of value.statusHistory) {
    if (!isRecord(entry) || !isOrderStatus(entry.status) || !isTimestamp(entry.changedAt) || typeof entry.note !== 'string') {
      return false;
    }

    const changedTime = Date.parse(entry.changedAt);

    if (changedTime < previousTime || changedTime > Date.parse(value.updatedAt)) {
      return false;
    }

    previousTime = changedTime;
  }

  const firstEntry = value.statusHistory[0];
  const latestEntry = value.statusHistory[value.statusHistory.length - 1];

  if (
    firstEntry.status !== 'pending'
    || firstEntry.changedAt !== value.createdAt
    || latestEntry.status !== value.status
    || latestEntry.changedAt !== value.updatedAt
  ) {
    return false;
  }

  if (value.paymentStatus === 'paid') {
    if (!isTimestamp(value.paidAt) || Date.parse(value.paidAt) < Date.parse(value.createdAt) || Date.parse(value.paidAt) > Date.parse(value.updatedAt)) {
      return false;
    }
  } else if (value.paidAt !== null) {
    return false;
  }

  if (value.status === 'cancelled') {
    if (value.cancelledAt !== value.updatedAt || !value.cancellationReason.trim()) {
      return false;
    }
  } else if (value.cancelledAt !== null || value.cancellationReason !== '') {
    return false;
  }

  try {
    const totals = getOrderTotals(value.items, value.shippingFee, value.discountAmount);
    return totals.subtotal === value.subtotal && totals.totalAmount === value.totalAmount;
  } catch {
    return false;
  }
}

export function cloneOrder(order: Order): Order {
  return {
    ...order,
    customer: { ...order.customer },
    recipient: { ...order.recipient },
    items: order.items.map((item) => ({ ...item })),
    statusHistory: order.statusHistory.map((entry) => ({ ...entry })),
  };
}

export function parseStoredOrders(value: string | null): Order[] {
  if (value === null) {
    return [];
  }

  let parsedValue: unknown;

  try {
    parsedValue = JSON.parse(value);
  } catch {
    throw new Error('Dữ liệu đơn hàng đã lưu không hợp lệ.');
  }

  if (!Array.isArray(parsedValue) || !parsedValue.every(isOrder)) {
    throw new Error('Dữ liệu đơn hàng đã lưu không hợp lệ.');
  }

  const uniqueIds = new Set(parsedValue.map((order) => order.id));
  const uniqueCodes = new Set(parsedValue.map((order) => order.code.trim().toUpperCase()));

  if (uniqueIds.size !== parsedValue.length || uniqueCodes.size !== parsedValue.length) {
    throw new Error('Dữ liệu đơn hàng có mã bị trùng.');
  }

  return parsedValue.map(cloneOrder);
}

export function findOrderById(orders: readonly Order[], orderId: string) {
  const order = orders.find((item) => item.id === orderId.trim());
  return order ? cloneOrder(order) : undefined;
}

export function findOrderByCode(orders: readonly Order[], code: string) {
  const normalizedCode = code.trim().toUpperCase();
  const order = orders.find((item) => item.code.trim().toUpperCase() === normalizedCode);
  return order ? cloneOrder(order) : undefined;
}

export function replaceOrder(orders: readonly Order[], updatedOrder: Order): Order[] {
  if (!isOrder(updatedOrder)) {
    throw new Error('Thông tin đơn hàng cập nhật không hợp lệ.');
  }

  const currentOrder = orders.find((order) => order.id === updatedOrder.id);

  if (!currentOrder) {
    throw new Error('Không tìm thấy đơn hàng cần cập nhật.');
  }

  if (currentOrder.code !== updatedOrder.code) {
    throw new Error('Không thể thay đổi mã đơn hàng.');
  }

  return orders.map((order) => order.id === updatedOrder.id ? cloneOrder(updatedOrder) : order);
}

function normalizeOrderSearch(value: string) {
  return value.trim().toLocaleLowerCase('vi-VN').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}

export function getFilteredOrders(orders: readonly Order[], status: OrderStatusFilter, searchQuery: string): Order[] {
  const query = normalizeOrderSearch(searchQuery);

  return orders.filter((order) => {
    if (status !== 'all' && order.status !== status) {
      return false;
    }

    if (!query) {
      return true;
    }

    return normalizeOrderSearch(order.code).includes(query)
      || order.items.some((item) => normalizeOrderSearch(item.name).includes(query));
  }).sort((firstOrder, secondOrder) => Date.parse(secondOrder.createdAt) - Date.parse(firstOrder.createdAt));
}

export function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  }).format(new Date(value));
}
