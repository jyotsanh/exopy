import { MdAdd } from "react-icons/md";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onAddProject?: () => void;
  onImportData?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  onAddProject,
  onImportData,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      <div className="flex gap-2.5">
        <Button
          onClick={onAddProject}
          className="bg-green-800 hover:bg-green-900 text-white p-6 rounded-3xl flex items-center justify-center"
        >
          <MdAdd size={18} className="mr-2" />
          Add Project
        </Button>
        <Button
          variant="outline"
          onClick={onImportData}
          className="rounded-3xl flex items-center justify-center p-6 border border-green-800 text-green-800 hover:bg-green-50 hover:text-green-900 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-950 dark:hover:text-green-300"
        >
          Import Data
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;