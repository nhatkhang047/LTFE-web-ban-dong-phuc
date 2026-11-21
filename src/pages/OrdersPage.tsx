import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProductPagination from '@/components/ProductPagination/ProductPagination';
import { orderStatusFilters, orderStatusLabels } from '@/constants/orders';
import { useOrders } from '@/features/orders/OrdersContext';
import type { OrderStatusFilter } from '@/types/order';
import { formatCartPrice } from '@/utils/cart';
import { formatOrderDate, getFilteredOrders, getOrderTotals } from '@/utils/orders';
import './ProductsPage.scss';
import './OrdersPage.scss';

export default function OrdersPage() {
  const { orders, storageError } = useOrders();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState(1);
  const listRef = useRef<HTMLElement>(null);
  const ordersPerPage = 8;
  const filteredOrders = getFilteredOrders(orders, selectedStatus, searchQuery);
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ordersPerPage));
  const currentPage = Math.min(selectedPage, totalPages);
  const firstOrderIndex = (currentPage - 1) * ordersPerPage;
  const ordersOnCurrentPage = filteredOrders.slice(firstOrderIndex, firstOrderIndex + ordersPerPage);

  useEffect(() => {
    document.title = 'Đơn hàng của tôi | VERDE';
  }, []);

  function handleStatusChange(status: OrderStatusFilter) {
    setSelectedStatus(status);
    setSelectedPage(1);
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setSelectedPage(1);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSelectedPage(1);
  }

  function resetFilters() {
    setSelectedStatus('all');
    setSearchQuery('');
    setSelectedPage(1);
  }

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    setSelectedPage(page);
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="catalog-page orders-page">
      <Header />

      <main className="catalog-main">
        <nav className="catalog-breadcrumb" aria-label="Đường dẫn trang">
          <ol>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/tai-khoan">Tài khoản</Link></li>
            <li aria-current="page">Đơn hàng của tôi</li>
          </ol>
        </nav>

        <div className="orders-container">
          <div className="orders-heading">
            <div>
              <h1>Đơn hàng của tôi <span>({orders.length})</span></h1>
              <p>Theo dõi và xem lại các đơn hàng của bạn.</p>
            </div>
            <Link to="/tai-khoan">Tài khoản của tôi</Link>
          </div>

          {storageError && <p className="orders-error" role="alert">{storageError}</p>}

          <div className="orders-status-tabs" role="group" aria-label="Lọc trạng thái đơn hàng">
            {orderStatusFilters.map((filter) => {
              const count = filter.value === 'all' ? orders.length : orders.filter((order) => order.status === filter.value).length;

              return (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={selectedStatus === filter.value}
                  onClick={() => handleStatusChange(filter.value)}
                >
                  {filter.label}<span>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="orders-toolbar">
            <p role="status">Tìm thấy <strong>{filteredOrders.length}</strong> đơn hàng</p>
            <form className="orders-search" role="search" onSubmit={handleSearchSubmit}>
              <button type="submit" aria-label="Tìm đơn hàng">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="10.5" cy="10.5" r="6" />
                  <path d="m15 15 5 5" />
                </svg>
              </button>
              <input
                type="search"
                name="orderSearch"
                autoComplete="off"
                aria-label="Tìm theo mã đơn hoặc tên sản phẩm"
                placeholder="Tìm mã đơn hoặc tên sản phẩm"
                value={searchQuery}
                onChange={(event) => handleSearchChange(event.target.value)}
              />
            </form>
          </div>

          <section className="orders-list" ref={listRef} aria-label="Danh sách đơn hàng">
            {filteredOrders.length > 0 ? (
              <>
                {ordersOnCurrentPage.map((order) => {
                  const totals = getOrderTotals(order.items, order.shippingFee, order.discountAmount);

                  return (
                    <article className="order-card" key={order.id} aria-labelledby={`order-title-${order.id}`}>
                      <div className="order-card__header">
                        <div>
                          <h2 id={`order-title-${order.id}`}>{order.code}</h2>
                          <p>Ngày đặt: <time dateTime={order.createdAt}>{formatOrderDate(order.createdAt)}</time></p>
                        </div>
                        <span className={`order-status order-status--${order.status}`}>{orderStatusLabels[order.status]}</span>
                      </div>

                      <div className="order-card__items">
                        {order.items.map((item) => (
                          <div className="order-item" key={item.id}>
                            <img src={item.image} alt={item.name} width="76" height="96" loading="lazy" />
                            <div className="order-item__information">
                              <h3>{item.name}</h3>
                              <div className="order-item__variant">
                                {item.color && (
                                  <span className="order-item__color">
                                    Màu sắc <span role="img" aria-label="Màu đã đặt" style={{ backgroundColor: item.color }} />
                                  </span>
                                )}
                                {item.size && <span>Kích cỡ: {item.size}</span>}
                              </div>
                              <p>Số lượng: {item.quantity}</p>
                            </div>
                            <div className="order-item__price">
                              <span>Đơn giá: {formatCartPrice(item.unitPrice)}</span>
                              <strong>{formatCartPrice(item.unitPrice * item.quantity)}</strong>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="order-card__footer">
                        <div className="order-card__payment">
                          <p>{totals.quantity} sản phẩm · {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}</p>
                          <span>{order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                        </div>
                        <div className="order-card__actions">
                          <p>Tổng tiền <strong>{formatCartPrice(order.totalAmount)}</strong></p>
                          <Link
                            className="order-card__detail-link"
                            to={`/don-hang/${encodeURIComponent(order.id)}`}
                            aria-label={`Xem chi tiết đơn ${order.code}`}
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}

                <ProductPagination
                  currentPage={currentPage}
                  totalItems={filteredOrders.length}
                  itemsPerPage={ordersPerPage}
                  onPageChange={handlePageChange}
                  itemLabel="đơn hàng"
                  navigationLabel="Chuyển trang đơn hàng"
                />
              </>
            ) : (
              <div className="orders-empty">
                <span className="orders-empty__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="m3 7 9-4 9 4v10l-9 4-9-4V7Z" />
                    <path d="m3 7 9 4 9-4M12 11v10M8 5l9 4" />
                  </svg>
                </span>
                {storageError && orders.length === 0 ? (
                  <>
                    <h2>Chưa thể hiển thị đơn hàng</h2>
                    <p>Vui lòng tải lại trang để thử lại.</p>
                    <button type="button" onClick={() => window.location.reload()}>Tải lại trang</button>
                  </>
                ) : orders.length === 0 ? (
                  <>
                    <h2>Bạn chưa có đơn hàng</h2>
                    <p>Khám phá các mẫu đồng phục dành cho tập thể của bạn.</p>
                    <Link to="/san-pham">Khám phá sản phẩm</Link>
                  </>
                ) : (
                  <>
                    <h2>Không tìm thấy đơn hàng phù hợp</h2>
                    <p>Thử từ khóa khác hoặc bỏ bộ lọc trạng thái.</p>
                    <button type="button" onClick={resetFilters}>Xóa bộ lọc</button>
                  </>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
