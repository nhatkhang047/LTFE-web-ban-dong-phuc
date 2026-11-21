import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import type { UserProfile } from '@/types/userProfile';
import {
  createEmptyUserProfile,
  getUserInitials,
  normalizeUserProfile,
  parseStoredUserProfile,
  userProfileStorageKey,
} from '@/utils/userProfile';
import './ProductsPage.scss';
import './UserProfilePage.scss';

type SaveStatus = {
  type: 'success' | 'error';
  message: string;
};

function loadUserProfile() {
  try {
    return parseStoredUserProfile(window.localStorage.getItem(userProfileStorageKey));
  } catch {
    return createEmptyUserProfile();
  }
}

export default function UserProfilePage() {
  const [savedProfile, setSavedProfile] = useState<UserProfile>(loadUserProfile);
  const [formValues, setFormValues] = useState<UserProfile>(savedProfile);
  const [saveStatus, setSaveStatus] = useState<SaveStatus | null>(null);
  const fullNameInputRef = useRef<HTMLInputElement>(null);
  const initials = getUserInitials(savedProfile.fullName);
  const hasChanges = JSON.stringify(formValues) !== JSON.stringify(savedProfile);
  const today = new Date();
  const latestBirthDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    document.title = 'Thông tin người dùng | VERDE';
  }, []);

  function updateField<Field extends keyof UserProfile>(field: Field, value: UserProfile[Field]) {
    setFormValues((previousValues) => ({ ...previousValues, [field]: value }));
    setSaveStatus(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedProfile = normalizeUserProfile(formValues);

    if (!updatedProfile.fullName) {
      setSaveStatus({ type: 'error', message: 'Vui lòng nhập họ và tên hợp lệ.' });
      fullNameInputRef.current?.focus();
      return;
    }

    try {
      window.localStorage.setItem(userProfileStorageKey, JSON.stringify(updatedProfile));
      setSavedProfile(updatedProfile);
      setFormValues(updatedProfile);
      setSaveStatus({ type: 'success', message: 'Đã lưu thông tin cá nhân.' });
    } catch {
      setSaveStatus({ type: 'error', message: 'Không thể lưu thông tin. Vui lòng thử lại.' });
    }
  }

  function handleCancel() {
    setFormValues({ ...savedProfile });
    setSaveStatus(null);
  }

  return (
    <div className="catalog-page profile-page">
      <Header />

      <main className="catalog-main">
        <nav className="catalog-breadcrumb" aria-label="Đường dẫn trang">
          <ol>
            <li><Link to="/">Trang chủ</Link></li>
            <li aria-current="page">Thông tin người dùng</li>
          </ol>
        </nav>

        <div className="profile-container">
          <div className="profile-heading">
            <h1>Thông tin người dùng</h1>
            <p>Quản lý thông tin cá nhân và thông tin liên hệ của bạn.</p>
          </div>

          <div className="profile-layout">
            <aside className="profile-sidebar" aria-label="Tài khoản của bạn">
              <div className="profile-identity">
                <span className="profile-avatar" aria-hidden="true">
                  {initials || (
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 22v-2a8 8 0 0 1 16 0v2" />
                    </svg>
                  )}
                </span>
                <h2>{savedProfile.fullName || 'Khách hàng VERDE'}</h2>
                <p>{savedProfile.email || 'Chưa cập nhật email'}</p>
              </div>
              <nav className="profile-navigation" aria-label="Điều hướng tài khoản">
                <Link to="/tai-khoan" aria-current="page">Thông tin cá nhân</Link>
                <Link to="/yeu-thich">Sản phẩm yêu thích</Link>
                <Link to="/gio-hang">Giỏ hàng</Link>
              </nav>
              <Link className="profile-login" to="/dang-nhap">Đến trang đăng nhập <span aria-hidden="true">→</span></Link>
            </aside>

            <section className="profile-panel" aria-labelledby="profile-form-title">
              <div className="profile-panel__heading">
                <h2 id="profile-form-title">Thông tin cá nhân</h2>
                <p>Các trường có dấu <span aria-hidden="true">*</span> là bắt buộc.</p>
              </div>

              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="profile-form__grid">
                  <div className="profile-field">
                    <label htmlFor="profile-full-name">Họ và tên <span aria-hidden="true">*</span></label>
                    <input
                      ref={fullNameInputRef}
                      id="profile-full-name"
                      name="fullName"
                      autoComplete="name"
                      placeholder="Nhập họ và tên"
                      maxLength={100}
                      value={formValues.fullName}
                      onChange={(event) => updateField('fullName', event.target.value)}
                      required
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="profile-email">Email <span aria-hidden="true">*</span></label>
                    <input
                      id="profile-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Nhập địa chỉ email"
                      maxLength={254}
                      value={formValues.email}
                      onChange={(event) => updateField('email', event.target.value)}
                      required
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="profile-phone">Số điện thoại</label>
                    <input
                      id="profile-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Nhập số điện thoại"
                      pattern="[+]?[0-9 \(\)\-]{8,20}"
                      title="Nhập số điện thoại từ 8 đến 20 ký tự, có thể gồm dấu +, khoảng trắng, dấu ngoặc và dấu gạch ngang."
                      maxLength={21}
                      value={formValues.phone}
                      onChange={(event) => updateField('phone', event.target.value)}
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="profile-birthday">Ngày sinh</label>
                    <input
                      id="profile-birthday"
                      name="dateOfBirth"
                      type="date"
                      autoComplete="bday"
                      max={latestBirthDate}
                      value={formValues.dateOfBirth}
                      onChange={(event) => updateField('dateOfBirth', event.target.value)}
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="profile-gender">Giới tính</label>
                    <select
                      id="profile-gender"
                      name="gender"
                      autoComplete="sex"
                      value={formValues.gender}
                      onChange={(event) => updateField('gender', event.target.value as UserProfile['gender'])}
                    >
                      <option value="">Chưa chọn</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div className="profile-field">
                    <label htmlFor="profile-company">Đơn vị / Công ty</label>
                    <input
                      id="profile-company"
                      name="company"
                      autoComplete="organization"
                      placeholder="Nhập tên đơn vị hoặc công ty"
                      maxLength={150}
                      value={formValues.company}
                      onChange={(event) => updateField('company', event.target.value)}
                    />
                  </div>

                  <div className="profile-field profile-field--full">
                    <label htmlFor="profile-address">Địa chỉ</label>
                    <textarea
                      id="profile-address"
                      name="address"
                      autoComplete="street-address"
                      placeholder="Số nhà, đường, phường/xã, tỉnh/thành phố"
                      rows={3}
                      maxLength={500}
                      value={formValues.address}
                      onChange={(event) => updateField('address', event.target.value)}
                    />
                  </div>
                </div>

                <div className="profile-form__actions">
                  <button className="profile-button profile-button--secondary" type="button" onClick={handleCancel} disabled={!hasChanges}>Hủy thay đổi</button>
                  <button className="profile-button profile-button--primary" type="submit" disabled={!hasChanges}>Lưu thay đổi</button>
                </div>

                {saveStatus && (
                  <p className={`profile-message profile-message--${saveStatus.type}`} role={saveStatus.type === 'error' ? 'alert' : 'status'}>
                    {saveStatus.message}
                  </p>
                )}
              </form>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
