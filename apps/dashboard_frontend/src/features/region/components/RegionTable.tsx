import { FiLoader } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RegionTableRow from "./RegionTableRow";
import type { RegionEntity } from "../types/region.types";

interface RegionTableProps {
  regions: RegionEntity[];
  isLoading: boolean;
  currentPage: number;
  perPage: number;
  orgId: string;
  deletingId: string | null;
  onDelete: (id: string) => void;
}

const TABLE_HEADS = [
  { label: "S.n", className: "w-24 py-5 px-7" },
  { label: "Regions", className: "py-5" },
  { label: "Options", className: "text-right py-5 pr-8" },
];

const RegionTable = ({
  regions,
  isLoading,
  currentPage,
  perPage,
  orgId,
  deletingId,
  onDelete,
}: RegionTableProps) => {
  const getSerialNumber = (index: number) =>
    String((currentPage - 1) * perPage + index + 1).padStart(2, "0");

  return (
    <div
      className="bg-card backdrop-blur-xl rounded-3xl
                    border border-border overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-sky-50/50 dark:bg-sky-950/30 border-b border-border hover:bg-sky-50/50 dark:hover:bg-sky-950/30">
            {TABLE_HEADS.map(({ label, className }) => (
              <TableHead
                key={label}
                className={`${className} text-muted-foreground font-semibold
                            text-sm tracking-widest uppercase`}
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-muted-foreground py-16 text-base"
              >
                <div className="flex items-center justify-center gap-2">
                  <FiLoader className="animate-spin text-lg text-blue-400" />
                  Loading regions…
                </div>
              </TableCell>
            </TableRow>
          )}

          {!isLoading && regions.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-muted-foreground py-16 text-base"
              >
                No regions found.
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            regions.map((region, index) => (
              <RegionTableRow
                key={region._id}
                region={region}
                serialNumber={getSerialNumber(index)}
                orgId={orgId}
                isDeleting={deletingId === region._id}
                onDelete={onDelete}
              />
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RegionTable;
