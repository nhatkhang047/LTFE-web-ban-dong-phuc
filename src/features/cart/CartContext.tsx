import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CartItem, CartProduct } from '@/types/cart';
import {
  addCartItem,
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
  const totals = getCartTotals(items);

  useEffect(() => {
    try {
      window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
    } catch {
      return;
    }
  }, [items]);

  function addItem(product: CartProduct, color: string, size: string) {
    setItems((previousItems) => addCartItem(previousItems, product, color, size));
  }

  function updateQuantity(itemId: string, quantity: number) {
    setItems((previousItems) => updateCartItemQuantity(previousItems, itemId, quantity));
  }

  function removeItem(itemId: string) {
    setItems((previousItems) => removeCartItem(previousItems, itemId));
  }

  return (
    <CartContext.Provider value={{
      items,
      totalQuantity: totals.quantity,
      totalPrice: totals.price,
      addItem,
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
