import "./Header.css";

export default function Header() {
    return (
        <header className="header">
            <a href="/" className="header-logo">VERDE</a>

            <nav className="header-nav">
                <a href="#">Hàng mới</a>
                <a href="#">Sản phẩm</a>
                <a href="#">Bộ sưu tập</a>
                <a href="#">Phụ kiện</a>
                <a href="#">Tạp chí</a>
                <a href="#">Ưu đãi</a>
            </nav>

            <div className="header-actions">
                <button className="header-icon" aria-label="Tìm kiếm">
                    <svg viewBox="0 0 24 24">
                        <circle cx="10.8" cy="10.8" r="6.8" />
                        <path d="m16 16 5 5" />
                    </svg>
                </button>

                <button className="header-icon" aria-label="Tài khoản">
                    <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="7.5" r="3.5" />
                        <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2z" />
                    </svg>
                </button>

                <button className="header-icon cart-icon" aria-label="Giỏ hàng">
                    <svg viewBox="0 0 24 24">
                        <path d="M4 8h16l-1 13H5L4 8Z" />
                        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
                    </svg>
                    <span className="cart-count">2</span>
                </button>
            </div>
        </header>
    )
}
