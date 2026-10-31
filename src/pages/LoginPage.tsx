import { useState, type FormEvent } from 'react';
import uniformIllustration from '@/assets/uniform-illustration.svg';
import './LoginPage.scss';

export default function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function togglePasswordVisibility() {
    setIsPasswordVisible((previousVisibility) => !previousVisibility);
  }

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-brand" aria-label="Đồng phục">
          <span className="login-brand__symbol" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="m11 6-7 4 3 7 4-2v12h10V15l4 2 3-7-7-4" />
              <path d="m11 6 5 6 5-6M16 12v6" />
            </svg>
          </span>
          <span>
            đồng phục<span className="login-brand__dot">.</span>
          </span>
        </div>
        <span className="login-header__caption">Gắn kết từ những điều đồng điệu</span>
      </header>

      <main className="login-main">
        <div className="login-card">
          <section className="login-introduction" aria-labelledby="introduction-title">
            <span className="login-introduction__eyebrow">ĐỒNG PHỤC CHO TẬP THỂ</span>
            <h2 id="introduction-title">
              Cùng một màu áo.<br />
              Cùng một tinh thần.
            </h2>
            <p>Những bộ đồng phục chỉn chu, kết nối tập thể bạn theo cách riêng.</p>
            <img
              className="login-introduction__illustration"
              src={uniformIllustration}
              alt="Hai chiếc áo polo đồng phục màu xanh đậm và kem"
              width="420"
              height="300"
            />
            <span className="login-introduction__caption">Mặc đồng điệu, thêm gắn kết.</span>
          </section>

          <section className="login-form-panel" aria-labelledby="login-title">
            <div className="login-form-heading">
              <span className="login-form-heading__eyebrow">CHÀO MỪNG BẠN TRỞ LẠI</span>
              <h1 id="login-title">Đăng nhập</h1>
              <p>Đăng nhập để tiếp tục mua sắm cùng chúng tôi.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-form__field">
                <label htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Nhập địa chỉ email của bạn"
                  required
                />
              </div>

              <div className="login-form__field">
                <label htmlFor="login-password">Mật khẩu</label>
                <div className="login-form__password">
                  <input
                    id="login-password"
                    name="password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Nhập mật khẩu của bạn"
                    required
                  />
                  <button
                    className="login-form__password-toggle"
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label={isPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    aria-pressed={isPasswordVisible}
                    aria-controls="login-password"
                  >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                      {isPasswordVisible && <path d="m3 3 18 18" />}
                    </svg>
                  </button>
                </div>
              </div>

              <button className="login-form__submit" type="submit">
                Đăng nhập<span aria-hidden="true">→</span>
              </button>
            </form>

            <p className="login-register">
              Bạn chưa có tài khoản? <a href="/dang-ky">Đăng ký ngay</a>
            </p>
          </section>
        </div>
      </main>

      <footer className="login-footer">Đồng phục đẹp. Tập thể gắn kết.</footer>
    </div>
  );
}
