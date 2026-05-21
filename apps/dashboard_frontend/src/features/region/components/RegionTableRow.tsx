import { FiExternalLink, FiTrash2, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import RegionAvatar from "./RegionAvatar";
import type { RegionEntity } from "../types/region.types";

interface RegionTableRowProps {
  region: RegionEntity;
  serialNumber: string;
  orgId: string;
  isDeleting: boolean;
  onDelete: (id: string) => void;
}

const RegionTableRow = ({
  region,
  serialNumber,
  orgId,
  isDeleting,
  onDelete,
}: RegionTableRowProps) => {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/organization/${orgId}/regions/${region._id}/branches`);
  };

  return (
    <TableRow className="org-table-row border-b border-border">
      <TableCell className="py-6 px-7 text-foreground font-semibold text-base w-24">
        {serialNumber}
      </TableCell>

      <TableCell className="py-6">
        <div className="flex items-center gap-4">
          <RegionAvatar name={region.name} />
          <div>
            <p className="font-semibold text-foreground text-sm">{region.name}</p>
            {region.email && (
              <p className="text-muted-foreground text-sm mt-0.5">{region.email}</p>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell className="py-6 pr-6 text-right">
        <div className="flex items-center justify-end gap-2.5">
          <Button
            variant="outline"
            size="icon"
            className="w-11 h-11 rounded-2xl border-border
                       bg-card hover:bg-accent text-muted-foreground"
            title="Open branches"
            onClick={handleOpen}
          >
            <FiExternalLink className="text-base" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="w-11 h-11 rounded-2xl border-red-100 dark:border-red-900/60
                       bg-red-50/80 hover:bg-red-100 text-red-500
                       dark:bg-red-950/40 dark:hover:bg-red-900/60 dark:text-red-300"
            title="Delete"
            disabled={isDeleting}
            onClick={() => onDelete(region._id)}
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

export default RegionTableRow;
