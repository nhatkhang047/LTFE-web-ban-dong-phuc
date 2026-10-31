import { useState } from 'react';
import './ProductCard.scss';

interface Props {
  image: string;
  name: string;
  price: string | number;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
}

export default function ProductCard({ image, name, price, onAddToCart, onBuyNow }: Props) {
  const [liked, setLiked] = useState(false);

  function handleLike() {
    setLiked(!liked);
  }

  return (
    <div className="product-card">
      <div className="image-box">
        <img src={image} alt={name} />
        <button
          className={`heart-btn ${liked ? 'active' : ''}`}
          type="button"
          onClick={handleLike}
        >
          <i className={liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
        </button>
      </div>

      <div className="info-box">
        <h3 className="product-name">{name}</h3>
        <p className="product-price">{price}</p>

        <div className="button-group">
          <button className="btn-cart" type="button" onClick={onAddToCart}>
            <i className="fa-solid fa-cart-shopping"></i> Thêm vào giỏ hàng
          </button>
          <button className="btn-buy" type="button" onClick={onBuyNow}>
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}
