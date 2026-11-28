import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProductCard from '@/components/ProductCard';
import { catalogProducts } from '@/mock/catalogProducts';
import './SearchPage.scss';

function normalizeText(value: string) {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .trim();
}

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('q') ?? '';

    const normalizedKeyword = normalizeText(keyword);

    const searchResults = catalogProducts.filter((product) => {
        const searchableText = normalizeText(
            `${product.name} ${product.category} ${product.material} ${product.description}`
        );

        return searchableText.includes(normalizedKeyword);
    });

    useEffect(() => {
        document.title = `Tìm kiếm: ${keyword} | VERDE`;
    }, [keyword]);

    return (
        <div className="search-page">
            <Header />

            <main className="search-main">
                <nav className="search-breadcrumb" aria-label="Đường dẫn trang">
                    <Link to="/">Trang chủ</Link>
                    <span>/</span>
                    <span>Tìm kiếm</span>
                </nav>

                <section className="search-heading">
                    <p className="search-heading__subtitle">VERDE COLLECTION</p>
                    <h1>Kết quả tìm kiếm</h1>
                    <p>
                        Từ khóa: <strong>{keyword}</strong>
                    </p>
                    <span>{searchResults.length} sản phẩm được tìm thấy</span>
                </section>

                {searchResults.length > 0 ? (
                    <div className="search-product-grid">
                        {searchResults.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                image={product.image}
                                name={product.name}
                                price={product.price}
                                colors={product.colors}
                                sizes={product.sizes}
                                priceValue={product.priceValue}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="search-empty">
                        <div className="search-empty__icon">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="10.5" cy="10.5" r="6" />
                                <path d="m15 15 5 5" />
                            </svg>
                        </div>

                        <h2>Không tìm thấy sản phẩm</h2>
                        <p>
                            Rất tiếc, chúng tôi không tìm thấy sản phẩm phù hợp với từ khóa
                            "{keyword}".
                        </p>
                        <Link to="/san-pham">Khám phá tất cả sản phẩm</Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
