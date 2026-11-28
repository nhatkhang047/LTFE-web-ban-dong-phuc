import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/features/cart/CartContext';
import { useOrders } from '@/features/orders/OrdersContext';
import { catalogProducts } from '@/mock/catalogProducts';
import type { Order } from '@/types/order';
import { canCancelOrder, getOrderCartEntries } from '@/utils/orderActions';
import './OrderActions.scss';

type OrderActionsProps = {
  order: Order;
  children?: ReactNode;
  onCancelled?: (code: string) => void;
};

type ActionFeedback = {
  type: 'success' | 'error';
  message: string;
  showCartLink?: boolean;
};

export default function OrderActions({ order, children, onCancelled }: OrderActionsProps) {
  const { cancelOrder, getOrderById } = useOrders();
  const { addItems } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogId = useId();
  const [reason, setReason] = useState('');
  const [cancelError, setCancelError] = useState('');
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);

  function openCancelDialog() {
    const currentOrder = getOrderById(order.id);

    if (!currentOrder || !canCancelOrder(currentOrder)) {
      setFeedback({ type: 'error', message: 'Chỉ có thể hủy đơn hàng đang chờ xác nhận.' });
      return;
    }

    setFeedback(null);
    setReason('');
    setCancelError('');
    dialogRef.current?.showModal();
  }

  function resetCancelForm() {
    setReason('');
    setCancelError('');
  }

  function handleCancelSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      cancelOrder(order.id, reason);
      dialogRef.current?.close();

      if (onCancelled) {
        setFeedback(null);
        onCancelled(order.code);
      } else {
        setFeedback({ type: 'success', message: `Đã hủy đơn ${order.code}.` });
      }
    } catch (error) {
      setCancelError(error instanceof Error ? error.message : 'Không thể hủy đơn hàng. Vui lòng thử lại.');
    }
  }

  function handleBuyAgain() {
    try {
      const currentOrder = getOrderById(order.id);

      if (!currentOrder) {
        throw new Error('Không tìm thấy đơn hàng để mua lại.');
      }

      const entries = getOrderCartEntries(currentOrder, catalogProducts);
      addItems(entries);
      setFeedback({ type: 'success', message: 'Đã thêm sản phẩm vào giỏ hàng.', showCartLink: true });
    } catch (error) {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.' });
    }
  }

  return (
    <div className="order-actions">
      <div className="order-actions__buttons">
        {children}
        {canCancelOrder(order) && (
          <button className="order-actions__button order-actions__button--cancel" type="button" onClick={openCancelDialog} aria-label={`Hủy đơn ${order.code}`}>
            Hủy đơn
          </button>
        )}
        <button className="order-actions__button order-actions__button--buy" type="button" onClick={handleBuyAgain} aria-label={`Mua lại đơn ${order.code}`}>
          Mua lại
        </button>
      </div>

      {feedback && (
        <p className={`order-actions__feedback order-actions__feedback--${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>
          {feedback.message}
          {feedback.showCartLink && <Link to="/gio-hang">Xem giỏ hàng</Link>}
        </p>
      )}

      <dialog className="order-action-dialog" ref={dialogRef} aria-labelledby={`${dialogId}-title`} aria-describedby={`${dialogId}-description`} onClose={resetCancelForm}>
        <div className="order-action-dialog__heading">
          <h2 id={`${dialogId}-title`}>Hủy đơn hàng?</h2>
          <button type="button" aria-label="Đóng xác nhận hủy đơn" onClick={() => dialogRef.current?.close()}>×</button>
        </div>
        <p id={`${dialogId}-description`}>Bạn muốn hủy đơn <strong>{order.code}</strong>? Vui lòng cho biết lý do trước khi xác nhận.</p>
        <form onSubmit={handleCancelSubmit}>
          <label htmlFor={`${dialogId}-reason`}>Lý do hủy đơn</label>
          <textarea
            id={`${dialogId}-reason`}
            name="cancellationReason"
            rows={3}
            maxLength={300}
            placeholder="Nhập lý do hủy đơn hàng"
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              setCancelError('');
            }}
            autoFocus
            required
          />
          {cancelError && <p className="order-action-dialog__error" role="alert">{cancelError}</p>}
          <div className="order-action-dialog__buttons">
            <button className="order-actions__button" type="button" onClick={() => dialogRef.current?.close()}>Giữ đơn hàng</button>
            <button className="order-actions__button order-actions__button--confirm" type="submit">Xác nhận hủy</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
