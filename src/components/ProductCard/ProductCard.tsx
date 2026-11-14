import { useState } from 'react';
import './ProductCard.scss';

interface ProductCardProps {
  image: string;
  name: string;
  price: string | number;
  colors?: string[];
}

function ProductCard(props: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  const defaultColors = ['#c8c3bc', '#9d8067', '#5f696d', '#22252a'];
  let colors = props.colors;
  if (!colors) {
    colors = defaultColors;
  }

  function handleLike() {
    if (liked === true) {
      setLiked(false);
    } else {
      setLiked(true);
    }
  }

  function handleSelectColor(index: number) {
    setSelectedColor(index);
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
      </div>
    </div>
  );
}

export default ProductCard;
