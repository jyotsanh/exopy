// features/organization/components/OrganizationToolbar.tsx

import { FiSearch, FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OrganizationToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

const OrganizationToolbar = ({
  search,
  onSearchChange,
  onAddClick,
}: OrganizationToolbarProps) => (
  <div className="flex items-center justify-between mb-6 gap-4">
    {/* Search */}
    <div className="relative">
      <FiSearch
        className="absolute left-4 top-1/2 -translate-y-1/2
                   text-muted-foreground text-base"
      />
      <Input
        className="pl-11 w-80 h-12 text-base bg-card border-border
                   backdrop-blur-sm rounded-2xl text-foreground
                   placeholder:text-muted-foreground focus-visible:ring-green-400"
        placeholder="Search organization"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>

    {/* Add Button */}
    <Button
      onClick={onAddClick}
      className="h-11 px-5 text-sm bg-primary text-white
                 rounded-2xl shadow-md gap-2"
    >
      <FiPlus className="text-lg" />
      Add Organization
    </Button>
  </div>
);

export default OrganizationToolbar;
