import { useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import PasswordInput from '@/components/PasswordInput';

export default function RegisterPage() {
  useEffect(() => {
    document.title = 'Đăng ký | Đồng phục';
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section aria-labelledby="register-title">
      <div className="auth-form-heading">
        <span className="auth-form-heading__eyebrow">BẮT ĐẦU CÙNG CHÚNG TÔI</span>
        <h1 id="register-title">Đăng ký</h1>
        <p>Tạo tài khoản để mua sắm đồng phục cho tập thể bạn.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form__field">
          <label htmlFor="register-full-name">Họ và tên</label>
          <input
            id="register-full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Nhập họ và tên của bạn"
            required
          />
        </div>

        <div className="auth-form__field">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Nhập địa chỉ email của bạn"
            required
          />
        </div>

        <PasswordInput
          id="register-password"
          name="password"
          label="Mật khẩu"
          autoComplete="new-password"
          placeholder="Nhập mật khẩu của bạn"
        />

        <PasswordInput
          id="register-password-confirmation"
          name="passwordConfirmation"
          label="Xác nhận mật khẩu"
          autoComplete="new-password"
          placeholder="Nhập lại mật khẩu của bạn"
        />

        <button className="auth-form__submit" type="submit">
          Đăng ký<span aria-hidden="true">→</span>
        </button>
      </form>

      <p className="auth-switch">
        Bạn đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link>
      </p>
    </section>
  );
}
