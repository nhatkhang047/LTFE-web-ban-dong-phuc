export type CatalogFilters = {
  color: string;
  material: string;
  price: string;
  size: string;
  sortOrder: string;
  gridColumns: 2 | 4;
};

export type CatalogProduct = {
  id: number;
  image: string;
  name: string;
  price: string;
  colors: string[];
  priceValue: number;
  category: string;
  material: string;
  sizes: string[];
  addedAt: string;
};
