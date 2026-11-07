import poloImage from '@/assets/products/polo.svg';
import shirtImage from '@/assets/products/shirt.svg';
import tshirtImage from '@/assets/products/tshirt.svg';
import apronImage from '@/assets/products/apron.svg';

export const homeProducts = [
  {
    id: 'polo-uniform',
    image: poloImage,
    name: 'Áo polo đồng phục phối cổ',
    price: '189.000 ₫',
    colors: ['#365349', '#e4dfcd', '#28364b'],
  },
  {
    id: 'office-shirt',
    image: shirtImage,
    name: 'Áo sơ mi đồng phục công sở',
    price: '259.000 ₫',
    colors: ['#bacbd7', '#f0ece2', '#d7d0c7'],
  },
  {
    id: 'team-tshirt',
    image: tshirtImage,
    name: 'Áo thun đồng phục tập thể',
    price: '149.000 ₫',
    colors: ['#eee5d4', '#74856b', '#343b3b'],
  },
  {
    id: 'service-apron',
    image: apronImage,
    name: 'Tạp dề đồng phục dịch vụ',
    price: '129.000 ₫',
    colors: ['#aa8568', '#4d6353', '#353c3a'],
  },
];
