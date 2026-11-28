import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { useFavorites } from '@/features/favorites/FavoritesContext';
import { useAddressLocations } from '@/hooks/useAddressLocations';
import type { ShippingAddress as Address } from '@/types/address';
import { addressesStorageKey, formatShippingAddress, loadSavedAddresses } from '@/utils/addresses';
import { parseCheckoutDraft } from '@/utils/checkout';

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

type AddressForm = Omit<Address, 'id' | 'province' | 'district' | 'ward' | 'provinceCode' | 'wardCode'> & {
    provinceCode: string;
    wardCode: string;
};

const emptyAddressForm: AddressForm = {
    name: '',
    phone: '',
    provinceCode: '',
    wardCode: '',
    detail: '',
    note: '',
    isDefault: false,
};


export default function ProfilePage() {
    const { favorites } = useFavorites();
    const location = useLocation();
    const returnToCheckout = location.state?.returnToCheckout === true;
    const checkoutDraft = parseCheckoutDraft(location.state?.checkoutDraft);
    const [checkoutAddressId, setCheckoutAddressId] = useState(checkoutDraft.selectedAddressId);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState(initialProfile);
    const [editing, setEditing] = useState(false);
    const [avatar, setAvatar] = useState('');

    const [addresses, setAddresses] = useState<Address[]>(loadSavedAddresses);

    const [addressFormOpen, setAddressFormOpen] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
    const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddressForm);
    const [previousAddressLocation, setPreviousAddressLocation] = useState('');
    const [addressFormError, setAddressFormError] = useState('');
    const {
        provinces, provincesLoading, provincesError,
        wards, wardsLoading, wardsError, retryProvinces, retryWards,
    } = useAddressLocations(addressFormOpen, addressForm.provinceCode);
    const selectedProvince = provinces.find((province) => String(province.code) === addressForm.provinceCode);
    const selectedWard = wards.find((ward) => String(ward.code) === addressForm.wardCode);
    const addressLocationsReady = Boolean(selectedProvince && selectedWard)
        && !provincesLoading && !wardsLoading && !provincesError && !wardsError;
    const fullAddress = [addressForm.detail.trim(), selectedWard?.name, selectedProvince?.name]
        .filter(Boolean).join(', ');

    useEffect(() => {
        document.title = 'Thông tin cá nhân | VERDE';
    }, []);

    useEffect(() => {
        localStorage.setItem(addressesStorageKey, JSON.stringify(addresses));
    }, [addresses]);

    useEffect(() => {
        if (location.hash === '#dia-chi') {
            document.getElementById('dia-chi')?.scrollIntoView({ block: 'start' });
        }

        if (returnToCheckout && location.state?.openAddressForm === true) {
            openAddAddress();
        }
    }, [location.key]);

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
        setPreviousAddressLocation('');
        setAddressFormError('');
        setAddressFormOpen(true);
    }

    function openEditAddress(address: Address) {
        setEditingAddressId(address.id);

        setAddressForm({
            name: address.name,
            phone: address.phone,
            provinceCode: address.provinceCode ?? '',
            wardCode: address.wardCode ?? '',
            detail: address.detail,
            note: address.note,
            isDefault: address.isDefault,
        });

        setPreviousAddressLocation(!address.provinceCode || !address.wardCode || address.district
            ? [address.ward, address.district, address.province].filter(Boolean).join(', ')
            : '');
        setAddressFormError('');
        setAddressFormOpen(true);
    }

    function handleAddressChange(
        field: keyof AddressForm,
        value: string | boolean
    ) {
        setAddressFormError('');
        setAddressForm((previous) => ({
            ...previous,
            [field]: value,
            ...(field === 'provinceCode' ? { wardCode: '' } : {}),
        }));
    }

    function handleAddressSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!addressLocationsReady || !selectedProvince || !selectedWard) {
            setAddressFormError('Vui lòng chọn tỉnh / thành phố và phường / xã hợp lệ.');
            return;
        }

        if (!addressForm.name.trim() || !addressForm.detail.trim()) {
            setAddressFormError('Vui lòng nhập họ tên người nhận và địa chỉ cụ thể.');
            return;
        }

        const newAddress: Address = {
            ...addressForm,
            name: addressForm.name.trim(),
            phone: addressForm.phone.trim(),
            province: selectedProvince.name,
            district: '',
            ward: selectedWard.name,
            detail: addressForm.detail.trim(),
            note: addressForm.note.trim(),
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
        setCheckoutAddressId(newAddress.id);
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

                            <Link to="/don-hang">
                                <span className="profile-menu__icon">▣</span>
                                <span>Đơn hàng</span>
                                <small>19 mục</small>
                            </Link>

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
                                <small>{favorites.length}</small>
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
                                <p>Theo dõi trạng thái và xem lại lịch sử các đơn hàng của bạn.</p>
                            </div>
                            <Link to="/don-hang">Xem tất cả đơn hàng →</Link>
                        </section>

                        <section className="profile-panel address-management" id="dia-chi">
                            {returnToCheckout && (
                                <Link
                                    className="address-checkout-return"
                                    to="/thanh-toan"
                                    state={{ checkoutDraft: { ...checkoutDraft, selectedAddressId: checkoutAddressId } }}
                                >
                                    Quay lại thanh toán
                                </Link>
                            )}
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
                                                {formatShippingAddress(address)}
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
                                        {previousAddressLocation && (
                                            <p className="address-form-notice">
                                                Địa chỉ đã lưu: {previousAddressLocation}. Vui lòng chọn lại tỉnh / thành phố
                                                và phường / xã theo danh sách hiện hành để cập nhật.
                                            </p>
                                        )}
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
                                                <select
                                                    id="address-province"
                                                    value={addressForm.provinceCode}
                                                    onChange={(event) =>
                                                        handleAddressChange('provinceCode', event.target.value)}
                                                    disabled={provincesLoading || Boolean(provincesError)}
                                                    aria-busy={provincesLoading}
                                                    aria-describedby={provincesError ? 'address-province-error' : undefined}
                                                    required
                                                >
                                                    <option value="">{provincesLoading ? 'Đang tải tỉnh / thành phố...' : 'Chọn tỉnh / thành phố'}</option>
                                                    {provinces.map((province) => (
                                                        <option key={province.code} value={String(province.code)}>{province.name}</option>
                                                    ))}
                                                </select>
                                                {provincesError && (
                                                    <div className="address-location-error" id="address-province-error" role="alert">
                                                        <p>{provincesError}</p>
                                                        <button type="button" onClick={retryProvinces}>Thử lại</button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="address-form-field">
                                                <label htmlFor="address-ward">Phường / Xã *</label>
                                                <select
                                                    id="address-ward"
                                                    value={addressForm.wardCode}
                                                    onChange={(event) =>
                                                        handleAddressChange('wardCode', event.target.value)}
                                                    disabled={!selectedProvince || provincesLoading || wardsLoading || Boolean(wardsError)}
                                                    aria-busy={wardsLoading}
                                                    aria-describedby={wardsError ? 'address-ward-error' : undefined}
                                                    required
                                                >
                                                    <option value="">
                                                        {!selectedProvince ? 'Chọn tỉnh / thành phố trước' : wardsLoading ? 'Đang tải phường / xã...' : 'Chọn phường / xã'}
                                                    </option>
                                                    {wards.map((ward) => (
                                                        <option key={ward.code} value={String(ward.code)}>{ward.name}</option>
                                                    ))}
                                                </select>
                                                {wardsError && (
                                                    <div className="address-location-error" id="address-ward-error" role="alert">
                                                        <p>{wardsError}</p>
                                                        <button type="button" onClick={retryWards}>Thử lại</button>
                                                    </div>
                                                )}
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

                                            {addressLocationsReady && addressForm.detail.trim() && (
                                                <div className="address-form-preview address-form-field--full" aria-live="polite">
                                                    <strong>Địa chỉ giao hàng</strong>
                                                    <p>{fullAddress}</p>
                                                </div>
                                            )}
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

                                        {addressFormError && <p className="address-form-error" role="alert">{addressFormError}</p>}

                                        <div className="address-modal__actions">
                                            <button
                                                type="button"
                                                className="address-cancel-button"
                                                onClick={() => setAddressFormOpen(false)}>
                                                Hủy
                                            </button>

                                            <button type="submit" className="address-save-button" disabled={!addressLocationsReady}>
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
