import { useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  useEffect(() => {
    document.title = 'Quên mật khẩu | Đồng phục';
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section aria-labelledby="forgot-password-title">
      <div className="auth-form-heading">
        <span className="auth-form-heading__eyebrow">KHÔI PHỤC TÀI KHOẢN</span>
        <h1 id="forgot-password-title">Quên mật khẩu?</h1>
        <p>Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form__field">
          <label htmlFor="forgot-password-email">Email</label>
          <input
            id="forgot-password-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Nhập địa chỉ email đã đăng ký"
            required
          />
        </div>

        <button className="auth-form__submit" type="submit">
          Gửi liên kết đặt lại mật khẩu<span aria-hidden="true">→</span>
        </button>
      </form>

      <p className="auth-switch">
        <Link to="/dang-nhap">
          <span aria-hidden="true">← </span>Quay lại đăng nhập
        </Link>
      </p>
    </section>
  );
}
