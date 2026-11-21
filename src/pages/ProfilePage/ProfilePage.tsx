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

type Address = {
    id: number;
    name: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    detail: string;
    note: string;
    isDefault: boolean;
};

type AddressForm = Omit<Address, 'id' | 'isDefault'> & {
    isDefault: boolean;
};

const initialAddresses: Address[] = [
    {
        id: 1,
        name: 'Nhật Quân',
        phone: '0912345678',
        province: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        detail: '123 Nguyễn Huệ',
        note: '',
        isDefault: true,
    },
    {
        id: 2,
        name: 'Nhật Quân',
        phone: '0987654321',
        province: 'TP. Hồ Chí Minh',
        district: 'Thành phố Thủ Đức',
        ward: 'Phường Thảo Điền',
        detail: '456 Đường số 2',
        note: 'Giao hàng giờ hành chính',
        isDefault: false,
    },
];

const emptyAddressForm: AddressForm = {
    name: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    detail: '',
    note: '',
    isDefault: false,
};


export default function ProfilePage() {
    const { favorites } = useFavorites();
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState(initialProfile);
    const [editing, setEditing] = useState(false);
    const [avatar, setAvatar] = useState('');

    const [addresses, setAddresses] = useState<Address[]>(() => {
        const savedAddresses = localStorage.getItem('verde_addresses');

        return savedAddresses
            ? JSON.parse(savedAddresses) as Address[]
            : initialAddresses;
    });

    const [addressFormOpen, setAddressFormOpen] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
    const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddressForm);
    useEffect(() => {
        document.title = 'Thông tin cá nhân | VERDE';
    }, []);

    useEffect(() => {
        localStorage.setItem('verde_addresses', JSON.stringify(addresses));
    }, [addresses]);

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

    function openAddAddress() {
        setEditingAddressId(null);
        setAddressForm(emptyAddressForm);
        setAddressFormOpen(true);
    }

    function openEditAddress(address: Address) {
        setEditingAddressId(address.id);

        setAddressForm({
            name: address.name,
            phone: address.phone,
            province: address.province,
            district: address.district,
            ward: address.ward,
            detail: address.detail,
            note: address.note,
            isDefault: address.isDefault,
        });

        setAddressFormOpen(true);
    }

    function handleAddressChange(
        field: keyof AddressForm,
        value: string | boolean
    ) {
        setAddressForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    function handleAddressSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const newAddress: Address = {
            ...addressForm,
            id: editingAddressId ?? Date.now(),
            isDefault: addressForm.isDefault || addresses.length === 0,
        };

        setAddresses((previous) => {
            let updatedAddresses: Address[];

            if (editingAddressId !== null) {
                updatedAddresses = previous.map((address) => ({
                    ...address,
                    ...(address.id === editingAddressId ? newAddress : {}),
                    isDefault: addressForm.isDefault
                        ? address.id === editingAddressId
                        : address.isDefault,
                }));
            } else {
                updatedAddresses = [...previous, newAddress];
            }

            if (newAddress.isDefault) {
                updatedAddresses = updatedAddresses.map((address) => ({
                    ...address,
                    isDefault: address.id === newAddress.id,
                }));
            }

            return updatedAddresses;
        });

        setAddressFormOpen(false);
        setEditingAddressId(null);
        setAddressForm(emptyAddressForm);
    }

    function handleDeleteAddress(id: number) {
        const confirmed = window.confirm('Bạn có chắc muốn xóa địa chỉ này không?');

        if (!confirmed) {
            return;
        }

        setAddresses((previous) => {
            const remainingAddresses = previous.filter(
                (address) => address.id !== id
            );

            if (remainingAddresses.length > 0 && !remainingAddresses.some((address) => address.isDefault)) {
                remainingAddresses[0].isDefault = true;
            }

            return [...remainingAddresses];
        });
    }

    function handleSetDefaultAddress(id: number) {
        setAddresses((previous) =>
            previous.map((address) => ({
                ...address,
                isDefault: address.id === id,
            }))
        );
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
                                <small>
                                    {addresses.length.toString().padStart(2, '0')} địa chỉ
                                </small>
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

                        <section className="profile-panel address-management" id="dia-chi">
                            <div className="address-management__heading">
                                <div>
                                    <span className="profile-eyebrow">THÔNG TIN GIAO NHẬN</span>
                                    <h2>Địa chỉ giao nhận</h2>
                                    <p>Quản lý địa chỉ nhận hàng của bạn.</p>
                                </div>

                                <button
                                    type="button"
                                    className="address-add-button"
                                    onClick={openAddAddress}>
                                    + Thêm địa chỉ
                                </button>
                            </div>

                            <div className="address-list">
                                {addresses.length === 0 ? (
                                    <div className="address-empty">
                                        <span>♧</span>
                                        <h3>Bạn chưa có địa chỉ giao nhận</h3>
                                        <p>Thêm địa chỉ để thuận tiện hơn khi đặt hàng.</p>
                                        <button type="button" onClick={openAddAddress}>
                                            Thêm địa chỉ đầu tiên
                                        </button>
                                    </div>
                                ) : (
                                    addresses.map((address) => (
                                        <div className="address-card" key={address.id}>
                                            <div className="address-card__header">
                                                <div>
                                                    <strong>{address.name}</strong>
                                                    <span className="address-card__phone">
                                                        {address.phone}
                                                    </span>
                                                </div>
                                                {address.isDefault && (
                                                    <span className="address-default-badge">
                                                        Địa chỉ mặc định
                                                    </span>)}
                                            </div>

                                            <p className="address-card__detail">
                                                {address.detail}, {address.ward}, {address.district},{' '}
                                                {address.province}
                                            </p>

                                            {address.note && (
                                                <p className="address-card__note">
                                                    Ghi chú: {address.note}
                                                </p>)}

                                            <div className="address-card__actions">
                                                {!address.isDefault && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSetDefaultAddress(address.id)}>
                                                        Đặt làm mặc định
                                                    </button>)}

                                                <button
                                                    type="button"
                                                    onClick={() => openEditAddress(address)}>
                                                    Chỉnh sửa
                                                </button>

                                                <button
                                                    type="button"
                                                    className="address-delete-button"
                                                    onClick={() => handleDeleteAddress(address.id)}>
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {addressFormOpen && (
                            <div className="address-modal-overlay">
                                <div
                                    className="address-modal"
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby="address-modal-title">
                                    <div className="address-modal__heading">
                                        <div>
                                            <span className="profile-eyebrow">THÔNG TIN GIAO NHẬN</span>
                                            <h2 id="address-modal-title">
                                                {editingAddressId !== null
                                                    ? 'Chỉnh sửa địa chỉ'
                                                    : 'Thêm địa chỉ mới'}
                                            </h2>
                                        </div>

                                        <button
                                            type="button"
                                            className="address-modal__close"
                                            aria-label="Đóng"
                                            onClick={() => setAddressFormOpen(false)}>
                                            ×
                                        </button>
                                    </div>

                                    <form onSubmit={handleAddressSubmit}>
                                        <div className="address-form-grid">
                                            <div className="address-form-field">
                                                <label htmlFor="address-name">Họ và tên người nhận *</label>
                                                <input
                                                    id="address-name"
                                                    value={addressForm.name}
                                                    onChange={(event) =>
                                                        handleAddressChange('name', event.target.value)
                                                    }
                                                    placeholder="Nhập họ và tên"
                                                    required/>
                                            </div>

                                            <div className="address-form-field">
                                                <label htmlFor="address-phone">Số điện thoại *</label>
                                                <input
                                                    id="address-phone"
                                                    type="tel"
                                                    value={addressForm.phone}
                                                    onChange={(event) =>
                                                        handleAddressChange('phone', event.target.value)
                                                    }
                                                    placeholder="Nhập số điện thoại"
                                                    pattern="[0-9]{10,11}"
                                                    title="Số điện thoại gồm 10 hoặc 11 chữ số"
                                                    required/>
                                            </div>

                                            <div className="address-form-field">
                                                <label htmlFor="address-province">Tỉnh / Thành phố *</label>
                                                <input
                                                    id="address-province"
                                                    value={addressForm.province}
                                                    onChange={(event) =>
                                                        handleAddressChange('province', event.target.value)}
                                                    placeholder="Nhập tỉnh / thành phố"
                                                    required
                                                />
                                            </div>

                                            <div className="address-form-field">
                                                <label htmlFor="address-district">Quận / Huyện *</label>
                                                <input
                                                    id="address-district"
                                                    value={addressForm.district}
                                                    onChange={(event) =>
                                                        handleAddressChange('district', event.target.value)
                                                    }
                                                    placeholder="Nhập quận / huyện"
                                                    required
                                                />
                                            </div>

                                            <div className="address-form-field">
                                                <label htmlFor="address-ward">Phường / Xã *</label>
                                                <input
                                                    id="address-ward"
                                                    value={addressForm.ward}
                                                    onChange={(event) =>
                                                        handleAddressChange('ward', event.target.value)}
                                                    placeholder="Nhập phường / xã"
                                                    required
                                                />
                                            </div>

                                            <div className="address-form-field address-form-field--full">
                                                <label htmlFor="address-detail">Địa chỉ cụ thể *</label>
                                                <input
                                                    id="address-detail"
                                                    value={addressForm.detail}
                                                    onChange={(event) =>
                                                        handleAddressChange('detail', event.target.value)}
                                                    placeholder="Số nhà, tên đường..."
                                                    required
                                                />
                                            </div>

                                            <div className="address-form-field address-form-field--full">
                                                <label htmlFor="address-note">Ghi chú giao hàng</label>
                                                <textarea
                                                    id="address-note"
                                                    value={addressForm.note}
                                                    onChange={(event) =>
                                                        handleAddressChange('note', event.target.value)}
                                                    placeholder="Ví dụ: Giao hàng giờ hành chính..."
                                                    rows={3}
                                                />
                                            </div>
                                        </div>

                                        <label className="address-default-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={addressForm.isDefault}
                                                onChange={(event) =>
                                                    handleAddressChange('isDefault', event.target.checked)}
                                            />
                                            Đặt làm địa chỉ mặc định
                                        </label>

                                        <div className="address-modal__actions">
                                            <button
                                                type="button"
                                                className="address-cancel-button"
                                                onClick={() => setAddressFormOpen(false)}>
                                                Hủy
                                            </button>

                                            <button type="submit" className="address-save-button">
                                                {editingAddressId !== null
                                                    ? 'Lưu thay đổi'
                                                    : 'Thêm địa chỉ'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
