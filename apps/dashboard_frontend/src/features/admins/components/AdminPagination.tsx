import { Button } from "@/components/ui/button";
import { PER_PAGE_OPTIONS } from "../constants/admin.constants";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (value: number) => void;
}

const AdminPagination = ({
  currentPage,
  totalPages,
  perPage,
  onPageChange,
  onPerPageChange,
}: AdminPaginationProps) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const buttonBase =
    "w-11 h-11 rounded-2xl border-border bg-card text-foreground hover:bg-accent";

  return (
    <div className="flex items-center justify-between mt-6 px-1">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className={buttonBase}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          «
        </Button>

        <Button
          variant="outline"
          size="icon"
          className={`${buttonBase} text-lg`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </Button>

        {pageNumbers.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            className={`w-11 h-11 rounded-2xl text-base font-medium ${
              page === currentPage
                ? "bg-primary text-white border-transparent"
                : buttonBase
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          className={`${buttonBase} text-lg`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ›
        </Button>

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

      <select
        className="h-11 px-5 rounded-2xl border border-border bg-card text-foreground text-base outline-none cursor-pointer"
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

export default AdminPagination;
