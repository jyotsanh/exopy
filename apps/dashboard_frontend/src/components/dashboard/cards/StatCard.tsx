import { FaArrowUpLong } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import type { Stat } from "@/types/dashboard.types";

interface StatCardProps extends Stat {
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sub,
  up,
  highlight,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 px-8 flex flex-col gap-2 transition-all",
        highlight
          ? "bg-linear-to-br from-green-800 to-green-600 shadow-lg shadow-green-900/30"
          : "bg-card border border-border shadow-sm hover:shadow-md"
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-md font-semibold tracking-tight",
            highlight ? "text-white" : "text-card-foreground"
          )}
        >
          {label}
        </span>
        <button
          onClick={onClick}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 bg-card text-card-foreground border border-foreground/40"
          )}
        >
          <FaArrowUpLong size={14} className="rotate-45" />
        </button>
      </div>
      <span
        className={cn(
          "text-4xl font-bold tracking-tight",
          highlight ? "text-white" : "text-card-foreground"
        )}
      >
        {value}
      </span>
      <span
        className={cn(
          "text-xs flex items-center gap-1",
          highlight ? "text-green-300" : "text-muted-foreground"
        )}
      >
        {up && <span className="text-xs">↑</span>}
        {sub}
      </span>
    </div>
  );
};

export default StatCard;
