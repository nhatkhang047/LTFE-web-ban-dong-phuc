import type { CatalogFilters, CatalogProduct } from '@/types/catalog';

export function getCatalogProducts(
    products: CatalogProduct[],
    filters: CatalogFilters,
    categoryId: string
) {
  const filteredProducts = products.filter((product) => {
    // Lọc danh mục
    if (categoryId !== 'all' && product.category !== categoryId) {
      return false;
    }

    // Lọc màu sắc
    if (filters.color && !product.colors.includes(filters.color)) {
      return false;
    }

    // Lọc chất liệu
    if (filters.material && product.material !== filters.material) {
      return false;
    }

    // Lọc kích cỡ
    if (filters.size && !product.sizes.includes(filters.size)) {
      return false;
    }

    // Lọc khoảng giá
    if (filters.price === 'under-200' && product.priceValue >= 200000) {
      return false;
    }

    if (
        filters.price === '200-400' &&
        (product.priceValue < 200000 || product.priceValue > 400000)
    ) {
      return false;
    }

    if (
        filters.price === '400-700' &&
        (product.priceValue < 400000 || product.priceValue > 700000)
    ) {
      return false;
    }

    if (filters.price === 'over-700' && product.priceValue <= 700000) {
      return false;
    }

    return true;
  });

  // Sắp xếp theo giá tăng dần
  if (filters.sortOrder === 'price-ascending') {
    filteredProducts.sort(
        (firstProduct, secondProduct) =>
            firstProduct.priceValue - secondProduct.priceValue
    );
  }

  // Sắp xếp theo giá giảm dần
  if (filters.sortOrder === 'price-descending') {
    filteredProducts.sort(
        (firstProduct, secondProduct) =>
            secondProduct.priceValue - firstProduct.priceValue
    );
  }

  // Sắp xếp sản phẩm mới nhất
  if (filters.sortOrder === 'newest') {
    filteredProducts.sort(
        (firstProduct, secondProduct) =>
            secondProduct.addedAt.localeCompare(firstProduct.addedAt)
    );
  }

  return filteredProducts;
}
