import { FiSearch, FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BranchToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

const BranchToolbar = ({
  search,
  onSearchChange,
  onAddClick,
}: BranchToolbarProps) => (
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
        placeholder="Search branch"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>

    <Button
      onClick={onAddClick}
      className="h-11 px-5 text-sm bg-primary text-white
                 rounded-2xl shadow-md gap-2"
    >
      <FiPlus className="text-lg" />
      Add Branch
    </Button>
  </div>
);

export default BranchToolbar;
