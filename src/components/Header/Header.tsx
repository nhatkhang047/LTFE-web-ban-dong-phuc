import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '@/features/favorites/FavoritesContext';
import { useCart } from '@/features/cart/CartContext';
import { formatCartPrice } from '@/utils/cart';
import { useAuth } from '@/features/auth/AuthContext';
import { catalogProducts } from '@/mock/catalogProducts';
import './Header.css';

function normalizeSearchText(value: string) {
  return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim();
}

export default function Header() {
  const { favorites } = useFavorites();
  const { totalQuantity, totalPrice } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const normalizedQuery = normalizeSearchText(searchQuery);

  const searchSuggestions = normalizedQuery
      ? catalogProducts
          .filter((product) => {
            const searchableText = normalizeSearchText(
                `${product.name} ${product.category} ${product.material}`
            );

            return searchableText.includes(normalizedQuery);
          })
          .slice(0, 5)
      : [];

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const keyword = searchQuery.trim();

    if (!keyword) {
      return;
    }

    setIsSuggestionsOpen(false);
    setSearchQuery('');
    navigate(`/tim-kiem?q=${encodeURIComponent(keyword)}`);
  }

  function handleSuggestionClick(productId: number) {
    setIsSuggestionsOpen(false);
    setSearchQuery('');
    navigate(`/san-pham/${productId}`);
  }

  return (
    <header className="header">
      <Link to="/" className="header-logo" aria-label="VERDE - về trang chủ">
        VERDE<span>.</span>
      </Link>

      <nav className="header-nav" aria-label="Điều hướng chính">
        <a href="#">Mẫu mới</a>
        <a href="#">Bộ sưu tập</a>
        <Link to="/san-pham" className="header-nav__link--active">Sản phẩm</Link>
        <a href="#">Phụ kiện</a>
        <a href="#">Nhật ký</a>
        <a href="#">Ưu đãi</a>
      </nav>

      <div className="header-utilities">
        <form className="header-search" role="search" onSubmit={handleSearchSubmit}>
          <button type="submit" aria-label="Tìm kiếm">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6" />
              <path d="m15 15 5 5" />
            </svg>
          </button>

          <input
              type="search"
              name="query"
              placeholder="Tìm kiếm sản phẩm..."
              aria-label="Tìm kiếm sản phẩm"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setIsSuggestionsOpen(true);
              }}
              onFocus={() => setIsSuggestionsOpen(true)}
              onBlur={() => setIsSuggestionsOpen(false)}
              autoComplete="off"
          />

          {isSuggestionsOpen && searchQuery.trim() !== '' && (
              <div className="header-search__suggestions">
                {searchSuggestions.length > 0 ? (
                    <>
                      <p className="header-search__suggestion-title">
                        Sản phẩm phù hợp
                      </p>

                      {searchSuggestions.map((product) => (
                          <button
                              key={product.id}
                              type="button"
                              className="header-search__suggestion-item"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => handleSuggestionClick(product.id)}
                          >
                            <img src={product.image} alt={product.name} />

                            <span className="header-search__suggestion-info">
                <span className="header-search__suggestion-name">
                  {product.name}
                </span>

                <span className="header-search__suggestion-price">
                  {product.price}
                </span>
              </span>
                          </button>
                      ))}

                      <button
                          type="submit"
                          className="header-search__view-all"
                          onMouseDown={(event) => event.preventDefault()}
                      >
                        Xem tất cả kết quả tìm kiếm
                      </button>
                    </>
                ) : (
                    <p className="header-search__no-result">
                      Không tìm thấy sản phẩm phù hợp
                    </p>
                )}
              </div>
          )}
        </form>

        <div className="header-actions">
          <Link
            to="/yeu-thich"
            className="header-icon header-favorites"
            aria-label={`Sản phẩm yêu thích, ${favorites.length} sản phẩm`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.5 5.5a5 5 0 0 0-7.1 0L12 6.9l-1.4-1.4a5 5 0 0 0-7.1 7.1L12 21l8.5-8.4a5 5 0 0 0 0-7.1Z" />
            </svg>
            <span className="header-favorites__count" aria-hidden="true">{favorites.length}</span>
          </Link>
          <Link
            to="/gio-hang"
            className="header-cart"
            aria-label={`Giỏ hàng, ${totalQuantity} sản phẩm, tổng ${formatCartPrice(totalPrice)}`}
          >
            <span className="header-cart__bag">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path className="header-cart__bag-body" d="M4 8h16l-1 13H5L4 8Z" />
                <path d="M9 9V6a3 3 0 0 1 6 0v3" />
              </svg>
              <span className="header-cart__count" aria-hidden="true">{totalQuantity}</span>
            </span>
            <span className="header-cart__total" aria-hidden="true">{formatCartPrice(totalPrice)}</span>
          </Link>

          {isAuthenticated ? (
              <>
                <Link
                    to="/tai-khoan"
                    className="header-icon"
                    aria-label="Thông tin tài khoản"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="7.5" r="3.5" />
                    <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2Z" />
                  </svg>
                </Link>

                <button
                    type="button"
                    className="header-logout"
                    onClick={() => {
                      logout();
                      navigate('/dang-nhap');
                    }}
                >
                  Đăng xuất
                </button>
              </>
          ) : (
              <div className="header-auth">
                <Link to="/dang-nhap" className="header-auth__login">
                  Đăng nhập
                </Link>

                <Link to="/dang-ky" className="header-auth__register">
                  Đăng ký
                </Link>
              </div>
          )}
        </div>
      </div>
    </header>
  );
}
