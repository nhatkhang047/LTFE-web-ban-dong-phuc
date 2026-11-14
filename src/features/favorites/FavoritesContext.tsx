import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { FavoriteProduct } from '@/types/favorites';
import { favoritesStorageKey, parseStoredFavorites, toggleFavoriteProduct } from '@/utils/favorites';

type FavoritesContextValue = {
  favorites: FavoriteProduct[];
  isFavorite: (productId: FavoriteProduct['id']) => boolean;
  toggleFavorite: (product: FavoriteProduct) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function loadFavorites(): FavoriteProduct[] {
  try {
    return parseStoredFavorites(window.localStorage.getItem(favoritesStorageKey));
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>(loadFavorites);

  useEffect(() => {
    try {
      window.localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites));
    } catch {
      return;
    }
  }, [favorites]);

  function isFavorite(productId: FavoriteProduct['id']) {
    return favorites.some((favorite) => favorite.id === productId);
  }

  function toggleFavorite(product: FavoriteProduct) {
    setFavorites((previousFavorites) => toggleFavoriteProduct(previousFavorites, product));
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }

  return context;
}
