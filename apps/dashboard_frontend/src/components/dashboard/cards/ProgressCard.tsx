import type { ProgressLegend } from "@/types/dashboard.types";

interface ProgressCardProps {
  title?: string;
  percentage: number;
  subtitle?: string;
  legends: ProgressLegend[];
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title = "Project Progress",
  percentage,
  subtitle = "Project Ended",
  legends,
}) => {
  // Calculate stroke offset based on percentage
  const strokeDashoffset = 226 - (226 * percentage) / 100;

  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
      <h2 className="font-bold text-base text-card-foreground mb-4">{title}</h2>

      {/* Progress Arc */}
      <div className="flex justify-center mb-4">
        <div className="relative w-44 h-24">
          <svg viewBox="0 0 176 96" className="w-full overflow-visible">
            <defs>
              <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#166534" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
            </defs>
            {/* Background arc */}
            <path
              d="M 16 88 A 72 72 0 0 1 160 88"
              fill="none"
              className="stroke-green-100 dark:stroke-green-900/50"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d="M 16 88 A 72 72 0 0 1 160 88"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray="226"
              strokeDashoffset={strokeDashoffset}
            />
          </svg>

          <div className="absolute bottom-0 w-full text-center">
            <p className="text-3xl font-black text-card-foreground leading-none">
              {percentage}%
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 flex-wrap">
        {legends.map((legend, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm ${legend.cls}`} />
            <span className="text-xs text-muted-foreground">{legend.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressCard;
