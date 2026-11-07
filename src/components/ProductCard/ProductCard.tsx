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
  let heartIconClass = 'fa-regular fa-heart';
  if (liked === true) {
    heartButtonClass = 'heart-btn active';
    heartIconClass = 'fa-solid fa-heart';
  }

  return (
    <div className="product-card">
      <div className="image-box">
        <img src={props.image} alt={props.name} />
        <button
          className={heartButtonClass}
          type="button"
          onClick={handleLike}
        >
          <i className={heartIconClass}></i>
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
