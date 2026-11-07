import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProductFilters from '@/components/ProductFilters/ProductFilters';
import ProductCard from '@/components/ProductCard';
import { productCategories } from '@/mock/catalogFilters';
import { catalogProducts } from '@/mock/catalogProducts';
import { getCatalogProducts } from '@/utils/catalog';
import type { CatalogFilters } from '@/types/catalog';
import './ProductsPage.scss';

export default function ProductsPage() {
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

  useEffect(() => {
    document.title = 'Cửa hàng | VERDE';
  }, []);

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
              onClick={() => setSelectedCategoryId(category.id)}
            >
              {category.name}<span>({category.count})</span>
            </button>
          ))}
        </div>

        <ProductFilters filters={filters} onChange={setFilters} />

        <section className="catalog-products" aria-label="Danh sách sản phẩm">
          {visibleProducts.length > 0 ? (
            <>
              <div className={`catalog-product-grid catalog-product-grid--${filters.gridColumns}-columns`}>
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    image={product.image}
                    name={product.name}
                    price={`$${product.price}`}
                    colors={product.colors.map((color) => color.value)}
                  />
                ))}
              </div>
              <p className="catalog-products__count" role="status">Hiển thị {visibleProducts.length} sản phẩm</p>
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
