import { catalogProducts } from './catalogProducts';

export const productCategories = [
  { id: 'all', name: 'Tất cả sản phẩm' },
  { id: 'knitwear', name: 'Áo len & Cashmere' },
  { id: 'dresses', name: 'Váy đầm & Jumpsuit' },
  { id: 'bottoms', name: 'Quần dài & Chân váy' },
  { id: 'outerwear', name: 'Áo khoác & Blazer' },
  { id: 'accessories', name: 'Phụ kiện' },
].map((category) => ({
  ...category,
  count: category.id === 'all'
    ? catalogProducts.length
    : catalogProducts.filter((product) => product.category === category.id).length,
}));

export const colorOptions = [
  { value: '', label: 'Tất cả màu' },
  { value: 'green', label: 'Xanh lá' },
  { value: 'cream', label: 'Kem' },
  { value: 'black', label: 'Đen' },
  { value: 'brown', label: 'Nâu' },
  { value: 'white', label: 'Trắng' },
];

export const materialOptions = [
  { value: '', label: 'Tất cả chất liệu' },
  { value: 'cashmere', label: 'Cashmere' },
  { value: 'cotton', label: 'Cotton' },
  { value: 'linen', label: 'Linen' },
  { value: 'silk', label: 'Lụa' },
  { value: 'wool', label: 'Len' },
  { value: 'leather', label: 'Da' },
];

export const priceOptions = [
  { value: '', label: 'Tất cả mức giá' },
  { value: 'under-50', label: 'Dưới $50' },
  { value: '50-250', label: '$50 - $250' },
  { value: '250-500', label: '$250 - $500' },
  { value: 'over-500', label: 'Trên $500' },
];

export const sizeOptions = [
  { value: '', label: 'Tất cả kích cỡ' },
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
];
