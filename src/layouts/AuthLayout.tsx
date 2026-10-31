import { Outlet } from 'react-router-dom';
import uniformIllustration from '@/assets/uniform-illustration.svg';
import './AuthLayout.scss';

export default function AuthLayout() {
  return (
    <div className="auth-page">
      <header className="auth-header">
        <div className="auth-brand" aria-label="Đồng phục">
          <span className="auth-brand__symbol" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="m11 6-7 4 3 7 4-2v12h10V15l4 2 3-7-7-4" />
              <path d="m11 6 5 6 5-6M16 12v6" />
            </svg>
          </span>
          <span>
            đồng phục<span className="auth-brand__dot">.</span>
          </span>
        </div>
        <span className="auth-header__caption">Gắn kết từ những điều đồng điệu</span>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          <section className="auth-introduction" aria-labelledby="introduction-title">
            <span className="auth-introduction__eyebrow">ĐỒNG PHỤC CHO TẬP THỂ</span>
            <h2 id="introduction-title">
              Cùng một màu áo.<br />
              Cùng một tinh thần.
            </h2>
            <p>Những bộ đồng phục chỉn chu, kết nối tập thể bạn theo cách riêng.</p>
            <img
              className="auth-introduction__illustration"
              src={uniformIllustration}
              alt="Hai chiếc áo polo đồng phục màu xanh đậm và kem"
              width="420"
              height="300"
            />
            <span className="auth-introduction__caption">Mặc đồng điệu, thêm gắn kết.</span>
          </section>

          <div className="auth-form-panel">
            <Outlet />
          </div>
        </div>
      </main>

      <footer className="auth-footer">Đồng phục đẹp. Tập thể gắn kết.</footer>
    </div>
  );
}
