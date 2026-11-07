import './ProductPagination.scss';

type ProductPaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
};

export default function ProductPagination({ currentPage, totalItems, itemsPerPage, onPageChange }: ProductPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const firstItem = (currentPage - 1) * itemsPerPage + 1;
  const lastItem = Math.min(currentPage * itemsPerPage, totalItems);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="product-pagination">
      <p className="product-pagination__summary" role="status">
        Hiển thị {firstItem}–{lastItem} trong {totalItems} sản phẩm
      </p>
      <div
        className="product-pagination__progress"
        role="progressbar"
        aria-label="Số sản phẩm đã xem đến"
        aria-valuemin={0}
        aria-valuemax={totalItems}
        aria-valuenow={lastItem}
      >
        <span style={{ width: `${(lastItem / totalItems) * 100}%` }} />
      </div>

      <nav className="product-pagination__controls" aria-label="Chuyển trang sản phẩm">
        <button
          className="product-pagination__arrow"
          type="button"
          aria-label="Trang trước"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m12 5-5 5 5 5" />
          </svg>
        </button>

        {pageNumbers.map((page) => (
          <button
            className="product-pagination__number"
            key={page}
            type="button"
            aria-label={`Trang ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          className="product-pagination__arrow"
          type="button"
          aria-label="Trang sau"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m8 5 5 5-5 5" />
          </svg>
        </button>
      </nav>
    </div>
  );
}
