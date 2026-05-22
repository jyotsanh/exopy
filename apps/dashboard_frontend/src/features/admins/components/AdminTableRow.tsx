import { FiEdit2, FiKey, FiTrash2, FiLoader } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import AdminAvatar from "./AdminAvatar";
import type { AdminEntity } from "../types/admin.types";

interface AdminTableRowProps {
  admin: AdminEntity;
  serialNumber: string;
  isDeleting: boolean;
  onEdit: (admin: AdminEntity) => void;
  onResetPassword: (admin: AdminEntity) => void;
  onDelete: (id: string) => void;
}

const getOrgName = (org: AdminEntity["org_id"]): string => {
  if (!org) return "—";
  if (typeof org === "string") return org;
  return org.name;
};

const AdminTableRow = ({
  admin,
  serialNumber,
  isDeleting,
  onEdit,
  onResetPassword,
  onDelete,
}: AdminTableRowProps) => {
  return (
    <TableRow className="border-b border-border">
      <TableCell className="py-6 px-7 text-foreground font-semibold text-base w-24">
        {serialNumber}
      </TableCell>

      <TableCell className="py-6">
        <div className="flex items-center gap-4">
          <AdminAvatar name={admin.username} image={admin.profile_image} />
          <div>
            <p className="font-semibold text-foreground text-sm">
              {admin.username}
            </p>
            <p className="text-muted-foreground text-sm mt-0.5">
              {admin.email}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell className="py-6 text-foreground text-sm">
        {getOrgName(admin.org_id)}
      </TableCell>

      <TableCell className="py-6 pr-6 text-right">
        <div className="flex items-center justify-end gap-2.5">
          <Button
            variant="outline"
            size="icon"
            className="w-11 h-11 rounded-2xl border-border
                       bg-card hover:bg-accent text-muted-foreground"
            title="Edit admin"
            onClick={() => onEdit(admin)}
          >
            <FiEdit2 className="text-base" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="w-11 h-11 rounded-2xl border-border
                       bg-card hover:bg-accent text-muted-foreground"
            title="Reset password"
            onClick={() => onResetPassword(admin)}
          >
            <FiKey className="text-base" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="w-11 h-11 rounded-2xl border-red-100 dark:border-red-900/60
                       bg-red-50/80 hover:bg-red-100 text-red-500
                       dark:bg-red-950/40 dark:hover:bg-red-900/60 dark:text-red-300
                       disabled:opacity-50"
            title="Delete admin"
            disabled={isDeleting}
            onClick={() => onDelete(admin._id)}
          >
            {isDeleting ? (
              <FiLoader className="animate-spin text-base" />
            ) : (
              <FiTrash2 className="text-base" />
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default AdminTableRow;
