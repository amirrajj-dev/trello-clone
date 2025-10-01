"use client";
import { Task } from "@/types/interfaces/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  MoreHorizontal,
  TrendingUp,
  Eye,
  Trash2,
  Edit,
} from "lucide-react";
import { RefObject } from "react";
import { usePathname } from "next/navigation";
import { Role } from "@/types/enums/enums";
import { useModal } from "@/stores/modal.store";
import UpdateProgressForm from "@/components/pages/project/ui/updateProgressForm/UpdateProgressForm";
import Comments from "@/components/pages/project/ui/comments/Comments";
import DeleteTaskConfirmation from "@/components/pages/project/ui/deleteTaskConfirmation/DeleteTaskConfirmation";
import UpdateTaskForm from "@/components/pages/project/ui/updateTaskform/UpdateTaskForm";

const TaskCardHeader = ({
  task,
  currentUserId,
  isMenuOpen,
  setIsMenuOpen,
  menuRef,
}: {
  task: Task;
  currentUserId: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  menuRef: RefObject<HTMLDivElement | null>;
}) => {
  const pathname = usePathname();
  const { openModal } = useModal();

  const handleUpdateProgress = () => {
    setIsMenuOpen(false);
    openModal(
      <UpdateProgressForm projectId={task.projectId} taskId={task.id} currentProgress={task.progress} />,
      "Update Task Progress"
    );
  };

  const handleSeeComments = () => {
    setIsMenuOpen(false);
    openModal(
      <Comments projectId={task.projectId} taskId={task.id} />,
      "Comments"
    );
  };

  const handleDeleteTask = () => {
    setIsMenuOpen(false);
    openModal(
      <DeleteTaskConfirmation
        projectId={task.projectId}
        taskId={task.id}
        taskTitle={task.title}
      />,
      "Delete Task"
    );
  };

  const handleUpdateTask = () => {
    setIsMenuOpen(false);
    openModal(
      <UpdateTaskForm
        task={{
          id: task.id,
          assigneeId: task.assigneeId || "",
          description: task.description || "",
          dueDate: task.dueDate || "",
          priority: task.priority,
          status: task.status,
          title: task.title,
        }}
        projectId={task.projectId}
        projectMembers={task.project.members}
      />,
      "Update Task"
    );
  };

  const nonViewerMembers = task.project.members.filter(
    (member) => member.role !== Role.VIEWER
  );
  const ownerMember = task.project.members.find(
    (member) => member.role === Role.OWNER
  );
  const adminMembers = task.project.members.filter(
    (member) => member.role === Role.ADMIN
  );

  return (
    <div className="flex items-start justify-between mb-4 relative">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg text-base-content truncate pr-8">
          {task.title}
        </h3>
        <Link href={`/projects/${task.projectId}`}>
          <motion.p
            whileHover={{ x: 2 }}
            className="text-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 mt-1"
          >
            {task.project.name}
            <ArrowUpRight
              size={12}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </motion.p>
        </Link>
      </div>
      {pathname.includes("/projects/") &&
        nonViewerMembers.some((member) => member.userId === currentUserId) && (
          <div className="relative" ref={menuRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 text-base-content/40 hover:text-base-content hover:bg-base-content/10 rounded-lg transition-colors"
            >
              <MoreHorizontal size={16} />
            </motion.button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute overflow-y-auto right-0 mt-2 w-48 max-h-40 bg-base-100 rounded-xl shadow-xl border border-base-300 z-50"
                >
                  {nonViewerMembers.some(
                    (member) => member.userId === currentUserId
                  ) && (
                    <li>
                      <button
                        onClick={handleSeeComments}
                        className="flex items-center gap-3 w-full px-4 py-2 text-base-content hover:bg-base-300 transition-colors"
                      >
                        <Eye size={16} className="text-primary" />
                        <span className="text-nowrap">See Comments</span>
                      </button>
                    </li>
                  )}
                  {task.assigneeId && task.assigneeId === currentUserId && (
                    <li>
                      <button
                        onClick={handleUpdateProgress}
                        className="flex items-center gap-3 w-full px-4 py-2 text-base-content hover:bg-base-300 transition-colors"
                      >
                        <TrendingUp size={16} className="text-warning" />
                        <span className="text-nowrap">Update Progress</span>
                      </button>
                    </li>
                  )}
                  {(ownerMember?.userId === currentUserId ||
                    adminMembers.some(
                      (member) => member.userId === currentUserId
                    )) && (
                    <li>
                      <button
                        onClick={handleUpdateTask}
                        className="flex items-center gap-3 w-full px-4 py-2 text-base-content hover:bg-base-300 transition-colors"
                      >
                        <Edit size={16} className="text-success" />
                        <span className="text-nowrap">Update Task</span>
                      </button>
                    </li>
                  )}
                  {((task.assigneeId && task.assigneeId === currentUserId) ||
                    ownerMember?.userId === currentUserId) && (
                    <li className="border-t border-base-300">
                      <button
                        onClick={handleDeleteTask}
                        className="flex items-center gap-3 w-full px-4 py-2 text-error hover:bg-error/10 transition-colors"
                      >
                        <Trash2 size={16} />
                        <span className="text-nowrap">Delete Task</span>
                      </button>
                    </li>
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}
    </div>
  );
};

export default TaskCardHeader;
