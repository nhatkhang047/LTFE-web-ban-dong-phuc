import { useState } from 'react';

type PasswordInputProps = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  autoComplete: 'current-password' | 'new-password';
};

export default function PasswordInput({ id, name, label, placeholder, autoComplete }: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((previousVisibility) => !previousVisibility);
  }

  return (
    <div className="auth-form__field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-form__password">
        <input
          id={id}
          name={name}
          type={isPasswordVisible ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
        />
        <button
          className="auth-form__password-toggle"
          type="button"
          onClick={togglePasswordVisibility}
          aria-label={`${isPasswordVisible ? 'Ẩn' : 'Hiện'} ${label.toLowerCase()}`}
          aria-pressed={isPasswordVisible}
          aria-controls={id}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
            {isPasswordVisible && <path d="m3 3 18 18" />}
          </svg>
        </button>
      </div>
    </div>
  );
}
