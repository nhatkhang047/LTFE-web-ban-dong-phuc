import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { useFavorites } from '@/features/favorites/FavoritesContext';

import './ProfilePage.scss';

type ProfileData = {
    name: string;
    email: string;
    phone: string;
    birthday: string;
    gender: string;
};

const initialProfile: ProfileData = {
    name: 'name',
    email: 'example@gmail.com',
    phone: '',
    birthday: '',
    gender: '',
};

export default function ProfilePage() {
    const { favorites } = useFavorites();
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState(initialProfile);
    const [editing, setEditing] = useState(false);
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        document.title = 'Thông tin cá nhân | VERDE';
    }, []);

    function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (file) {
            setAvatar(URL.createObjectURL(file));
        }
    }

    function handleProfileChange(
        field: keyof ProfileData,
        value: string
    ) {
        setProfile((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setEditing(false);
        alert('Thông tin cá nhân đã được cập nhật (minh họa).');
    }

    return (
        <div className="profile-page">
            <Header />

            <main className="profile-main">
                <nav className="profile-breadcrumb">
                    <Link to="/">Trang chủ</Link>
                    <span>/</span>
                    <strong>Thông tin cá nhân</strong>
                </nav>

                <div className="profile-heading">
                    <h1>Thông tin cá nhân</h1>
                    <p>
                        Quản lý thông tin tài khoản, đơn hàng và tùy chọn cá nhân của bạn.
                    </p>
                </div>

                <div className="profile-layout">
                    <aside className="profile-sidebar">
                        <section className="profile-user-card">
                            <div className="profile-user-card__info">
                                <div className="profile-avatar">
                                    {avatar ? (
                                        <img src={avatar} alt="Ảnh đại diện" />
                                    ) : (
                                        <span>NQ</span>
                                    )}
                                </div>

                                <div>
                                    <h2>{profile.name}</h2>
                                    <p>{profile.email}</p>
                                </div>
                            </div>

                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleAvatarChange}
                            />

                            <button
                                type="button"
                                onClick={() => avatarInputRef.current?.click()}
                            >
                                Đổi ảnh đại diện
                            </button>
                        </section>

                        <section className="profile-menu">
                            <h3>MỤC LỤC QUẢN LÝ</h3>

                            <a href="#don-hang">
                                <span className="profile-menu__icon">▣</span>
                                <span>Đơn hàng</span>
                                <small>19 mục</small>
                            </a>

                            <a href="#dia-chi">
                                <span className="profile-menu__icon">♧</span>
                                <span>Địa chỉ giao nhận</span>
                                <small>01 địa chỉ</small>
                            </a>

                            <Link to="/yeu-thich">
                                <span className="profile-menu__icon">♡</span>
                                <span>Danh sách theo dõi</span>
                                <small>{favorites.length} quyển</small>
                            </Link>

                            <a href="#cai-dat" className="active">
                                <span className="profile-menu__icon">⚙</span>
                                <span>Cài đặt tài khoản</span>
                            </a>
                        </section>
                    </aside>

                    <div className="profile-content">
                        <section className="profile-panel">
                            <div className="profile-panel__heading">
                                <h2>Thông tin cá nhân</h2>

                                <button
                                    type="button"
                                    onClick={() => setEditing(!editing)}
                                >
                                    {editing ? 'Hủy chỉnh sửa' : '✎ Chỉnh sửa'}
                                </button>
                            </div>

                            <form onSubmit={handleSaveProfile}>
                                <div className="profile-info-grid">
                                    <div className="profile-info-item">
                                        <label htmlFor="profile-name">HỌ VÀ TÊN</label>
                                        {editing ? (
                                            <input
                                                id="profile-name"
                                                value={profile.name}
                                                onChange={(event) =>
                                                    handleProfileChange('name', event.target.value)
                                                }
                                            />
                                        ) : (
                                            <strong>{profile.name}</strong>
                                        )}
                                    </div>

                                    <div className="profile-info-item">
                                        <label htmlFor="profile-email">GMAIL</label>
                                        <div className="profile-info-item__value">
                                            <strong>{profile.email}</strong>
                                            <span className="verified">✓ ĐÃ XÁC MINH</span>
                                        </div>
                                    </div>

                                    <div className="profile-info-item">
                                        <label htmlFor="profile-phone">SỐ ĐIỆN THOẠI LIÊN HỆ</label>
                                        {editing ? (
                                            <input
                                                id="profile-phone"
                                                type="tel"
                                                placeholder="Nhập số điện thoại"
                                                value={profile.phone}
                                                onChange={(event) =>
                                                    handleProfileChange('phone', event.target.value)
                                                }
                                            />
                                        ) : (
                                            <strong>{profile.phone || 'Chưa cập nhật'}</strong>
                                        )}
                                    </div>

                                    <div className="profile-info-item">
                                        <label htmlFor="profile-birthday">NGÀY SINH</label>
                                        {editing ? (
                                            <input
                                                id="profile-birthday"
                                                type="date"
                                                value={profile.birthday}
                                                onChange={(event) =>
                                                    handleProfileChange('birthday', event.target.value)
                                                }
                                            />
                                        ) : (
                                            <strong>{profile.birthday || 'Chưa cập nhật'}</strong>
                                        )}
                                    </div>

                                    <div className="profile-info-item">
                                        <label htmlFor="profile-gender">GIỚI TÍNH</label>
                                        {editing ? (
                                            <select
                                                id="profile-gender"
                                                value={profile.gender}
                                                onChange={(event) =>
                                                    handleProfileChange('gender', event.target.value)
                                                }
                                            >
                                                <option value="">Chọn giới tính</option>
                                                <option value="Nam">Nam</option>
                                                <option value="Nữ">Nữ</option>
                                                <option value="Khác">Khác</option>
                                            </select>
                                        ) : (
                                            <strong>{profile.gender || 'Chưa cập nhật'}</strong>
                                        )}
                                    </div>

                                    <div className="profile-info-item">
                                        <label>NGÀY GIA NHẬP</label>
                                        <strong>31 Tháng 10, 2026</strong>
                                    </div>
                                </div>

                                {editing && (
                                    <div className="profile-form-actions">
                                        <button type="submit">Lưu thay đổi</button>
                                    </div>
                                )}
                            </form>
                        </section>

                        <section className="profile-panel profile-settings" id="cai-dat">
                            <span className="profile-eyebrow">TÙY CHỌN HỆ THỐNG</span>
                            <h2>Cài đặt tài khoản</h2>

                            <details className="profile-setting-item">
                                <summary>
                                    <span className="profile-setting-icon">▤</span>
                                    <span className="profile-setting-text">
                                        <strong>Phương thức thanh toán</strong>
                                        <small>
                                            Quản lý thẻ tín dụng và phương thức thanh toán
                                        </small>
                                    </span>
                                    <span className="profile-setting-extra">
                                        Chưa thiết lập
                                    </span>
                                </summary>
                                <p>
                                    Bạn chưa thêm phương thức thanh toán nào.
                                    Tính năng này hiện chỉ mang tính minh họa.
                                </p>
                            </details>

                            <details className="profile-setting-item">
                                <summary>
                                    <span className="profile-setting-icon">⚿</span>
                                    <span className="profile-setting-text">
                                        <strong>Đổi mật khẩu</strong>
                                        <small>Khuyến nghị đổi mật khẩu mỗi 180 ngày</small>
                                    </span>
                                </summary>
                                <div className="profile-password-form">
                                    <input
                                        type="password"
                                        placeholder="Mật khẩu hiện tại"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Mật khẩu mới"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => alert('Chức năng đổi mật khẩu đang được minh họa.')}
                                    >
                                        Cập nhật mật khẩu
                                    </button>
                                </div>
                            </details>
                        </section>

                        <section className="profile-panel profile-extra" id="don-hang">
                            <div>
                                <span className="profile-eyebrow">LỊCH SỬ MUA SẮM</span>
                                <h2>Đơn hàng của tôi</h2>
                                <p>Bạn có 19 đơn hàng trong tài khoản (dữ liệu minh họa).</p>
                            </div>
                            <Link to="/gio-hang">Xem giỏ hàng →</Link>
                        </section>

                        <section className="profile-panel profile-extra" id="dia-chi">
                            <div>
                                <span className="profile-eyebrow">THÔNG TIN GIAO NHẬN</span>
                                <h2>Địa chỉ giao nhận</h2>
                                <p>Bạn chưa cập nhật địa chỉ giao nhận.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => alert('Chức năng quản lý địa chỉ đang được minh họa.')}
                            >
                                Thêm địa chỉ
                            </button>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
