import type { CartItem, CartProduct } from '@/types/cart';

export const cartStorageKey = 'verde-shopping-cart';

export function formatCartPrice(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

export function getProductPrice(price: string | number, priceValue?: number): number | null {
  if (priceValue !== undefined) {
    return Number.isSafeInteger(priceValue) && priceValue >= 0 ? priceValue : null;
  }

  if (typeof price === 'number') {
    return Number.isSafeInteger(price) && price >= 0 ? price : null;
  }

  const digits = price.trim().replace(/(?:₫|đ|vnd)/gi, '').replace(/[.,\s]/g, '');

  if (!/^[0-9]+$/.test(digits)) {
    return null;
  }

  const value = Number(digits);
  return Number.isSafeInteger(value) && value >= 0 ? value : null;
}

function getCartItemId(productId: CartProduct['id'], color: string, size: string) {
  return JSON.stringify([typeof productId, productId, color, size]);
}

export function addCartItem(items: CartItem[], product: CartProduct, color: string, size: string): CartItem[] {
  if (!Number.isSafeInteger(product.priceValue) || product.priceValue < 0) {
    return items;
  }

  const itemId = getCartItemId(product.id, color, size);
  const existingItem = items.find((item) => item.id === itemId);

  if (existingItem) {
    return updateCartItemQuantity(items, itemId, existingItem.quantity + 1);
  }

  return [...items, {
    id: itemId,
    productId: product.id,
    image: product.image,
    name: product.name,
    unitPrice: product.priceValue,
    color,
    size,
    quantity: 1,
  }];
}

export function updateCartItemQuantity(items: CartItem[], itemId: string, quantity: number): CartItem[] {
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    return items;
  }

  return items.map((item) => {
    if (item.id !== itemId || !Number.isSafeInteger(item.unitPrice * quantity)) {
      return item;
    }

    return { ...item, quantity };
  });
}

export function removeCartItem(items: CartItem[], itemId: string): CartItem[] {
  return items.filter((item) => item.id !== itemId);
}

export function getCartTotals(items: CartItem[]) {
  return items.reduce((totals, item) => ({
    quantity: totals.quantity + item.quantity,
    price: totals.price + item.unitPrice * item.quantity,
  }), { quantity: 0, price: 0 });
}

function isStoredCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;
  const hasValidProductId = (typeof item.productId === 'string' && item.productId.length > 0)
    || (typeof item.productId === 'number' && Number.isFinite(item.productId));

  return hasValidProductId
    && typeof item.id === 'string'
    && typeof item.image === 'string'
    && typeof item.name === 'string'
    && typeof item.unitPrice === 'number'
    && Number.isSafeInteger(item.unitPrice)
    && item.unitPrice >= 0
    && typeof item.color === 'string'
    && typeof item.size === 'string'
    && typeof item.quantity === 'number'
    && Number.isSafeInteger(item.quantity)
    && item.quantity > 0
    && Number.isSafeInteger(item.unitPrice * item.quantity);
}

export function parseStoredCart(value: string | null): CartItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    const items: CartItem[] = [];

    for (const storedItem of parsedValue) {
      if (!isStoredCartItem(storedItem)) {
        continue;
      }

      const item = {
        ...storedItem,
        id: getCartItemId(storedItem.productId, storedItem.color, storedItem.size),
      };
      const existingItem = items.find((savedItem) => savedItem.id === item.id);

      if (!existingItem) {
        items.push(item);
      }
    }

    return items;
  } catch {
    return [];
  }
}
