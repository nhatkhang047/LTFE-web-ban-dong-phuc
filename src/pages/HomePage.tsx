import { useEffect } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProductCard from '@/components/ProductCard';
import uniformIllustration from '@/assets/uniform-illustration.svg';
import { homeProducts } from '@/mock/homeProducts';
import './HomePage.scss';

export default function HomePage() {
  useEffect(() => {
    document.title = 'Trang chủ | VERDE - Đồng phục';
  }, []);

  return (
    <div className="home-page">
      <Header />

      <main>
        <section className="home-hero" aria-labelledby="home-title">
          <div className="home-hero__content">
            <span className="home-eyebrow">VERDE UNIFORMS</span>
            <h1 id="home-title">Cùng một màu áo.<br />Cùng một tinh thần.</h1>
            <p>
              Đồng phục chỉn chu cho mỗi ngày làm việc, học tập và kết nối.
              Cùng VERDE tạo nên dấu ấn riêng cho tập thể của bạn.
            </p>
            <a className="home-hero__button" href="#san-pham">
              Khám phá sản phẩm <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="home-hero__visual">
            <img
              src={uniformIllustration}
              alt="Áo polo đồng phục màu xanh đậm và kem"
              width="560"
              height="400"
            />
            <span>Mặc đồng điệu. Thêm gắn kết.</span>
          </div>
        </section>

        <section className="home-categories" aria-labelledby="home-categories-title">
          <div className="home-section-heading">
            <div>
              <span className="home-eyebrow">DÀNH CHO TẬP THỂ CỦA BẠN</span>
              <h2 id="home-categories-title">Đồng phục cho mọi ngày</h2>
            </div>
            <p>Mỗi tập thể, một phong cách riêng.</p>
          </div>
          <div className="home-categories__grid">
            <article className="home-category">
              <span className="home-category__number">01</span>
              <h3>Đồng phục doanh nghiệp</h3>
              <p>Chuyên nghiệp nơi công sở, đồng điệu cùng đội ngũ.</p>
            </article>
            <article className="home-category">
              <span className="home-category__number">02</span>
              <h3>Đồng phục học đường</h3>
              <p>Thoải mái đến lớp, tự tin trong từng hoạt động.</p>
            </article>
            <article className="home-category">
              <span className="home-category__number">03</span>
              <h3>Đồng phục dịch vụ</h3>
              <p>Gọn gàng, tiện dụng cho mỗi ngày làm việc.</p>
            </article>
          </div>
        </section>

        <section className="home-products" id="san-pham" aria-labelledby="home-products-title">
          <div className="home-section-heading">
            <div>
              <span className="home-eyebrow">THIẾT KẾ ĐƠN GIẢN, DỄ ĐỒNG ĐIỆU</span>
              <h2 id="home-products-title">Gợi ý cho tập thể bạn</h2>
            </div>
            <span className="home-products__count">4 sản phẩm</span>
          </div>
          <div className="home-products__grid">
            {homeProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                name={product.name}
                price={product.price}
                colors={product.colors}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
