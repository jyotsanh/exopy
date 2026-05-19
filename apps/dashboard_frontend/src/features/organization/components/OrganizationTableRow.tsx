// features/organization/components/OrganizationTableRow.tsx

import { FiExternalLink, FiPlus, FiTrash2, FiLoader } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import OrganizationAvatar from "./OrganizationAvatar";
import type { OrganizationEntity } from "../types/organization.types";

interface OrganizationTableRowProps {
  org: OrganizationEntity;
  serialNumber: string;
  isDeleting: boolean;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const OrganizationTableRow = ({
  org,
  serialNumber,
  isDeleting,
  onDelete,
  onAdd,
}: OrganizationTableRowProps) => (
  <TableRow className="org-table-row border-b border-blue-100/85">
    {/* Serial Number */}
    <TableCell className="py-6 px-7 text-black font-semibold text-base w-24">
      {serialNumber}
    </TableCell>

    {/* Organization Info */}
    <TableCell className="py-6">
      <div className="flex items-center gap-4">
        <OrganizationAvatar name={org.name} />
        <div>
          <p className="font-semibold text-slate-700 text-sm">{org.name}</p>
          <p className="text-slate-400 text-sm mt-0.5">{org.email}</p>
        </div>
      </div>
    </TableCell>

    {/* Actions */}
    <TableCell className="py-6 pr-6 text-right">
      <div className="flex items-center justify-end gap-2.5">
        <Button
          variant="outline"
          size="icon"
          className="w-11 h-11 rounded-2xl border-blue-100 
                     bg-white/80 hover:bg-blue-50 text-slate-500"
          title="Open"
        >
          <FiExternalLink className="text-base" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="w-11 h-11 rounded-2xl border-blue-100 
                     bg-white/80 hover:bg-blue-50 text-slate-500"
          title="Add"
          onClick={onAdd}
        >
          <FiPlus className="text-base" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="w-11 h-11 rounded-2xl border-red-100 
                     bg-red-50/80 hover:bg-red-100 text-red-500"
          title="Delete"
          disabled={isDeleting}
          onClick={() => onDelete(org._id)}
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

export default OrganizationTableRow;