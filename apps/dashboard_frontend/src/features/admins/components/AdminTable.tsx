import { FiLoader } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminTableRow from "./AdminTableRow";
import type { AdminEntity } from "../types/admin.types";

interface AdminTableProps {
  admins: AdminEntity[];
  isLoading: boolean;
  currentPage: number;
  perPage: number;
  deletingId: string | null;
  onEdit: (admin: AdminEntity) => void;
  onResetPassword: (admin: AdminEntity) => void;
  onDelete: (id: string) => void;
}

const TABLE_HEADS = [
  { label: "S.n", className: "w-24 py-5 px-7" },
  { label: "Admin", className: "py-5" },
  { label: "Organization", className: "py-5" },
  { label: "Options", className: "text-right py-5 pr-8" },
];

const AdminTable = ({
  admins,
  isLoading,
  currentPage,
  perPage,
  deletingId,
  onEdit,
  onResetPassword,
  onDelete,
}: AdminTableProps) => {
  const getSerialNumber = (index: number) =>
    String((currentPage - 1) * perPage + index + 1).padStart(2, "0");

  return (
    <div className="bg-card backdrop-blur-xl rounded-3xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-sky-50/50 dark:bg-sky-950/30 border-b border-border hover:bg-sky-50/50 dark:hover:bg-sky-950/30">
            {TABLE_HEADS.map(({ label, className }) => (
              <TableHead
                key={label}
                className={`${className} text-muted-foreground font-semibold text-sm tracking-widest uppercase`}
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
                colSpan={TABLE_HEADS.length}
                className="text-center text-muted-foreground py-16 text-base"
              >
                <div className="flex items-center justify-center gap-2">
                  <FiLoader className="animate-spin text-lg text-blue-400" />
                  Loading admins…
                </div>
              </TableCell>
            </TableRow>
          )}

          {!isLoading && admins.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={TABLE_HEADS.length}
                className="text-center text-muted-foreground py-16 text-base"
              >
                No admins found.
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            admins.map((admin, index) => (
              <AdminTableRow
                key={admin._id}
                admin={admin}
                serialNumber={getSerialNumber(index)}
                isDeleting={deletingId === admin._id}
                onEdit={onEdit}
                onResetPassword={onResetPassword}
                onDelete={onDelete}
              />
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminTable;
