import ProductCard from "../../components/ProductCard";
import "./Products.scss";

interface Product {
    id: number;
    image: string;
    name: string;
    price: string;
    colors: string[];
}

function Products() {
    const products: Product[] = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
            name: "Áo thun basic VERDE",
            price: "350.000đ",
            colors: ["#c8c3bc", "#9d8067", "#5f696d", "#22252a"]
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600",
            name: "Áo sơ mi nam VERDE",
            price: "550.000đ",
            colors: ["#eeeeee", "#a8b5a0", "#22252a"]
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600",
            name: "Quần jean VERDE",
            price: "690.000đ",
            colors: ["#394b68", "#22252a", "#a6a6a6"]
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
            name: "Áo khoác thời trang",
            price: "890.000đ",
            colors: ["#9d8067", "#22252a"]
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600",
            name: "Áo thun nữ VERDE",
            price: "320.000đ",
            colors: ["#e8dcd0", "#d4b5a0", "#22252a"]
        },
        {
            id: 6,
            image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600",
            name: "Áo khoác basic",
            price: "750.000đ",
            colors: ["#a8a8a8", "#9d8067", "#22252a"]
        },
        {
            id: 7,
            image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
            name: "Trang phục thời trang",
            price: "620.000đ",
            colors: ["#d8c6b5", "#22252a"]
        },
        {
            id: 8,
            image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600",
            name: "Áo sơ mi nữ VERDE",
            price: "490.000đ",
            colors: ["#eeeeee", "#c8c3bc", "#9d8067"]
        }
    ];

    return (
        <main className="products-page">

            {/* Breadcrumb */}
            <div className="products-breadcrumb">
                <span>Trang chủ</span>
                <span>/</span>
                <span>Sản phẩm</span>
            </div>

            {/* Page heading */}
            <div className="products-heading">
                <h1>TẤT CẢ SẢN PHẨM</h1>
                <p>
                    Khám phá bộ sưu tập thời trang VERDE
                    dành cho phong cách sống hiện đại.
                </p>
            </div>

            {/* Product count */}
            <div className="products-toolbar">
                <span>{products.length} sản phẩm</span>
            </div>

            {/* Product list */}
            <div className="products-grid">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={`collection-${product.id}`}
                        image={product.image}
                        name={product.name}
                        price={product.price}
                        colors={product.colors}
                    />
                ))}
            </div>

        </main>
    );
}

export default Products;
