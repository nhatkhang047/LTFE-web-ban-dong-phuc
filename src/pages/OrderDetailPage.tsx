import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { orderPaymentMethodLabels, orderPaymentStatusLabels, orderStatusLabels } from '@/constants/orders';
import { useOrders } from '@/features/orders/OrdersContext';
import { formatCartPrice } from '@/utils/cart';
import { formatOrderDate, getOrderTotals } from '@/utils/orders';
import './ProductsPage.scss';
import './OrdersPage.scss';
import './OrderDetailPage.scss';

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById, storageError } = useOrders();
  const order = getOrderById(orderId ?? '');
  const totals = order ? getOrderTotals(order.items, order.shippingFee, order.discountAmount) : null;

  useEffect(() => {
    document.title = order ? `Đơn hàng ${order.code} | VERDE` : 'Chi tiết đơn hàng | VERDE';
  }, [order?.code]);

  return (
    <div className="catalog-page order-detail-page">
      <Header />

      <main className="catalog-main">
        <nav className="catalog-breadcrumb" aria-label="Đường dẫn trang">
          <ol>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/don-hang">Đơn hàng của tôi</Link></li>
            <li aria-current="page">{order?.code ?? 'Chi tiết đơn hàng'}</li>
          </ol>
        </nav>

        <div className="orders-container order-detail-container">
          {storageError && <p className="orders-error" role="alert">{storageError}</p>}

          {order && totals ? (
            <>
              <div className="order-detail-heading">
                <div>
                  <h1>Đơn hàng {order.code}</h1>
                  <div className="order-detail-heading__meta">
                    <span className={`order-status order-status--${order.status}`}>{orderStatusLabels[order.status]}</span>
                    <p>Ngày đặt: <time dateTime={order.createdAt}>{formatOrderDate(order.createdAt)}</time></p>
                  </div>
                </div>
                <Link className="order-detail-back" to="/don-hang">Quay lại danh sách</Link>
              </div>

              {order.status === 'cancelled' && (
                <section className="order-detail-cancelled" aria-labelledby="order-cancelled-title">
                  <h2 id="order-cancelled-title">Đơn hàng đã được hủy</h2>
                  <p>Lý do: {order.cancellationReason}</p>
                  {order.cancelledAt && <time dateTime={order.cancelledAt}>{formatOrderDate(order.cancelledAt)}</time>}
                </section>
              )}

              <div className="order-detail-layout">
                <div className="order-detail-main">
                  <section className="order-detail-panel" aria-labelledby="order-products-title">
                    <div className="order-detail-panel__heading">
                      <h2 id="order-products-title">Sản phẩm đã đặt</h2>
                      <span>{totals.quantity} sản phẩm</span>
                    </div>
                    <table className="order-detail-table">
                      <thead>
                        <tr>
                          <th scope="col">Sản phẩm</th>
                          <th scope="col">Đơn giá</th>
                          <th scope="col">Số lượng</th>
                          <th scope="col">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="order-detail-product">
                                <img src={item.image} alt={item.name} width="72" height="92" loading="lazy" />
                                <div>
                                  <h3>{item.name}</h3>
                                  <div className="order-detail-product__variant">
                                    {item.color && (
                                      <span className="order-item__color">
                                        Màu sắc <span role="img" aria-label="Màu đã đặt" style={{ backgroundColor: item.color }} />
                                      </span>
                                    )}
                                    {item.size && <span>Kích cỡ: {item.size}</span>}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="order-detail-table__price">{formatCartPrice(item.unitPrice)}</td>
                            <td className="order-detail-table__quantity">{item.quantity}</td>
                            <td className="order-detail-table__price order-detail-table__total">{formatCartPrice(item.unitPrice * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {order.note && (
                      <div className="order-detail-note">
                        <h3>Ghi chú đơn hàng</h3>
                        <p>{order.note}</p>
                      </div>
                    )}
                  </section>

                  <section className="order-detail-panel" aria-labelledby="order-history-title">
                    <div className="order-detail-panel__heading">
                      <h2 id="order-history-title">Lịch sử đơn hàng</h2>
                    </div>
                    <ol className="order-timeline">
                      {order.statusHistory.map((entry, index) => {
                        const isLatest = index === order.statusHistory.length - 1;

                        return (
                          <li className={`order-timeline__entry order-timeline__entry--${entry.status}`} key={`${entry.changedAt}-${index}`} aria-current={isLatest ? 'step' : undefined}>
                            <span className="order-timeline__marker" aria-hidden="true" />
                            <div className="order-timeline__content">
                              <div>
                                <h3>{orderStatusLabels[entry.status]}</h3>
                                <time dateTime={entry.changedAt}>{formatOrderDate(entry.changedAt)}</time>
                              </div>
                              <p>{entry.note}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </section>
                </div>

                <aside className="order-detail-sidebar" aria-label="Thông tin nhận hàng và thanh toán">
                  <section className="order-detail-panel" aria-labelledby="order-recipient-title">
                    <div className="order-detail-panel__heading">
                      <h2 id="order-recipient-title">Thông tin nhận hàng</h2>
                    </div>
                    <address className="order-detail-address">
                      <strong>{order.recipient.name}</strong>
                      <p>{order.recipient.phone}</p>
                      <p>{[order.recipient.detail, order.recipient.ward, order.recipient.district, order.recipient.province].filter(Boolean).join(', ')}</p>
                    </address>
                    {order.recipient.note && <p className="order-detail-delivery-note">{order.recipient.note}</p>}
                    <div className="order-detail-customer">
                      <h3>Người đặt hàng</h3>
                      <p>{order.customer.name}</p>
                      <p>{order.customer.email}</p>
                    </div>
                  </section>

                  <section className="order-detail-panel" aria-labelledby="order-payment-title">
                    <div className="order-detail-panel__heading">
                      <h2 id="order-payment-title">Thanh toán</h2>
                    </div>
                    <p className="order-detail-payment-method">{orderPaymentMethodLabels[order.paymentMethod]}</p>
                    <span className={`order-detail-payment-status order-detail-payment-status--${order.paymentStatus}`}>
                      {orderPaymentStatusLabels[order.paymentStatus]}
                    </span>
                    {order.paidAt && <p className="order-detail-paid-at">Ngày thanh toán: <time dateTime={order.paidAt}>{formatOrderDate(order.paidAt)}</time></p>}
                    <dl className="order-detail-totals">
                      <div><dt>Tiền sản phẩm</dt><dd>{formatCartPrice(order.subtotal)}</dd></div>
                      <div><dt>Phí vận chuyển</dt><dd>{order.shippingFee === 0 ? 'Miễn phí' : formatCartPrice(order.shippingFee)}</dd></div>
                      <div><dt>Giảm giá</dt><dd>{order.discountAmount > 0 ? `−${formatCartPrice(order.discountAmount)}` : formatCartPrice(0)}</dd></div>
                      <div className="order-detail-totals__final"><dt>Tổng thanh toán</dt><dd>{formatCartPrice(order.totalAmount)}</dd></div>
                    </dl>
                  </section>
                </aside>
              </div>
            </>
          ) : (
            <div className="orders-empty order-detail-empty">
              <span className="orders-empty__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="m3 7 9-4 9 4v10l-9 4-9-4V7Z" />
                  <path d="m3 7 9 4 9-4M12 11v10M8 5l9 4" />
                </svg>
              </span>
              <h1>{storageError ? 'Chưa thể tải đơn hàng' : 'Không tìm thấy đơn hàng'}</h1>
              <p>{storageError ? 'Vui lòng tải lại trang để thử lại.' : 'Đơn hàng không tồn tại. Bạn hãy kiểm tra lại từ danh sách đơn hàng.'}</p>
              <Link to="/don-hang">Quay lại danh sách đơn hàng</Link>
              {storageError && <button type="button" onClick={() => window.location.reload()}>Tải lại trang</button>}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
