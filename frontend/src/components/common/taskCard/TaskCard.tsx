"use client";
import { Task } from "@/types/interfaces/interfaces";
import { motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import TaskCardHeader from "./ui/TaskCardHeader";
import TaskCardDescription from "./ui/TaskCardDescription";
import TaskCardMetadata from "./ui/TascCardMetaData";
import TaskCardProgress from "./ui/TaskCardProgress";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Role } from "@/types/enums/enums";
import { User } from "lucide-react";

interface TaskCardProps {
  task: Task;
  currentUserId: string;
  projectId: string;
  cardBgColor?: "bg-base-200" | "bg-base-100" | "bg-base-300";
  canUpdateTask?: boolean;
  isDragging?: boolean;
}

const TaskCard = ({
  task,
  currentUserId,
  cardBgColor = "bg-base-200",
  canUpdateTask,
  isDragging = false,
}: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const isNonViewerMember = () => {
    const currentUserMember = task.project.members.find(
      (member) => member.userId === currentUserId
    );
    return currentUserMember?.role !== Role.VIEWER;
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
    disabled: !canUpdateTask,
    animateLayoutChanges: () => false, // Disable layout animations for smoother dragging
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 150ms ease", // Faster transition
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userIsAdminOrOwner = isNonViewerMember();
  const showReadOnlyIndicator = !canUpdateTask && !userIsAdminOrOwner;
  const dragging = isSortableDragging || isDragging;

  const isTaskOwner = task.assigneeId
    ? currentUserId === task.assigneeId
    : false;

  return (
    <motion.div
      key={task.id}
      ref={setNodeRef}
      style={style}
      {...(canUpdateTask ? { ...attributes, ...listeners } : {})}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{
        opacity: dragging ? 0.6 : 1,
        y: 0,
        scale: dragging ? 1.03 : 1,
        rotateZ: dragging ? 1 : 0,
      }}
      whileHover={{
        y: canUpdateTask ? -2 : 0,
        scale: canUpdateTask ? 1.02 : 1,
        transition: { duration: 0.15 },
      }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`group relative ${
        pathname === "/"
          ? "cursor-auto"
          : canUpdateTask
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-not-allowed"
      } ${dragging ? "z-50" : "z-0"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {showReadOnlyIndicator && (
        <div className="absolute inset-0 bg-base-300/50 rounded-2xl z-10" />
      )}

      <div
        className={`relative ${cardBgColor} overflow-hidden rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-150 ${
          showReadOnlyIndicator ? "opacity-70" : ""
        } ${dragging ? "shadow-2xl ring-2 ring-primary" : ""}  ${
          isTaskOwner && pathname !== "/" && "ring-1 ring-accent/40"}`}
      >
        {pathname.includes("/projects/") && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
        )}
           {isTaskOwner && pathname !== '/' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-sm"
            title="You are assigned to this task"
          >
            <User size={12} className="text-white" />
          </motion.div>
        )}
        <TaskCardHeader
          task={task}
          currentUserId={currentUserId}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          menuRef={menuRef}
        />
        <TaskCardDescription description={task.description} />
        <TaskCardMetadata task={task} />
        <TaskCardProgress task={task} />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isHovered ? "100%" : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
        />

        {showReadOnlyIndicator && (
          <div className="absolute top-2 right-2 text-xs text-warning bg-warning/20 px-2 py-1 rounded-full">
            Read-only
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(TaskCard);
