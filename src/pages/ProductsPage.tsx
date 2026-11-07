import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProductFilters from '@/components/ProductFilters/ProductFilters';
import { productCategories } from '@/mock/catalogFilters';
import './ProductsPage.scss';

export default function ProductsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const selectedCategory = productCategories.find((category) => category.id === selectedCategoryId) ?? productCategories[0];

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
                {selectedCategoryId === 'all' ? 'Tất cả sản phẩm tuyển chọn' : selectedCategory.name} ({selectedCategory.count} mẫu)
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

        <ProductFilters />
      </main>

      <Footer />
    </div>
  );
}
