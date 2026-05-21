import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { STATUS_STYLES } from "@/data/dashboard.data";
import type { TeamMember } from "@/types/dashboard.types";

interface TeamCardProps {
  title?: string;
  members: TeamMember[];
  onAddMember?: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({
  title = "Team Collaboration",
  members,
  onAddMember,
}) => {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-base text-card-foreground">{title}</h2>
        <button
          onClick={onAddMember}
          className="text-xs font-semibold text-card-foreground border border-border hover:bg-muted px-3 py-2.5 rounded-2xl transition-colors"
        >
          + Add Member
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {members.map((member, index) => (
          <TeamMemberItem key={index} member={member} />
        ))}
      </div>
    </div>
  );
};


interface TeamMemberItemProps {
  member: TeamMember;
}

const TeamMemberItem: React.FC<TeamMemberItemProps> = ({ member }) => {
  return (
    <div className="flex items-center gap-3">
        <Avatar className="size-11 ring-2 ring-border/50">
          {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
          <AvatarFallback className="text-xs font-semibold bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-200">
            {member.initials}
          </AvatarFallback>
        </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-card-foreground">{member.name}</p>
        <p className="text-[11px] text-muted-foreground truncate">
          Working on{" "}
          <span className="font-semibold text-card-foreground">{member.task}</span>
        </p>
      </div>
      <span
        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg shrink-0 ${STATUS_STYLES[member.status]}`}
      >
        {member.status}
      </span>
    </div>
  );
};

export default TeamCard;
