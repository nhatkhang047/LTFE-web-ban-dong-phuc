import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProductCard from '@/components/ProductCard';

import { catalogProducts } from '@/mock/catalogProducts';

import './ProductDetailPage.scss';

const mockReviews = [
    {
        id: 1,
        name: 'Nguyễn Minh Anh',
        rating: 5,
        date: '10/11/2026',
        comment: 'Sản phẩm rất đẹp, chất vải mềm và mặc rất thoải mái. Mình rất hài lòng với chất lượng.',
    },
    {
        id: 2,
        name: 'Trần Hoàng Nam',
        rating: 4,
        date: '08/11/2026',
        comment: 'Form áo đẹp, đường may chắc chắn. Sản phẩm phù hợp để làm đồng phục công ty.',
    },
    {
        id: 3,
        name: 'Lê Thảo Vy',
        rating: 5,
        date: '05/11/2026',
        comment: 'Màu sắc giống hình, giao diện sản phẩm rất đẹp. Sẽ tiếp tục ủng hộ VERDE.',
    },
];

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

    const relatedProducts = catalogProducts
        .filter((item) => {
            return item.category === product.category && item.id !== product.id;
        })
        .slice(0, 4);

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

                <section className="product-reviews">
                    <div className="product-section-heading">
                        <h2>Đánh giá khách hàng</h2>
                        <p>Những chia sẻ từ khách hàng đã trải nghiệm sản phẩm</p>
                    </div>

                    <div className="product-reviews__summary">
                        <div className="product-reviews__average">
                            <strong>{product.rating.toFixed(1)}</strong>
                            <span className="stars">★★★★★</span>
                            <p>{product.reviewCount} đánh giá</p>
                        </div>

                        <div className="product-reviews__list">
                            {mockReviews.map((review) => (
                                <div className="product-review-item" key={review.id}>
                                    <div className="product-review-item__top">
                                        <div>
                                            <h3>{review.name}</h3>
                                            <span>{review.date}</span>
                                        </div>

                                        <span className="stars">
                                            {'★'.repeat(review.rating)}
                                            {'☆'.repeat(5 - review.rating)}
                                        </span>
                                    </div>
                                    <p>{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {relatedProducts.length > 0 && (
                    <section className="related-products">
                        <div className="product-section-heading">
                            <h2>Sản phẩm liên quan</h2>
                            <p>Khám phá thêm những sản phẩm cùng danh mục</p>
                        </div>

                        <div className="related-products__grid">
                            {relatedProducts.map((item) => (
                                <ProductCard
                                    key={item.id}
                                    id={item.id}
                                    image={item.image}
                                    name={item.name}
                                    price={item.price}
                                    colors={item.colors}
                                />
                            ))}
                        </div>

                        <div className="related-products__more">
                            <Link to="/san-pham">
                                Xem tất cả sản phẩm
                            </Link>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
