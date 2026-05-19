// features/organization/components/OrganizationPagination.tsx

import { Button } from "@/components/ui/button";
import { PER_PAGE_OPTIONS } from "../constants/organization.constants";

interface OrganizationPaginationProps {
  currentPage: number;
  totalPages: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (value: number) => void;
}

const OrganizationPagination = ({
  currentPage,
  totalPages,
  perPage,
  onPageChange,
  onPerPageChange,
}: OrganizationPaginationProps) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const buttonBase =
    "w-11 h-11 rounded-2xl border-blue-100 bg-white/75 text-slate-600";

  return (
    <div className="flex items-center justify-between mt-6 px-1">
      {/* Page Navigation */}
      <div className="flex items-center gap-2">
        {/* First */}
        <Button
          variant="outline"
          size="icon"
          className={buttonBase}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          «
        </Button>

        {/* Previous */}
        <Button
          variant="outline"
          size="icon"
          className={`${buttonBase} text-lg`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </Button>

        {/* Page Numbers */}
        {pageNumbers.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            className={`w-11 h-11 rounded-2xl text-base font-medium ${
              page === currentPage
                ? "bg-primary text-white border-slate-800"
                : buttonBase
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          className={`${buttonBase} text-lg`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ›
        </Button>

        {/* Last */}
        <Button
          variant="outline"
          size="icon"
          className={buttonBase}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          »
        </Button>
      </div>

      {/* Per Page Selector */}
      <select
        className="h-11 px-5 rounded-2xl border border-blue-100 
                   bg-white/75 text-slate-600 text-base outline-none cursor-pointer"
        value={perPage}
        onChange={(e) => onPerPageChange(Number(e.target.value))}
      >
        {PER_PAGE_OPTIONS.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OrganizationPagination;