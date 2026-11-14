import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProductCard from '@/components/ProductCard';
import { useFavorites } from '@/features/favorites/FavoritesContext';
import './ProductsPage.scss';
import './FavoritesPage.scss';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  useEffect(() => {
    document.title = 'Sản phẩm yêu thích | VERDE';
  }, []);

  return (
    <div className="catalog-page favorites-page">
      <Header />

      <main className="catalog-main">
        <nav className="catalog-breadcrumb" aria-label="Đường dẫn trang">
          <ol>
            <li><Link to="/">Trang chủ</Link></li>
            <li aria-current="page">Sản phẩm yêu thích</li>
          </ol>
        </nav>

        <div className="favorites-heading">
          <div>
            <h1>Sản phẩm yêu thích <span>({favorites.length})</span></h1>
            <p>Lưu lại những sản phẩm bạn muốn xem sau.</p>
          </div>
          <Link className="favorites-continue" to="/san-pham">
            Tiếp tục xem sản phẩm <span aria-hidden="true">→</span>
          </Link>
        </div>

        <section className="favorites-products" aria-label="Danh sách sản phẩm yêu thích">
          {favorites.length > 0 ? (
            <div className="catalog-product-grid">
              {favorites.map((product) => (
                <ProductCard
                  key={`${typeof product.id}-${product.id}`}
                  id={product.id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  colors={product.colors}
                />
              ))}
            </div>
          ) : (
            <div className="favorites-empty" role="status">
              <span className="favorites-empty__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20.5 5.5a5 5 0 0 0-7.1 0L12 6.9l-1.4-1.4a5 5 0 0 0-7.1 7.1L12 21l8.5-8.4a5 5 0 0 0 0-7.1Z" />
                </svg>
              </span>
              <h2>Danh sách yêu thích đang trống</h2>
              <p>Nhấn vào biểu tượng trái tim trên sản phẩm để lưu vào đây.</p>
              <Link className="favorites-empty__button" to="/san-pham">Khám phá sản phẩm</Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
