// features/organization/components/OrganizationTable.tsx

import { FiLoader } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrganizationTableRow from "./OrganizationTableRow";
import type { OrganizationEntity } from "../types/organization.types";

interface OrganizationTableProps {
  organizations: OrganizationEntity[];
  isLoading: boolean;
  currentPage: number;
  perPage: number;
  deletingId: string | null;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const TABLE_HEADS = [
  { label: "S.n", className: "w-24 py-5 px-7" },
  { label: "Organizations", className: "py-5" },
  { label: "Options", className: "text-right py-5 pr-8" },
];

const OrganizationTable = ({
  organizations,
  isLoading,
  currentPage,
  perPage,
  deletingId,
  onDelete,
  onAdd,
}: OrganizationTableProps) => {
  const getSerialNumber = (index: number) =>
    String((currentPage - 1) * perPage + index + 1).padStart(2, "0");

  return (
    <div
      className="bg-white/60 backdrop-blur-xl rounded-3xl 
                    border border-white/80 overflow-hidden"
    >
      <Table>
        {/* Head */}
        <TableHeader>
          <TableRow className="bg-sky-50/50 border-b border-blue-100/50 hover:bg-sky-50/50">
            {TABLE_HEADS.map(({ label, className }) => (
              <TableHead
                key={label}
                className={`${className} text-slate-400 font-semibold 
                            text-sm tracking-widest uppercase`}
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>
          {/* Loading */}
          {isLoading && (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-slate-400 py-16 text-base"
              >
                <div className="flex items-center justify-center gap-2">
                  <FiLoader className="animate-spin text-lg text-blue-400" />
                  Loading organizations…
                </div>
              </TableCell>
            </TableRow>
          )}

          {/* Empty */}
          {!isLoading && organizations.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-slate-400 py-16 text-base"
              >
                No organizations found.
              </TableCell>
            </TableRow>
          )}

          {/* Rows */}
          {!isLoading &&
            organizations.map((org, index) => (
              <OrganizationTableRow
                key={org._id}
                org={org}
                serialNumber={getSerialNumber(index)}
                isDeleting={deletingId === org._id}
                onDelete={onDelete}
                onAdd={onAdd}
              />
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrganizationTable;