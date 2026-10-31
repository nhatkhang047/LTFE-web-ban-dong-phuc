import { useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import PasswordInput from '@/components/PasswordInput';
import googleIcon from '@/assets/google.svg';
import facebookIcon from '@/assets/facebook.svg';

export default function LoginPage() {
  useEffect(() => {
    document.title = 'Đăng nhập | Đồng phục';
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section aria-labelledby="login-title">
      <div className="auth-form-heading">
        <span className="auth-form-heading__eyebrow">CHÀO MỪNG BẠN TRỞ LẠI</span>
        <h1 id="login-title">Đăng nhập</h1>
        <p>Đăng nhập để tiếp tục mua sắm cùng chúng tôi.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form__field">
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

        <PasswordInput
          id="login-password"
          name="password"
          label="Mật khẩu"
          autoComplete="current-password"
          placeholder="Nhập mật khẩu của bạn"
        />

        <Link className="auth-form__forgot-password" to="/quen-mat-khau">
          Quên mật khẩu?
        </Link>

        <button className="auth-form__submit" type="submit">
          Đăng nhập<span aria-hidden="true">→</span>
        </button>
      </form>

      <div className="auth-social-login">
        <div className="auth-social-login__divider">
          <span>Hoặc đăng nhập bằng</span>
        </div>
        <div
          className="auth-social-login__buttons"
          role="group"
          aria-label="Đăng nhập bằng tài khoản xã hội"
        >
          <button
            className="auth-social-login__button"
            type="button"
            aria-label="Đăng nhập bằng Google"
          >
            <img src={googleIcon} alt="" width="20" height="20" />
            <span>Google</span>
          </button>
          <button
            className="auth-social-login__button"
            type="button"
            aria-label="Đăng nhập bằng Facebook"
          >
            <img src={facebookIcon} alt="" width="20" height="20" />
            <span>Facebook</span>
          </button>
        </div>
      </div>

      <p className="auth-switch">
        Bạn chưa có tài khoản? <Link to="/dang-ky">Đăng ký ngay</Link>
      </p>
    </section>
  );
}
