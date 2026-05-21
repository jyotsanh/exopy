import { MdAdd } from "react-icons/md";
import type { Project } from "@/types/dashboard.types";

interface ProjectListCardProps {
  title?: string;
  projects: Project[];
  onAddNew?: () => void;
}

const ProjectListCard: React.FC<ProjectListCardProps> = ({
  title = "Project",
  projects,
  onAddNew,
}) => {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-base text-card-foreground">{title}</h2>
        <button
          onClick={onAddNew}
          className="flex items-center gap-1 text-xs font-semibold text-card-foreground bg-card border border-foreground/40 hover:bg-muted px-3 py-1.5 rounded-2xl transition-colors"
        >
          <MdAdd size={13} /> New
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {projects.map((project, index) => (
          <ProjectItem key={index} project={project} />
        ))}
      </div>
    </div>
  );
};


interface ProjectItemProps {
  project: Project;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  return (
    <div className="flex items-center gap-3">
      <span className={`w-2 h-2 rounded-full shrink-0 ${project.dot}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-card-foreground truncate">
          {project.name}
        </p>
        <p className="text-[11px] text-muted-foreground">Due date: {project.due}</p>
      </div>
    </div>
  );
};

export default ProjectListCard;
