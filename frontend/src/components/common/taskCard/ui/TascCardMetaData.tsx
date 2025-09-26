import { Task } from "@/types/interfaces/interfaces";
import { Calendar } from "lucide-react";

const TaskCardMetadata = ({ task }: { task: Task }) => {
  const formatDueDate = (dueDate: string | null | undefined) => {
    if (!dueDate) return "No due date";
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      HIGH: "bg-error/20 text-error border-error/30",
      MEDIUM: "bg-warning/20 text-warning border-warning/30",
      LOW: "bg-info/20 text-info border-info/30",
    };
    return (
      colors[priority as keyof typeof colors] ||
      "bg-base-300 text-base-content border-base-300"
    );
  };

  const statusStyles: Record<string, string> = {
    TODO: "bg-base-300 text-base-content border-base-300",
    IN_PROGRESS: "bg-primary/20 text-primary border-primary/30",
    DONE: "bg-success/20 text-success border-success/30",
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div className="flex items-center justify-between mt-4 relative z-0">
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-full border ${
            isOverdue
              ? "bg-error/20 text-error border-error/30"
              : "bg-base-300 text-base-content/80 border-base-300"
          }`}
        >
          <Calendar
            size={14}
            className={isOverdue ? "text-error" : "text-base-content/60"}
          />
          <span className={isOverdue ? "font-medium" : ""}>
            {formatDueDate(task.dueDate)}
          </span>
        </div>
        {task.priority && (
          <span
            className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority.toLowerCase()}
          </span>
        )}
      </div>
      <span
        className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
          statusStyles[task.status]
        }`}
      >
        {task.status.replace("_", " ")}
      </span>
    </div>
  );
};

export default TaskCardMetadata;