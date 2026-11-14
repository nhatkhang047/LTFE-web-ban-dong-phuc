import type { FavoriteProduct } from '@/types/favorites';

export const favoritesStorageKey = 'verde-favorite-products';

function isFavoriteProduct(value: unknown): value is FavoriteProduct {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const product = value as Record<string, unknown>;
  const hasValidId = (typeof product.id === 'string' && product.id.length > 0)
    || (typeof product.id === 'number' && Number.isFinite(product.id));
  const hasValidPrice = typeof product.price === 'string'
    || (typeof product.price === 'number' && Number.isFinite(product.price));
  const hasValidColors = product.colors === undefined
    || (Array.isArray(product.colors) && product.colors.every((color) => typeof color === 'string'));

  return hasValidId
    && typeof product.image === 'string'
    && typeof product.name === 'string'
    && hasValidPrice
    && hasValidColors;
}

export function parseStoredFavorites(value: string | null): FavoriteProduct[] {
  if (!value) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    const validProducts = parsedValue.filter(isFavoriteProduct);

    return validProducts.filter((product, index) => (
      validProducts.findIndex((savedProduct) => savedProduct.id === product.id) === index
    ));
  } catch {
    return [];
  }
}

export function toggleFavoriteProduct(favorites: FavoriteProduct[], product: FavoriteProduct): FavoriteProduct[] {
  const isAlreadyFavorite = favorites.some((favorite) => favorite.id === product.id);

  if (isAlreadyFavorite) {
    return favorites.filter((favorite) => favorite.id !== product.id);
  }

  return [product, ...favorites];
}
