export type CatalogFilters = {
  color: string;
  material: string;
  price: string;
  size: string;
  sortOrder: string;
  gridColumns: 2 | 4;
};

export type CatalogProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  material: string;
  sizes: string[];
  colors: { name: string; value: string }[];
  addedAt: string;
};
