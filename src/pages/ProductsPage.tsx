import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProductFilters from '@/components/ProductFilters/ProductFilters';
import ProductCard from '@/components/ProductCard';
import ProductPagination from '@/components/ProductPagination/ProductPagination';
import { productCategories } from '@/mock/catalogFilters';
import { catalogProducts } from '@/mock/catalogProducts';
import { getCatalogProducts } from '@/utils/catalog';
import type { CatalogFilters } from '@/types/catalog';
import './ProductsPage.scss';

export default function ProductsPage() {
  const productsPerPage = 8;
  const productsSectionRef = useRef<HTMLElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [filters, setFilters] = useState<CatalogFilters>({
    color: '',
    material: '',
    price: '',
    size: '',
    sortOrder: 'featured',
    gridColumns: 4,
  });
  const selectedCategory = productCategories.find((category) => category.id === selectedCategoryId) ?? productCategories[0];
  const visibleProducts = getCatalogProducts(catalogProducts, filters, selectedCategoryId);
  const totalPages = Math.ceil(visibleProducts.length / productsPerPage);
  const firstProductIndex = (currentPage - 1) * productsPerPage;
  const productsOnCurrentPage = visibleProducts.slice(firstProductIndex, firstProductIndex + productsPerPage);

  useEffect(() => {
    document.title = 'Cửa hàng | VERDE';
  }, []);

  function handleCategoryChange(categoryId: string) {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
  }

  function handleFiltersChange(nextFilters: CatalogFilters) {
    if (
      nextFilters.color !== filters.color ||
      nextFilters.material !== filters.material ||
      nextFilters.price !== filters.price ||
      nextFilters.size !== filters.size ||
      nextFilters.sortOrder !== filters.sortOrder
    ) {
      setCurrentPage(1);
    }

    setFilters(nextFilters);
  }

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    setCurrentPage(page);
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="catalog-page">
      <Header />

      <main className="catalog-main">
        <nav className="catalog-breadcrumb" aria-label="Đường dẫn trang">
          <ol>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/san-pham">Cửa hàng</Link></li>
            <li aria-current="page">
              <h1>
                {selectedCategoryId === 'all' ? 'Tất cả sản phẩm tuyển chọn' : selectedCategory.name} ({visibleProducts.length} mẫu)
              </h1>
            </li>
          </ol>
        </nav>

        <div className="catalog-categories" role="group" aria-label="Danh mục sản phẩm">
          {productCategories.map((category) => (
            <button
              className="catalog-category"
              key={category.id}
              type="button"
              aria-pressed={selectedCategoryId === category.id}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}<span>({category.count})</span>
            </button>
          ))}
        </div>

        <ProductFilters filters={filters} onChange={handleFiltersChange} />

        <section className="catalog-products" ref={productsSectionRef} aria-label="Danh sách sản phẩm">
          {visibleProducts.length > 0 ? (
            <>
              <div className={`catalog-product-grid catalog-product-grid--${filters.gridColumns}-columns`}>
                {productsOnCurrentPage.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    colors={product.colors}
                    sizes={product.sizes}
                    priceValue={product.priceValue}
                  />
                ))}
              </div>
              <ProductPagination
                currentPage={currentPage}
                totalItems={visibleProducts.length}
                itemsPerPage={productsPerPage}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="catalog-products__empty" role="status">
              <h2>Không tìm thấy sản phẩm phù hợp</h2>
              <p>Bạn hãy thay đổi hoặc bỏ bớt bộ lọc để xem thêm sản phẩm.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
