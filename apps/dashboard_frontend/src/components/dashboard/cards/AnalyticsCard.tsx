import { cn } from "@/lib/utils";
import type { AnalyticsData } from "@/types/dashboard.types";

 
interface AnalyticsBarProps extends AnalyticsData {}

const AnalyticsBar: React.FC<AnalyticsBarProps> = ({ day, val, active }) => {
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div
        className="relative w-full flex items-end justify-center"
        style={{ height: 96 }}
      >
        {active && (
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap z-10">
            {val}%
          </span>
        )}
        <div
          className={cn(
            "w-full rounded-3xl transition-all duration-500 ",
            active
              ? "bg-green-700 shadow-lg shadow-green-700/40"
              : "bg-[repeating-linear-gradient(45deg,#166534,#166534_3px,#ffffff_3px,#ffffff_8px)] dark:bg-[repeating-linear-gradient(45deg,#166534,#166534_3px,#1f2937_3px,#1f2937_8px)]"
          )}
          style={{ height: `${val}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground font-medium">{day}</span>
    </div>
  );
};


interface AnalyticsCardProps {
  title?: string;
  data: AnalyticsData[];
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title = "Project Analytics",
  data,
}) => {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm flex flex-col justify-between h-56" >
      <h2 className="font-bold text-base text-card-foreground mb-5">{title}</h2>
      <div className="flex items-end gap-3 h-24 px-1">
        {data.map((item, index) => (
          <AnalyticsBar key={`${item.day}-${index}`} {...item} />
        ))}
      </div>
    </div>
  );
};

export default AnalyticsCard;