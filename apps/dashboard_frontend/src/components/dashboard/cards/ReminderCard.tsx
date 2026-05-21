import { MdVideocam, MdEvent, MdTask } from "react-icons/md";
import type { Reminder } from "@/types/dashboard.types";

interface ReminderCardProps {
  reminder: Reminder;
  onAction?: () => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onAction }) => {
  const getActionButton = () => {
    switch (reminder.type) {
      case "meeting":
        return (
          <>
            <MdVideocam size={18} /> Start Meeting
          </>
        );
      case "event":
        return (
          <>
            <MdEvent size={18} /> View Event
          </>
        );
      case "task":
        return (
          <>
            <MdTask size={18} /> View Task
          </>
        );
      default:
        return "View Details";
    }
  };

  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm flex flex-col h-56">
      <h2 className="font-bold text-base text-card-foreground mb-3">Reminders</h2>
      <p className="font-bold text-lg text-card-foreground leading-snug mb-1">
        {reminder.title}
      </p>
      <p className="text-sm text-muted-foreground mb-5">Time : {reminder.time}</p>
      <button
        onClick={onAction}
        className="mt-auto flex items-center justify-center gap-2 w-full bg-green-800 hover:bg-green-900 text-white rounded-xl py-3 text-sm font-semibold shadow-md shadow-green-900/25 transition-colors"
      >
        {getActionButton()}
      </button>
    </div>
  );
};

export default ReminderCard;
