import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { mockOrders } from '@/mock/orders';
import type { Order } from '@/types/order';
import { createCancelledOrder } from '@/utils/orderActions';
import {
  cloneOrder,
  findOrderByCode,
  findOrderById,
  isOrder,
  ordersStorageKey,
  parseStoredOrders,
  replaceOrder,
} from '@/utils/orders';

type OrdersContextValue = {
  orders: readonly Order[];
  storageError: string | null;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderByCode: (code: string) => Order | undefined;
  updateOrder: (order: Order) => void;
  cancelOrder: (orderId: string, reason: string) => void;
};

type InitialOrdersState = {
  orders: Order[];
  canPersist: boolean;
  error: string | null;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

function loadOrders(): InitialOrdersState {
  try {
    const storedOrders = window.localStorage.getItem(ordersStorageKey);

    return {
      orders: storedOrders === null ? mockOrders.map(cloneOrder) : parseStoredOrders(storedOrders),
      canPersist: true,
      error: null,
    };
  } catch {
    return {
      orders: [],
      canPersist: false,
      error: 'Không thể đọc đơn hàng đã lưu. Dữ liệu hiện tại được giữ nguyên.',
    };
  }
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [initialState] = useState(loadOrders);
  const [orders, setOrders] = useState<Order[]>(initialState.orders);
  const ordersRef = useRef(orders);
  const [storageError, setStorageError] = useState<string | null>(initialState.error);

  useEffect(() => {
    if (!initialState.canPersist) {
      return;
    }

    try {
      window.localStorage.setItem(ordersStorageKey, JSON.stringify(orders));
      setStorageError(null);
    } catch {
      setStorageError('Không thể lưu thay đổi đơn hàng. Vui lòng thử lại.');
    }
  }, [orders, initialState.canPersist]);

  function getOrderById(orderId: string) {
    return findOrderById(ordersRef.current, orderId);
  }

  function getOrderByCode(code: string) {
    return findOrderByCode(ordersRef.current, code);
  }

  function updateOrder(updatedOrder: Order) {
    if (!initialState.canPersist) {
      throw new Error('Chưa thể cập nhật khi dữ liệu đơn hàng chưa đọc được.');
    }

    if (!isOrder(updatedOrder)) {
      throw new Error('Thông tin đơn hàng cập nhật không hợp lệ.');
    }

    const currentOrder = getOrderById(updatedOrder.id);

    if (!currentOrder || currentOrder.code !== updatedOrder.code) {
      throw new Error('Không tìm thấy đơn hàng có mã tương ứng.');
    }

    const nextOrders = replaceOrder(ordersRef.current, cloneOrder(updatedOrder));
    ordersRef.current = nextOrders;
    setOrders(nextOrders);
  }

  function cancelOrder(orderId: string, reason: string) {
    if (!initialState.canPersist) {
      throw new Error('Chưa thể cập nhật khi dữ liệu đơn hàng chưa đọc được.');
    }

    const currentOrder = getOrderById(orderId);

    if (!currentOrder) {
      throw new Error('Không tìm thấy đơn hàng cần hủy.');
    }

    const cancelledOrder = createCancelledOrder(currentOrder, reason);
    const nextOrders = replaceOrder(ordersRef.current, cancelledOrder);

    try {
      window.localStorage.setItem(ordersStorageKey, JSON.stringify(nextOrders));
    } catch {
      const message = 'Không thể lưu thay đổi đơn hàng. Vui lòng thử lại.';
      setStorageError(message);
      throw new Error(message);
    }

    ordersRef.current = nextOrders;
    setOrders(nextOrders);
    setStorageError(null);
  }

  return (
    <OrdersContext.Provider value={{ orders, storageError, getOrderById, getOrderByCode, updateOrder, cancelOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider');
  }

  return context;
}
