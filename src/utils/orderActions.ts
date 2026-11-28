import type { CartItemInput } from '@/types/cart';
import type { CatalogProduct } from '@/types/catalog';
import type { Order } from '@/types/order';
import { cloneOrder, isOrder } from '@/utils/orders';

export function canCancelOrder(order: Pick<Order, 'status'>) {
  return order.status === 'pending';
}

export function createCancelledOrder(order: Order, reason: string, cancelledAt = new Date().toISOString()): Order {
  if (!isOrder(order)) {
    throw new Error('Thông tin đơn hàng không hợp lệ.');
  }

  if (!canCancelOrder(order)) {
    throw new Error('Chỉ có thể hủy đơn hàng đang chờ xác nhận.');
  }

  const cancellationReason = reason.trim();

  if (!cancellationReason || cancellationReason.length > 300) {
    throw new Error('Vui lòng nhập lý do hủy từ 1 đến 300 ký tự.');
  }

  const cancellationTime = Date.parse(cancelledAt);

  if (!Number.isFinite(cancellationTime) || cancellationTime < Date.parse(order.updatedAt)) {
    throw new Error('Thời gian hủy đơn không hợp lệ.');
  }

  const cancelledOrder = cloneOrder(order);
  cancelledOrder.status = 'cancelled';
  cancelledOrder.updatedAt = cancelledAt;
  cancelledOrder.cancelledAt = cancelledAt;
  cancelledOrder.cancellationReason = cancellationReason;
  cancelledOrder.statusHistory.push({
    status: 'cancelled',
    changedAt: cancelledAt,
    note: `Khách hàng hủy đơn: ${cancellationReason}`,
  });

  return cancelledOrder;
}

export function getOrderCartEntries(order: Order, products: readonly CatalogProduct[]): CartItemInput[] {
  if (!isOrder(order)) {
    throw new Error('Thông tin đơn hàng không hợp lệ.');
  }

  return order.items.map((item) => {
    const product = products.find((currentProduct) => currentProduct.id === item.productId);

    if (!product) {
      throw new Error(`Sản phẩm “${item.name}” không còn trong danh mục.`);
    }

    if (item.color && !product.colors.includes(item.color)) {
      throw new Error(`Màu đã đặt của “${item.name}” hiện không còn trong danh mục.`);
    }

    if (item.size && !product.sizes.includes(item.size)) {
      throw new Error(`Kích cỡ ${item.size} của “${item.name}” hiện không còn trong danh mục.`);
    }

    return {
      product: { id: product.id, name: product.name, image: product.image, priceValue: product.priceValue },
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    };
  });
}
