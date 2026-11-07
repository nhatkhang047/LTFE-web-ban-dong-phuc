import type { CatalogProduct } from '@/types/catalog';
import cardiganImage from '@/assets/catalog/cardigan.svg';
import jumpsuitImage from '@/assets/catalog/jumpsuit.svg';
import slipDressImage from '@/assets/catalog/slip-dress.svg';
import blazerImage from '@/assets/catalog/blazer.svg';
import sweaterImage from '@/assets/catalog/sweater.svg';
import knitDressImage from '@/assets/catalog/knit-dress.svg';
import skirtImage from '@/assets/catalog/skirt.svg';
import loafersImage from '@/assets/catalog/loafers.svg';
import shirtImage from '@/assets/products/shirt.svg';
import handbagImage from '@/assets/catalog/handbag.svg';
import trousersImage from '@/assets/catalog/trousers.svg';
import scarfImage from '@/assets/catalog/scarf.svg';

export const catalogProducts: CatalogProduct[] = [
  {
    id: 'ribbed-cardigan', name: 'Cardigan Cashmere Cổ Gân', image: cardiganImage, price: 229,
    category: 'knitwear', material: 'cashmere', sizes: ['S', 'M', 'L', 'XL'], addedAt: '2026-10-01',
    colors: [{ name: 'brown', value: '#665044' }, { name: 'cream', value: '#c9b28e' }, { name: 'black', value: '#30312e' }],
  },
  {
    id: 'linen-jumpsuit', name: 'Quần Liền Ống Rộng Xếp Ly', image: jumpsuitImage, price: 89,
    category: 'dresses', material: 'linen', sizes: ['XS', 'S', 'M', 'L'], addedAt: '2026-10-05',
    colors: [{ name: 'cream', value: '#eee6d2' }, { name: 'green', value: '#7e886f' }, { name: 'black', value: '#30312e' }],
  },
  {
    id: 'silk-slip-dress', name: 'Váy Hai Dây Satin Lụa', image: slipDressImage, price: 99,
    category: 'dresses', material: 'silk', sizes: ['XS', 'S', 'M', 'L'], addedAt: '2026-10-09',
    colors: [{ name: 'cream', value: '#c9b79b' }, { name: 'black', value: '#253842' }],
  },
  {
    id: 'tailored-blazer', name: 'Áo Blazer Dáng Rộng May Đo', image: blazerImage, price: 129,
    category: 'outerwear', material: 'wool', sizes: ['S', 'M', 'L', 'XL'], addedAt: '2026-10-12',
    colors: [{ name: 'green', value: '#68756e' }, { name: 'brown', value: '#b49675' }, { name: 'black', value: '#30312e' }],
  },
  {
    id: 'cashmere-sweater', name: 'Áo Len Cổ Tròn Cashmere Tối Giản', image: sweaterImage, price: 169,
    category: 'knitwear', material: 'cashmere', sizes: ['S', 'M', 'L', 'XL', 'XXL'], addedAt: '2026-10-15',
    colors: [{ name: 'brown', value: '#bb9c76' }, { name: 'cream', value: '#e0d6c5' }, { name: 'green', value: '#7a8570' }],
  },
  {
    id: 'knit-midi-dress', name: 'Váy Len Dệt Phối Linen', image: knitDressImage, price: 199,
    category: 'dresses', material: 'linen', sizes: ['XS', 'S', 'M', 'L'], addedAt: '2026-10-18',
    colors: [{ name: 'cream', value: '#c5b79b' }, { name: 'brown', value: '#b16e47' }, { name: 'black', value: '#30312e' }],
  },
  {
    id: 'pleated-skirt', name: 'Chân Váy Xếp Ly Màu Rừng Sâu', image: skirtImage, price: 85,
    category: 'bottoms', material: 'cotton', sizes: ['XS', 'S', 'M', 'L', 'XL'], addedAt: '2026-10-21',
    colors: [{ name: 'green', value: '#52634b' }, { name: 'brown', value: '#b16643' }],
  },
  {
    id: 'leather-loafers', name: 'Giày Loafer Da Ý Cao Cấp', image: loafersImage, price: 109,
    category: 'accessories', material: 'leather', sizes: [], addedAt: '2026-10-23',
    colors: [{ name: 'brown', value: '#684b36' }, { name: 'black', value: '#30312e' }],
  },
  {
    id: 'relaxed-shirt', name: 'Áo Sơ Mi Lụa Tằm Phom Rộng', image: shirtImage, price: 115,
    category: 'tops', material: 'silk', sizes: ['XS', 'S', 'M', 'L', 'XL'], addedAt: '2026-10-26',
    colors: [{ name: 'white', value: '#f1eee4' }, { name: 'green', value: '#7c8972' }],
  },
  {
    id: 'structured-handbag', name: 'Túi Xách Da Đeo Vai Cấu Trúc', image: handbagImage, price: 119,
    category: 'accessories', material: 'leather', sizes: [], addedAt: '2026-10-29',
    colors: [{ name: 'brown', value: '#946b48' }, { name: 'green', value: '#64745c' }],
  },
  {
    id: 'relaxed-trousers', name: 'Quần Dài Linen Dây Rút Thoải Mái', image: trousersImage, price: 159,
    category: 'bottoms', material: 'linen', sizes: ['S', 'M', 'L', 'XL', 'XXL'], addedAt: '2026-11-02',
    colors: [{ name: 'cream', value: '#d1c2a5' }, { name: 'white', value: '#f1eee4' }, { name: 'green', value: '#64745c' }],
  },
  {
    id: 'cashmere-scarf', name: 'Khăn Choàng Du Lịch Cashmere', image: scarfImage, price: 129,
    category: 'accessories', material: 'cashmere', sizes: [], addedAt: '2026-11-05',
    colors: [{ name: 'black', value: '#75766f' }, { name: 'brown', value: '#b49675' }],
  },
];
