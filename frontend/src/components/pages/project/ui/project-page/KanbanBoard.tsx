import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import KanbanColumn from "../KanbanColumn/KanbanColumn";
import { Task } from "@/types/interfaces/interfaces";
import { TaskStatus } from "@/types/enums/enums";
import { toast } from "sonner";
import { Folder } from "lucide-react";
import { useUpdateTask } from "@/hooks/mutations/update-task";
import { useState } from "react";

interface KanbanBoardProps {
  tasks: Task[];
  projectId: string;
  currentUserId: string;
  isLoading: boolean;
}

const KanbanBoard = ({
  tasks,
  projectId,
  currentUserId,
  isLoading,
}: KanbanBoardProps) => {
  const updateTask = useUpdateTask(projectId);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const tasksByStatus = {
    TODO: tasks.filter((task) => task.status === "TODO"),
    IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS"),
    DONE: tasks.filter((task) => task.status === "DONE"),
  };
  

  const canUpdateTask = (task: Task): boolean => {
    return task.assigneeId === currentUserId;
  };

  const handleDragStart = (event: any) => {
    const taskId = event.active.id;
    const task = tasks.find((t) => t.id === taskId);
    setActiveTask(task || null);

    if (task && !canUpdateTask(task)) {
      event.preventDefault();
      toast.error("You don't have permission to move this task");
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id;
    const task = tasks.find((t) => t.id === taskId);

    if (!task || !canUpdateTask(task)) {
      toast.error("You don't have permission to update this task");
      return;
    }

    let newStatus: TaskStatus;

    if (over.id.includes("column-")) {
      newStatus = over.id.replace("column-", "") as TaskStatus;
    } else {
      const overTask = tasks.find((t) => t.id === over.id);
      if (!overTask) return;
      newStatus = overTask.status;
    }

    if (task.status === newStatus) return;

    updateTask.mutate({ projectId, taskId, task: { status: newStatus } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
          <Folder size={24} className="text-primary" />
          Project Tasks
          <span className="text-base-content/60 text-lg font-normal">
            ({tasks.length} tasks)
          </span>
        </h2>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-base-content/60">Loading tasks...</p>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {(["TODO", "IN_PROGRESS", "DONE"] as TaskStatus[]).map((status) => (
              <KanbanColumn
                key={status}
                tasks={tasksByStatus[status]}
                status={status}
                projectId={projectId}
                currentUserId={currentUserId}
                canUpdateTask={canUpdateTask}
                activeTask={activeTask}
              />
            ))}
          </div>
        </DndContext>
      )}
    </motion.div>
  );
};

export default KanbanBoard;