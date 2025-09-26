"use client";
import { Task } from "@/types/interfaces/interfaces";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import TaskCardHeader from "./ui/TaskCardHeader";
import TaskCardDescription from "./ui/TaskCardDescription";
import TaskCardMetadata from "./ui/TascCardMetaData";
import TaskCardProgress from "./ui/TaskCardProgress";

const TaskCard = ({ task, currentUserId }: { task: Task; currentUserId: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

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

  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        y: -2,
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative bg-base-200 overflow-hidden rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
        {pathname.includes("/projects/") && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
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
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
        />
      </div>
    </motion.div>
  );
};

export default TaskCard;