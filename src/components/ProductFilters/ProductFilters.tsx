import { useId, useState } from 'react';
import { colorOptions, materialOptions, priceOptions, sizeOptions } from '@/mock/catalogFilters';
import type { CatalogFilters } from '@/types/catalog';
import './ProductFilters.scss';

type FilterOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  const selectId = useId();
  const selectedOption = options.find((option) => option.value === value);

  return (
    <label className="catalog-filter-select" htmlFor={selectId}>
      <span className="catalog-filter-select__label" aria-hidden="true">{label}:</span>
      <span className="catalog-filter-select__value" aria-hidden="true">{selectedOption?.label}</span>
      <select
        id={selectId}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="m4 6 4 4 4-4" />
      </svg>
    </label>
  );
}

type ProductFiltersProps = {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
};

export default function ProductFilters({ filters, onChange }: ProductFiltersProps) {
  const [areAllFiltersVisible, setAreAllFiltersVisible] = useState(false);
  const selectedColor = filters.color;
  const selectedMaterial = filters.material;
  const selectedPrice = filters.price;
  const selectedSize = filters.size;
  const sortOrder = filters.sortOrder;
  const gridColumns = filters.gridColumns;

  function setSelectedColor(color: string) {
    onChange({ ...filters, color });
  }

  function setSelectedMaterial(material: string) {
    onChange({ ...filters, material });
  }

  function setSelectedPrice(price: string) {
    onChange({ ...filters, price });
  }

  function setSelectedSize(size: string) {
    onChange({ ...filters, size });
  }

  function setSortOrder(sortOrder: string) {
    onChange({ ...filters, sortOrder });
  }

  function setGridColumns(gridColumns: 2 | 4) {
    onChange({ ...filters, gridColumns });
  }

  const activeFilters = [];

  if (selectedColor) {
    const colorLabel = colorOptions.find((option) => option.value === selectedColor)?.label;
    activeFilters.push({ id: 'color', label: `Màu sắc: ${colorLabel}`, remove: () => setSelectedColor('') });
  }

  if (selectedMaterial) {
    const materialLabel = materialOptions.find((option) => option.value === selectedMaterial)?.label;
    activeFilters.push({ id: 'material', label: `Chất liệu: ${materialLabel}`, remove: () => setSelectedMaterial('') });
  }

  if (selectedSize) {
    activeFilters.push({ id: 'size', label: `Kích cỡ: ${selectedSize}`, remove: () => setSelectedSize('') });
  }

  if (selectedPrice) {
    const priceLabel = priceOptions.find((option) => option.value === selectedPrice)?.label;
    activeFilters.push({ id: 'price', label: `Giá: ${priceLabel}`, remove: () => setSelectedPrice('') });
  }

  function resetFilters() {
    onChange({ ...filters, color: '', material: '', price: '', size: '' });
  }

  function toggleAllFilters() {
    setAreAllFiltersVisible((previousVisibility) => !previousVisibility);
  }

  return (
    <section className="catalog-filters" aria-label="Bộ lọc sản phẩm">
      <div className="catalog-filters__toolbar">
        <div className="catalog-filters__quick">
          <button
            className="catalog-filters__toggle"
            type="button"
            onClick={toggleAllFilters}
            aria-expanded={areAllFiltersVisible}
            aria-controls="catalog-all-filters"
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5h14M3 10h14M3 15h14" />
              <path d="M7 3v4m6 1v4m-6 1v4" />
            </svg>
            Tất cả bộ lọc
            <span className="catalog-filters__count">{activeFilters.length}</span>
          </button>

          <FilterSelect label="Màu sắc" value={selectedColor} options={colorOptions} onChange={setSelectedColor} />
          <FilterSelect label="Chất liệu" value={selectedMaterial} options={materialOptions} onChange={setSelectedMaterial} />
          <FilterSelect label="Khoảng giá" value={selectedPrice} options={priceOptions} onChange={setSelectedPrice} />
        </div>

        <div className="catalog-filters__display">
          <div className="catalog-grid-toggle" role="group" aria-label="Số cột hiển thị">
            <button type="button" aria-label="Hiển thị 2 cột" aria-pressed={gridColumns === 2} onClick={() => setGridColumns(2)}>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM11 11h5v5h-5z" />
              </svg>
            </button>
            <button type="button" aria-label="Hiển thị 4 cột" aria-pressed={gridColumns === 4} onClick={() => setGridColumns(4)}>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 3h14v14H3zM3 8h14M3 12h14M8 3v14M12 3v14" />
              </svg>
            </button>
          </div>
          <span className="catalog-filters__sort-label">Sắp xếp theo:</span>
          <FilterSelect
            label="Sắp xếp"
            value={sortOrder}
            onChange={setSortOrder}
            options={[
              { value: 'featured', label: 'Nổi bật & Bán chạy nhất' },
              { value: 'newest', label: 'Mới nhất' },
              { value: 'price-ascending', label: 'Giá: Thấp đến cao' },
              { value: 'price-descending', label: 'Giá: Cao đến thấp' },
            ]}
          />
        </div>
      </div>

      <div className="catalog-filters__panel" id="catalog-all-filters" hidden={!areAllFiltersVisible}>
        <FilterSelect label="Màu sắc" value={selectedColor} options={colorOptions} onChange={setSelectedColor} />
        <FilterSelect label="Chất liệu" value={selectedMaterial} options={materialOptions} onChange={setSelectedMaterial} />
        <FilterSelect label="Khoảng giá" value={selectedPrice} options={priceOptions} onChange={setSelectedPrice} />
        <FilterSelect label="Kích cỡ" value={selectedSize} options={sizeOptions} onChange={setSelectedSize} />
      </div>

      {activeFilters.length > 0 && (
        <div className="catalog-filters__selected">
          <span className="catalog-filters__selected-label">Đang chọn:</span>
          {activeFilters.map((filter) => (
            <button className="catalog-filter-chip" key={filter.id} type="button" onClick={filter.remove} aria-label={`Bỏ bộ lọc ${filter.label}`}>
              {filter.label}<span aria-hidden="true">×</span>
            </button>
          ))}
          <button className="catalog-filters__reset" type="button" onClick={resetFilters}>Đặt lại tất cả</button>
        </div>
      )}
    </section>
  );
}
