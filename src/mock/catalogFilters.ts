import { catalogProducts } from './catalogProducts';

export const productCategories = [
  { id: 'all', name: 'Tất cả sản phẩm' },
  { id: 'polo', name: 'Áo polo' },
  { id: 'tshirt', name: 'Áo thun' },
  { id: 'shirt', name: 'Áo sơ mi' },
  { id: 'pants', name: 'Quần đồng phục' },
  { id: 'jacket', name: 'Áo khoác' },
  { id: 'apron', name: 'Tạp dề' },
  { id: 'set', name: 'Bộ đồng phục' },
].map((category) => ({
  ...category,
  count: category.id === 'all'
      ? catalogProducts.length
      : catalogProducts.filter(
          (product) => product.category === category.id
      ).length,
}));

export const colorOptions = [
  { value: '', label: 'Tất cả màu' },
  { value: '#365349', label: 'Xanh lá' },
  { value: '#e4dfcd', label: 'Kem' },
  { value: '#22252a', label: 'Đen' },
  { value: '#394b68', label: 'Xanh navy' },
  { value: '#f1eee4', label: 'Trắng' },
  { value: '#a6a6a6', label: 'Xám' },
  { value: '#aa8568', label: 'Nâu' },
  { value: '#bacbd7', label: 'Xanh nhạt' },
];

export const materialOptions = [
  { value: '', label: 'Tất cả chất liệu' },
  { value: 'cotton', label: 'Cotton' },
  { value: 'kate', label: 'Vải Kate' },
  { value: 'kaki', label: 'Kaki' },
  { value: 'jean', label: 'Jean' },
  { value: 'polyester', label: 'Polyester' },
  { value: 'canvas', label: 'Canvas' },
];

export const priceOptions = [
  { value: '', label: 'Tất cả mức giá' },
  { value: 'under-200', label: 'Dưới 200.000đ' },
  { value: '200-400', label: '200.000đ - 400.000đ' },
  { value: '400-700', label: '400.000đ - 700.000đ' },
  { value: 'over-700', label: 'Trên 700.000đ' },
];

export const sizeOptions = [
  { value: '', label: 'Tất cả kích cỡ' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
];
