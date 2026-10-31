import "./Footer.css"

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-newsletter">
                        <h3>KẾT NỐI CÙNG CHÚNG TÔI</h3>

                        <p>
                            Nhận tin sớm về sản phẩm mới, ưu đãi độc quyền và
                            cảm hứng phong cách.
                        </p>

                        <form className="footer-subscribe">
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                aria-label="Email của bạn"
                            />

                            <button type="submit" aria-label="Đăng ký nhận tin">
                                <svg viewBox="0 0 24 24">
                                    <path d="M4 12h16" />
                                    <path d="m14 6 6 6-6 6" />
                                </svg>
                            </button>
                        </form>

                        <div className="footer-socials">
                            <a href="#" aria-label="Instagram">
                                <svg viewBox="0 0 24 24">
                                    <rect x="3" y="3" width="18" height="18" rx="5" />
                                    <circle cx="12" cy="12" r="4" />
                                    <circle cx="18" cy="6" r="0.8" fill="currentColor" />
                                </svg>
                            </a>

                            <a href="#" aria-label="Facebook">
                                <svg viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        stroke="none"
                                        d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8z"
                                    />
                                </svg>
                            </a>

                            <a href="#" aria-label="Pinterest">
                                <svg viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M10 20c1-2 1.3-4 2-6.5" />
                                    <path d="M9 10c0-2 1.5-3.5 3.5-3.5 2.2 0 3.5 1.4 3.5 3.3 0 2.3-1.2 4.2-3 4.2-1 0-1.8-.8-1.5-1.9l.6-2.3" />
                                </svg>
                            </a>

                            <a href="#" aria-label="Youtube">
                                <svg viewBox="0 0 24 24">
                                    <rect x="2.5" y="5" width="19" height="14" rx="4" fill="currentColor" stroke="none" />
                                    <path d="m10 9 5 3-5 3z" fill="#7f8d78" stroke="none" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h3>CỬA HÀNG</h3>
                        <ul>
                            <li><a href="#">Hàng mới</a></li>
                            <li><a href="#">Bộ sưu tập</a></li>
                            <li><a href="#">Trang phục</a></li>
                            <li><a href="#">Phụ kiện</a></li>
                            <li><a href="#">Ưu đãi</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>HỖ TRỢ KHÁCH HÀNG</h3>
                        <ul>
                            <li><a href="#">Trung tâm trợ giúp</a></li>
                            <li><a href="#">Vận chuyển & giao hàng</a></li>
                            <li><a href="#">Đổi trả sản phẩm</a></li>
                            <li><a href="#">Hướng dẫn chọn cỡ</a></li>
                            <li><a href="#">Liên hệ</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>VỀ CHÚNG TÔI</h3>
                        <ul>
                            <li><a href="#">Giới thiệu</a></li>
                            <li><a href="#">Phát triển bền vững</a></li>
                            <li><a href="#">Tuyển dụng</a></li>
                            <li><a href="#">Tạp chí</a></li>
                            <li><a href="#">Hệ thống cửa hàng</a></li>
                        </ul>
                    </div>

                    <div className="footer-brand">
                        <a href="/" className="footer-logo">VERDE</a>
                        <p>
                            Thời trang hiện đại cho
                            <br />
                            nhịp sống năng động.
                        </p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © 2025 VERDE Bảo lưu mọi quyền.
                    </p>

                    <div className="footer-policies">
                        <a href="#">Chính sách bảo mật</a>
                        <a href="#">Điều khoản dịch vụ</a>
                        <a href="#">Tùy chọn cookie</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}