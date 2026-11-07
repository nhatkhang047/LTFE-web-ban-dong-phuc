import { type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <header className="header">
      <Link to="/" className="header-logo" aria-label="VERDE - về trang chủ">
        VERDE<span>.</span>
      </Link>

      <nav className="header-nav" aria-label="Điều hướng chính">
        <a href="#">Mẫu mới</a>
        <a href="#">Bộ sưu tập</a>
        <a href="/#san-pham" className="header-nav__link--active">Cửa hàng</a>
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
            placeholder="Tìm kiếm cashmere, lụa, vải..."
            aria-label="Tìm kiếm sản phẩm"
          />
        </form>

        <div className="header-actions">
          <button className="header-icon header-favorites" type="button" aria-label="Sản phẩm yêu thích, 3 sản phẩm">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.5 5.5a5 5 0 0 0-7.1 0L12 6.9l-1.4-1.4a5 5 0 0 0-7.1 7.1L12 21l8.5-8.4a5 5 0 0 0 0-7.1Z" />
            </svg>
            <span className="header-favorites__count" aria-hidden="true">3</span>
          </button>

          <Link to="/dang-nhap" className="header-icon" aria-label="Đăng nhập tài khoản">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="7.5" r="3.5" />
              <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2Z" />
            </svg>
          </Link>

          <button className="header-cart" type="button" aria-label="Giỏ hàng, 2 sản phẩm, tổng 458 đô la">
            <span className="header-cart__bag">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path className="header-cart__bag-body" d="M4 8h16l-1 13H5L4 8Z" />
                <path d="M9 9V6a3 3 0 0 1 6 0v3" />
              </svg>
              <span className="header-cart__count" aria-hidden="true">2</span>
            </span>
            <span className="header-cart__total" aria-hidden="true">$458</span>
          </button>
        </div>
      </div>
    </header>
  );
}
