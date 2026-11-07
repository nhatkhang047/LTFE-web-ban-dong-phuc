import type { CatalogFilters, CatalogProduct } from '@/types/catalog';

export function getCatalogProducts(products: CatalogProduct[], filters: CatalogFilters, categoryId: string) {
  const filteredProducts = products.filter((product) => {
    if (categoryId !== 'all' && product.category !== categoryId) {
      return false;
    }

    if (filters.color && !product.colors.some((color) => color.name === filters.color)) {
      return false;
    }

    if (filters.material && product.material !== filters.material) {
      return false;
    }

    if (filters.size && !product.sizes.includes(filters.size)) {
      return false;
    }

    if (filters.price === 'under-50' && product.price >= 50) {
      return false;
    }

    if (filters.price === '50-250' && (product.price < 50 || product.price > 250)) {
      return false;
    }

    if (filters.price === '250-500' && (product.price <= 250 || product.price > 500)) {
      return false;
    }

    if (filters.price === 'over-500' && product.price <= 500) {
      return false;
    }

    return true;
  });

  if (filters.sortOrder === 'price-ascending') {
    filteredProducts.sort((firstProduct, secondProduct) => firstProduct.price - secondProduct.price);
  }

  if (filters.sortOrder === 'price-descending') {
    filteredProducts.sort((firstProduct, secondProduct) => secondProduct.price - firstProduct.price);
  }

  if (filters.sortOrder === 'newest') {
    filteredProducts.sort((firstProduct, secondProduct) => secondProduct.addedAt.localeCompare(firstProduct.addedAt));
  }

  return filteredProducts;
}
