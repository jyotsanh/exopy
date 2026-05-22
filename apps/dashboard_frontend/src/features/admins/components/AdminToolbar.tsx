import { FiSearch, FiPlus } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

const AdminToolbar = ({
  search,
  onSearchChange,
  onAddClick,
}: AdminToolbarProps) => (
  <div className="flex items-center justify-between mb-6 gap-4">
    <div className="relative">
      <FiSearch
        className="absolute left-4 top-1/2 -translate-y-1/2
                   text-muted-foreground text-base"
      />
      <Input
        className="pl-11 w-80 h-12 text-base bg-card border-border
                   backdrop-blur-sm rounded-2xl text-foreground
                   placeholder:text-muted-foreground focus-visible:ring-green-400"
        placeholder="Search admins by name or email"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
    <Button
      onClick={onAddClick}
      className="h-12 px-5 rounded-2xl bg-primary text-white shadow-md hover:bg-primary/90 gap-2"
    >
      <FiPlus className="text-base" />
      Add Admin
    </Button>
  </div>
);

export default AdminToolbar;
