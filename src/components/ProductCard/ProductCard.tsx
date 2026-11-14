import { useId, useState } from 'react';
import { useFavorites } from '@/features/favorites/FavoritesContext';
import { useCart } from '@/features/cart/CartContext';
import type { FavoriteProduct } from '@/types/favorites';
import { getProductPrice } from '@/utils/cart';
import './ProductCard.scss';

function ProductCard(props: FavoriteProduct) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  const liked = isFavorite(props.id);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(props.sizes?.[0] ?? '');
  const [hasAddedToCart, setHasAddedToCart] = useState(false);
  const sizeSelectId = useId();
  const productPrice = getProductPrice(props.price, props.priceValue);

  const defaultColors = ['#c8c3bc', '#9d8067', '#5f696d', '#22252a'];
  let colors = defaultColors;
  if (props.colors) {
    colors = props.colors;
  }

  function handleLike() {
    toggleFavorite({ ...props, colors });
  }

  function handleSelectColor(index: number) {
    setSelectedColor(index);
    setHasAddedToCart(false);
  }

  function handleAddToCart() {
    if (productPrice === null) {
      return;
    }

    addItem({
      id: props.id,
      image: props.image,
      name: props.name,
      priceValue: productPrice,
    }, colors[selectedColor] ?? '', selectedSize);
    setHasAddedToCart(true);
  }

  let heartButtonClass = 'heart-btn';
  if (liked === true) {
    heartButtonClass = 'heart-btn active';
  }

  return (
    <div className="product-card">
      <div className="image-box">
        <img src={props.image} alt={props.name} loading="lazy" width="360" height="480" />
        <button
          className={heartButtonClass}
          type="button"
          onClick={handleLike}
          aria-label={`${liked ? 'Bỏ yêu thích' : 'Yêu thích'} ${props.name}`}
          aria-pressed={liked}
        >
          <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} aria-hidden="true">
            <path d="M20.5 5.5a5 5 0 0 0-7.1 0L12 6.9l-1.4-1.4a5 5 0 0 0-7.1 7.1L12 21l8.5-8.4a5 5 0 0 0 0-7.1Z" />
          </svg>
        </button>
      </div>

      <div className="info-box">
        <h3 className="product-name">{props.name}</h3>
        <p className="product-price">{props.price}</p>

        <div className="product-card__options">
          <div className="color-list">
            {colors.map(function (color, index) {
              let dotClass = 'color-dot';
              if (selectedColor === index) {
                dotClass = 'color-dot active';
              }

              return (
                <button
                  key={index}
                  className={dotClass}
                  style={{ backgroundColor: color }}
                  type="button"
                  aria-label={`Chọn màu ${index + 1} cho ${props.name}`}
                  aria-pressed={selectedColor === index}
                  onClick={function () {
                    handleSelectColor(index);
                  }}
                />
              );
            })}
          </div>
          {props.sizes && props.sizes.length > 0 && (
            <label className="product-card__size" htmlFor={sizeSelectId}>
              Cỡ
              <select
                id={sizeSelectId}
                value={selectedSize}
                aria-label={`Kích cỡ cho ${props.name}`}
                onChange={(event) => {
                  setSelectedSize(event.target.value);
                  setHasAddedToCart(false);
                }}
              >
                {props.sizes.map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </label>
          )}
        </div>
        <button
          className="product-card__add-to-cart"
          type="button"
          disabled={productPrice === null}
          onClick={handleAddToCart}
          aria-label={`Thêm ${props.name} vào giỏ hàng`}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 8h16l-1 13H5L4 8Z" />
            <path d="M9 9V6a3 3 0 0 1 6 0v3" />
          </svg>
          Thêm vào giỏ
        </button>
        <p className="product-card__cart-feedback" role="status">
          {hasAddedToCart ? 'Đã thêm vào giỏ hàng' : ''}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;
