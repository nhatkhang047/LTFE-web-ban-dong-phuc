import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { useCart } from '@/features/cart/CartContext';
import { formatCartPrice } from '@/utils/cart';
import './ProductsPage.scss';
import './CartPage.scss';

export default function CartPage() {
  const { items, totalQuantity, totalPrice, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    document.title = 'Giỏ hàng | VERDE';
  }, []);

  return (
    <div className="catalog-page cart-page">
      <Header />

      <main className="catalog-main">
        <nav className="catalog-breadcrumb" aria-label="Đường dẫn trang">
          <ol>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/san-pham">Sản phẩm</Link></li>
            <li aria-current="page">Giỏ hàng</li>
          </ol>
        </nav>

        <div className="cart-container">
          <div className="cart-heading">
            <div>
              <h1>Giỏ hàng <span>({totalQuantity})</span></h1>
              <p>Những lựa chọn cho tập thể của bạn.</p>
            </div>
            <Link to="/san-pham">Tiếp tục mua sắm <span aria-hidden="true">→</span></Link>
          </div>

          {items.length > 0 ? (
            <div className="cart-content">
              <section aria-label="Sản phẩm trong giỏ hàng">
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th scope="col">Sản phẩm</th>
                      <th scope="col">Đơn giá</th>
                      <th scope="col">Số lượng</th>
                      <th scope="col">Thành tiền</th>
                      <th scope="col"><span className="cart-visually-hidden">Xóa</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="cart-product">
                            <img src={item.image} alt={item.name} width="88" height="112" />
                            <div>
                              <h2>{item.name}</h2>
                              {item.color && (
                                <p className="cart-product__color">
                                  Màu sắc <span style={{ backgroundColor: item.color }} aria-label="Màu đã chọn" role="img" />
                                </p>
                              )}
                              {item.size && <p>Kích cỡ: {item.size}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="cart-price">{formatCartPrice(item.unitPrice)}</td>
                        <td>
                          <div className="cart-quantity">
                            <button
                              type="button"
                              disabled={item.quantity <= 1}
                              aria-label={`Giảm số lượng ${item.name}`}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >−</button>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={item.quantity}
                              aria-label={`Số lượng ${item.name}`}
                              onChange={(event) => updateQuantity(item.id, event.target.valueAsNumber)}
                            />
                            <button
                              type="button"
                              aria-label={`Tăng số lượng ${item.name}`}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >+</button>
                          </div>
                        </td>
                        <td className="cart-price cart-price--total">{formatCartPrice(item.unitPrice * item.quantity)}</td>
                        <td>
                          <button className="cart-remove" type="button" aria-label={`Xóa ${item.name} khỏi giỏ hàng`} onClick={() => removeItem(item.id)}>
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6m4-6v6" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <aside className="cart-summary" aria-label="Tổng tiền giỏ hàng">
                <h2>Tóm tắt giỏ hàng</h2>
                <dl>
                  <div><dt>Số lượng</dt><dd>{totalQuantity} sản phẩm</dd></div>
                  <div><dt>Tạm tính</dt><dd>{formatCartPrice(totalPrice)}</dd></div>
                  <div className="cart-summary__total"><dt>Tổng tiền sản phẩm</dt><dd aria-live="polite">{formatCartPrice(totalPrice)}</dd></div>
                </dl>
                <p>Chưa bao gồm phí vận chuyển.</p>
                <Link className="cart-button" to="/san-pham">Tiếp tục mua sắm</Link>
              </aside>
            </div>
          ) : (
            <div className="cart-empty" role="status">
              <span className="cart-empty__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 8h16l-1 13H5L4 8Z" />
                  <path d="M9 9V6a3 3 0 0 1 6 0v3" />
                </svg>
              </span>
              <h2>Giỏ hàng của bạn đang trống</h2>
              <p>Khám phá và thêm những mẫu đồng phục bạn yêu thích vào giỏ hàng.</p>
              <Link className="cart-button" to="/san-pham">Khám phá sản phẩm</Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
