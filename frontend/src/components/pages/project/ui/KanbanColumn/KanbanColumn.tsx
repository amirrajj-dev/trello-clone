import TaskCard from "@/components/common/taskCard/TaskCard";
import { TaskStatus } from "@/types/enums/enums";
import { Task } from "@/types/interfaces/interfaces";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import React from "react";

interface KanbanColumnProps {
  tasks: Task[];
  status: TaskStatus;
  projectId: string;
  currentUserId: string;
  canUpdateTask: (task: Task) => boolean;
  activeTask?: Task | null;
}

const KanbanColumn = ({
  tasks,
  status,
  projectId,
  currentUserId,
  canUpdateTask,
  activeTask,
}: KanbanColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `column-${status}`,
  });
  return (
    <div
      ref={setNodeRef}
      className={`bg-base-200 p-4 rounded-lg min-h-[500px] transition-colors duration-200 ${
        isOver ? "bg-primary/20 ring-2 ring-primary" : ""
      }`}
      id={`column-${status}`}
    >
      <h2 className="text-lg font-bold mb-4">{status}</h2>
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-4">
         <AnimatePresence>
           {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              cardBgColor="bg-base-100"
              currentUserId={currentUserId}
              projectId={projectId}
              canUpdateTask={canUpdateTask(task)}
              isDragging={activeTask?.id === task.id}
            />
          ))}
         </AnimatePresence>
        </div>
      </SortableContext>
      {tasks.length === 0 && (
        <div
          className={`flex items-center justify-center h-32 text-base-content/40 border-2 border-dashed rounded-lg transition-colors ${
            isOver ? "border-primary bg-primary/10" : "border-base-300"
          }`}
        >
          {isOver ? "Drop task here" : "Drop tasks here"}
        </div>
      )}
    </div>
  );
};

export default React.memo(KanbanColumn);