import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { orderPaymentMethodLabels } from '@/constants/orders';
import { useCart } from '@/features/cart/CartContext';
import type { ShippingAddress } from '@/types/address';
import type { OrderPaymentMethod } from '@/types/order';
import { addressesStorageKey, formatShippingAddress, loadSavedAddresses } from '@/utils/addresses';
import { formatCartPrice } from '@/utils/cart';
import { parseCheckoutDraft } from '@/utils/checkout';
import './ProductsPage.scss';
import './CheckoutPage.scss';

type AddressState = {
    addresses: ShippingAddress[];
    error: string;
};

const paymentMethods: { value: OrderPaymentMethod; description: string }[] = [
    { value: 'cod', description: 'Thanh toán cho nhân viên giao hàng khi nhận sản phẩm.' },
    { value: 'bank_transfer', description: 'Lựa chọn thanh toán bằng hình thức chuyển khoản ngân hàng.' },
];

function readAddressState(): AddressState {
    try {
        return { addresses: loadSavedAddresses(), error: '' };
    } catch {
        return { addresses: [], error: 'Không thể tải địa chỉ giao hàng. Vui lòng thử lại hoặc kiểm tra sổ địa chỉ.' };
    }
}

export default function CheckoutPage() {
    const { items, totalQuantity, totalPrice } = useCart();
    const location = useLocation();
    const [initialDraft] = useState(() => parseCheckoutDraft(location.state?.checkoutDraft));
    const [addressState, setAddressState] = useState(readAddressState);
    const [selectedAddressId, setSelectedAddressId] = useState(initialDraft.selectedAddressId);
    const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod>(initialDraft.paymentMethod);
    const [note, setNote] = useState(initialDraft.note);
    const [formError, setFormError] = useState('');
    const reviewRef = useRef<HTMLDialogElement>(null);
    const selectedAddress = addressState.addresses.find((address) => address.id === selectedAddressId)
        ?? addressState.addresses.find((address) => address.isDefault)
        ?? addressState.addresses[0];
    const checkoutDraft = { selectedAddressId: selectedAddress?.id ?? null, paymentMethod, note };
    const addressLinkState = { returnToCheckout: true, checkoutDraft };

    useEffect(() => {
        document.title = 'Thanh toán | VERDE';
    }, []);

    useEffect(() => {
        function refreshAddresses() {
            setAddressState(readAddressState());
            setFormError('');
            reviewRef.current?.close();
        }

        function handleStorageChange(event: StorageEvent) {
            if (event.key === addressesStorageKey || event.key === null) {
                refreshAddresses();
            }
        }

        window.addEventListener('focus', refreshAddresses);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('focus', refreshAddresses);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        reviewRef.current?.close();
    }, [items]);

    function handleReview(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!selectedAddress || addressState.error) {
            setFormError('Vui lòng chọn địa chỉ giao hàng trước khi tiếp tục.');
            return;
        }

        if (items.length === 0 || !Number.isSafeInteger(totalPrice) || totalPrice < 0) {
            setFormError('Vui lòng kiểm tra lại sản phẩm và số lượng trong giỏ hàng.');
            return;
        }

        setFormError('');
        reviewRef.current?.showModal();
    }

    return (
        <div className="catalog-page checkout-page">
            <Header />

            <main className="catalog-main">
                <nav className="catalog-breadcrumb" aria-label="Đường dẫn trang">
                    <ol>
                        <li><Link to="/">Trang chủ</Link></li>
                        <li><Link to="/gio-hang">Giỏ hàng</Link></li>
                        <li aria-current="page">Thanh toán</li>
                    </ol>
                </nav>

                <div className="checkout-container">
                    <div className="checkout-heading">
                        <div>
                            <p className="checkout-eyebrow">HOÀN TẤT LỰA CHỌN CỦA BẠN</p>
                            <h1>Thanh toán</h1>
                            <p>Chọn nơi nhận hàng và phương thức thanh toán phù hợp.</p>
                        </div>
                        <Link className="checkout-text-link" to="/gio-hang">Quay lại giỏ hàng</Link>
                    </div>

                    {items.length === 0 ? (
                        <section className="checkout-empty" aria-labelledby="checkout-empty-title">
                            <h2 id="checkout-empty-title">Giỏ hàng của bạn đang trống</h2>
                            <p>Thêm sản phẩm vào giỏ để tiếp tục thanh toán.</p>
                            <Link className="checkout-button" to="/san-pham">Khám phá sản phẩm</Link>
                        </section>
                    ) : (
                        <form className="checkout-layout" onSubmit={handleReview}>
                            <div className="checkout-sections">
                                <section className="checkout-panel" aria-labelledby="checkout-address-title">
                                    <div className="checkout-panel__heading">
                                        <h2 id="checkout-address-title">Địa chỉ giao hàng</h2>
                                        <Link
                                            className="checkout-text-link"
                                            to="/tai-khoan#dia-chi"
                                            state={{ ...addressLinkState, openAddressForm: true }}
                                        >Thêm địa chỉ mới</Link>
                                    </div>

                                    {addressState.error ? (
                                        <div className="checkout-feedback" role="alert">
                                            <p>{addressState.error}</p>
                                            <button type="button" className="checkout-text-link" onClick={() => setAddressState(readAddressState())}>Thử lại</button>
                                        </div>
                                    ) : addressState.addresses.length === 0 ? (
                                        <div className="checkout-address-empty">
                                            <p>Bạn chưa có địa chỉ giao hàng.</p>
                                            <p>Thêm tên người nhận, số điện thoại và địa chỉ để tiếp tục.</p>
                                        </div>
                                    ) : (
                                        <fieldset className="checkout-options" aria-labelledby="checkout-address-title">
                                            {addressState.addresses.map((address) => (
                                                <label className="checkout-choice checkout-address-choice" key={address.id}>
                                                    <input
                                                        type="radio"
                                                        name="shippingAddress"
                                                        value={address.id}
                                                        checked={selectedAddress?.id === address.id}
                                                        onChange={() => {
                                                            setSelectedAddressId(address.id);
                                                            setFormError('');
                                                        }}
                                                        required
                                                    />
                                                    <span className="checkout-choice__content">
                                                        <span className="checkout-address-choice__recipient">
                                                            <strong>{address.name}</strong>
                                                            <span>{address.phone}</span>
                                                            {address.isDefault && <span className="checkout-default-badge">Mặc định</span>}
                                                        </span>
                                                        <span>{formatShippingAddress(address)}</span>
                                                        {address.note && <span className="checkout-choice__note">Ghi chú: {address.note}</span>}
                                                    </span>
                                                </label>
                                            ))}
                                        </fieldset>
                                    )}

                                    <Link className="checkout-address-manage checkout-text-link" to="/tai-khoan#dia-chi" state={addressLinkState}>
                                        Quản lý địa chỉ giao nhận
                                    </Link>
                                </section>

                                <section className="checkout-panel" aria-labelledby="checkout-payment-title">
                                    <div className="checkout-panel__heading">
                                        <h2 id="checkout-payment-title">Phương thức thanh toán</h2>
                                    </div>
                                    <fieldset className="checkout-options" aria-labelledby="checkout-payment-title">
                                        {paymentMethods.map((method) => (
                                            <label className="checkout-choice checkout-payment-choice" key={method.value}>
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method.value}
                                                    checked={paymentMethod === method.value}
                                                    onChange={() => setPaymentMethod(method.value)}
                                                    required
                                                />
                                                <span className="checkout-payment-icon" aria-hidden="true">
                                                    <svg viewBox="0 0 24 24" fill="none">
                                                        {method.value === 'cod' ? (
                                                            <><rect x="3" y="6" width="18" height="13" rx="2" /><circle cx="12" cy="12.5" r="3" /><path d="M6 10h1m10 5h1" /></>
                                                        ) : (
                                                            <><path d="m3 8 9-5 9 5H3Zm0 13h18M5 11v7m7-7v7m7-7v7" /></>
                                                        )}
                                                    </svg>
                                                </span>
                                                <span className="checkout-choice__content">
                                                    <strong>{orderPaymentMethodLabels[method.value]}{method.value === 'cod' && ' (COD)'}</strong>
                                                    <span>{method.description}</span>
                                                </span>
                                            </label>
                                        ))}
                                    </fieldset>
                                </section>

                                <section className="checkout-panel" aria-labelledby="checkout-note-title">
                                    <div className="checkout-panel__heading">
                                        <h2 id="checkout-note-title"><label htmlFor="checkout-note">Ghi chú đơn hàng</label></h2>
                                        <span className="checkout-optional">Không bắt buộc</span>
                                    </div>
                                    <textarea
                                        id="checkout-note"
                                        name="orderNote"
                                        rows={3}
                                        maxLength={500}
                                        placeholder="Lưu ý về thời gian hoặc hướng dẫn giao hàng..."
                                        value={note}
                                        onChange={(event) => setNote(event.target.value)}
                                    />
                                </section>
                            </div>

                            <aside className="checkout-summary" aria-labelledby="checkout-summary-title">
                                <div className="checkout-summary__heading">
                                    <h2 id="checkout-summary-title">Đơn hàng của bạn</h2>
                                    <span>{totalQuantity} sản phẩm</span>
                                </div>
                                <ul className="checkout-products">
                                    {items.map((item) => (
                                        <li className="checkout-product" key={item.id}>
                                            <img src={item.image} alt={item.name} width="62" height="78" />
                                            <div className="checkout-product__info">
                                                <h3>{item.name}</h3>
                                                <div className="checkout-product__variant">
                                                    {item.color && <span className="checkout-color" role="img" aria-label="Màu đã chọn" style={{ backgroundColor: item.color }} />}
                                                    {item.size && <span>Cỡ {item.size}</span>}
                                                    <span>SL: {item.quantity}</span>
                                                </div>
                                                <p>{formatCartPrice(item.unitPrice * item.quantity)}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <Link className="checkout-summary__edit checkout-text-link" to="/gio-hang">Chỉnh sửa giỏ hàng</Link>
                                <dl className="checkout-totals">
                                    <div><dt>Tiền sản phẩm</dt><dd>{formatCartPrice(totalPrice)}</dd></div>
                                    <div><dt>Phí vận chuyển</dt><dd>Chưa xác định</dd></div>
                                    <div className="checkout-totals__total"><dt>Tạm tính</dt><dd aria-live="polite">{formatCartPrice(totalPrice)}</dd></div>
                                </dl>
                                <p className="checkout-summary__shipping-note">Phí vận chuyển sẽ được xác nhận khi đặt hàng.</p>
                                {formError && <p className="checkout-feedback" role="alert">{formError}</p>}
                                {!selectedAddress && <p className="checkout-summary__missing-address">Vui lòng thêm địa chỉ giao hàng để tiếp tục.</p>}
                                <button className="checkout-button" type="submit" disabled={!selectedAddress || Boolean(addressState.error)}>
                                    Xem lại thông tin
                                </button>
                                <p className="checkout-summary__notice">Kiểm tra thông tin trước khi đặt hàng. Bước này chưa phát sinh thanh toán.</p>
                            </aside>
                        </form>
                    )}
                </div>
            </main>

            <Footer />

            <dialog className="checkout-review" ref={reviewRef} aria-labelledby="checkout-review-title" aria-describedby="checkout-review-notice">
                <div className="checkout-panel__heading">
                    <h2 id="checkout-review-title">Kiểm tra thông tin thanh toán</h2>
                    <button className="checkout-review__close" type="button" aria-label="Đóng bản xem lại" onClick={() => reviewRef.current?.close()}>×</button>
                </div>
                {selectedAddress && (
                    <section className="checkout-review__section" aria-labelledby="checkout-review-address-title">
                        <h3 id="checkout-review-address-title">Giao đến</h3>
                        <p><strong>{selectedAddress.name}</strong> · {selectedAddress.phone}</p>
                        <p>{formatShippingAddress(selectedAddress)}</p>
                        {selectedAddress.note && <p>Ghi chú giao hàng: {selectedAddress.note}</p>}
                    </section>
                )}
                <section className="checkout-review__section" aria-labelledby="checkout-review-payment-title">
                    <h3 id="checkout-review-payment-title">Phương thức thanh toán</h3>
                    <p>{orderPaymentMethodLabels[paymentMethod]}</p>
                </section>
                {note.trim() && <div className="checkout-review__section"><h3>Ghi chú đơn hàng</h3><p>{note.trim()}</p></div>}
                <dl className="checkout-totals">
                    <div><dt>Số lượng</dt><dd>{totalQuantity} sản phẩm</dd></div>
                    <div><dt>Phí vận chuyển</dt><dd>Chưa xác định</dd></div>
                    <div className="checkout-totals__total"><dt>Tạm tính</dt><dd>{formatCartPrice(totalPrice)}</dd></div>
                </dl>
                <p id="checkout-review-notice" className="checkout-review__notice">Thông tin đang ở bước xem lại. Đơn hàng chưa được tạo và chưa phát sinh thanh toán.</p>
                <form method="dialog"><button className="checkout-button" type="submit" autoFocus>Tiếp tục chỉnh sửa</button></form>
            </dialog>
        </div>
    );
}
