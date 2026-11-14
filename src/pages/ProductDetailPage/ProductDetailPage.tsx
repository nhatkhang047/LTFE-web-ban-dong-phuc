import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

import { catalogProducts } from '@/mock/catalogProducts';

import './ProductDetailPage.scss';

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();

    const product = catalogProducts.find(
        (item) => item.id === Number(id)
    );

    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        if (product) {
            setSelectedColor(product.colors[0] ?? '');
            setSelectedSize('');
            setQuantity(1);
            setSelectedImage(product.images[0] || product.image);
        }
    }, [product]);

    useEffect(() => {
        if (product) {
            document.title = `${product.name} | VERDE`;
        }
    }, [product]);

    if (!product) {
        return (
            <div className="product-detail-page">
                <Header />

                <main className="product-detail-not-found">
                    <h1>Không tìm thấy sản phẩm</h1>
                    <p>Sản phẩm bạn đang tìm kiếm không tồn tại.</p>
                    <Link to="/san-pham">
                        Quay lại cửa hàng
                    </Link>
                </main>

                <Footer />
            </div>
        );
    }

    const productImages = product.images.length > 0
        ? product.images
        : [product.image];

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Vui lòng chọn kích thước sản phẩm!');
            return;
        }

        alert(
            `Đã thêm ${product.name} vào giỏ hàng!\n` +
            `Màu sắc: ${selectedColor}\n` +
            `Kích thước: ${selectedSize}\n` +
            `Số lượng: ${quantity}`
        );
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            alert('Vui lòng chọn kích thước sản phẩm!');
            return;
        }

        alert('Chức năng mua hàng đang được minh họa.');
    };

    return (
        <div className="product-detail-page">
            <Header />

            <main className="product-detail-main">
                {/* Breadcrumb */}
                <nav className="product-detail-breadcrumb">
                    <Link to="/">Trang chủ</Link>
                    <span>/</span>
                    <Link to="/san-pham">Cửa hàng</Link>
                    <span>/</span>
                    <span>{product.name}</span>
                </nav>

                {/* Product information */}
                <section className="product-detail-content">

                    {/* Product gallery */}
                    <div className="product-detail-gallery">
                        <div className="product-detail-gallery__main">
                            <img
                                src={selectedImage || product.image}
                                alt={product.name}
                            />
                        </div>

                        <div className="product-detail-gallery__thumbnails">
                            {productImages.map((image, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={
                                        selectedImage === image
                                            ? 'active'
                                            : ''
                                    }
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product information */}
                    <div className="product-detail-info">
                        <p className="product-detail-info__category">
                            {product.category.toUpperCase()}
                        </p>

                        <h1>{product.name}</h1>

                        <div className="product-detail-info__rating">
                            <span className="stars">★★★★★</span>
                            <span>{product.rating}/5</span>
                            <span>
                                ({product.reviewCount} đánh giá)
                            </span>
                        </div>

                        <p className="product-detail-info__price">
                            {product.price}
                        </p>

                        <p className="product-detail-info__description">
                            {product.description}
                        </p>

                        <div className="product-detail-option">
                            <h3>
                                Màu sắc:
                                <span>{selectedColor}</span>
                            </h3>

                            <div className="product-detail-colors">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={
                                            selectedColor === color
                                                ? 'active'
                                                : ''
                                        }
                                        style={{ backgroundColor: color }}
                                        onClick={() => setSelectedColor(color)}
                                        aria-label={`Chọn màu ${color}`}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="product-detail-option">
                            <h3>Kích thước:</h3>

                            <div className="product-detail-sizes">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        className={
                                            selectedSize === size
                                                ? 'active'
                                                : ''
                                        }
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="product-detail-option">
                            <h3>Số lượng:</h3>

                            <div className="product-detail-quantity">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity((prev) =>
                                            Math.max(1, prev - 1)
                                        )
                                    }
                                >
                                    −
                                </button>

                                <span>{quantity}</span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity((prev) => prev + 1)
                                    }
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="product-detail-actions">
                            <button
                                type="button"
                                className="product-detail-actions__add"
                                onClick={handleAddToCart}
                            >
                                Thêm vào giỏ hàng
                            </button>

                            <button
                                type="button"
                                className="product-detail-actions__buy"
                                onClick={handleBuyNow}
                            >
                                Mua ngay
                            </button>
                        </div>

                        <div className="product-detail-policy">
                            <p>✓ Chất liệu chất lượng</p>
                            <p>✓ Thiết kế hiện đại, thoải mái</p>
                            <p>✓ Phù hợp cho đồng phục doanh nghiệp</p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
