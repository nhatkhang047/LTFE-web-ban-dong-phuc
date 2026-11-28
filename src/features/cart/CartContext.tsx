import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { CartItem, CartItemInput, CartProduct } from '@/types/cart';
import {
  addCartItem,
  addCartItems,
  cartStorageKey,
  getCartTotals,
  parseStoredCart,
  removeCartItem,
  updateCartItemQuantity,
} from '@/utils/cart';

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  addItem: (product: CartProduct, color: string, size: string) => void;
  addItems: (entries: readonly CartItemInput[]) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  try {
    return parseStoredCart(window.localStorage.getItem(cartStorageKey));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const itemsRef = useRef(items);
  const totals = getCartTotals(items);

  useEffect(() => {
    try {
      window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
    } catch {
      return;
    }
  }, [items]);

  function commitItems(nextItems: CartItem[]) {
    itemsRef.current = nextItems;
    setItems(nextItems);
  }

  function addItem(product: CartProduct, color: string, size: string) {
    commitItems(addCartItem(itemsRef.current, product, color, size));
  }

  function updateQuantity(itemId: string, quantity: number) {
    commitItems(updateCartItemQuantity(itemsRef.current, itemId, quantity));
  }

  function addItems(entries: readonly CartItemInput[]) {
    const nextItems = addCartItems(itemsRef.current, entries);

    try {
      window.localStorage.setItem(cartStorageKey, JSON.stringify(nextItems));
    } catch {
      throw new Error('Không thể lưu giỏ hàng. Vui lòng thử lại.');
    }

    commitItems(nextItems);
  }

  function removeItem(itemId: string) {
    commitItems(removeCartItem(itemsRef.current, itemId));
  }

  return (
    <CartContext.Provider value={{
      items,
      totalQuantity: totals.quantity,
      totalPrice: totals.price,
      addItem,
      addItems,
      updateQuantity,
      removeItem,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
}
