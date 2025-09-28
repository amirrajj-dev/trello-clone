import { Project } from "@/types/interfaces/interfaces";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ProjectCardHeader from "./ui/ProjectCardHeader";
import ProjectCardDescription from "./ui/ProjectCardDescription";
import ProjectCardProgress from "./ui/ProjectCardProgress";
import ProjectCardMembers from "./ui/ProjectCardMembers";
import { CheckCircle2 } from "lucide-react";
import ProjectCardFooter from "./ui/ProjectCardFooter";

const ProjectCard = ({
  project,
  currentUserId,
}: {
  project: Project;
  currentUserId: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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

  const completedTasks = () => {
    return project.tasks.filter((task) => task.progress === 100).length;
  };

  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-base-200 rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden">
        {pathname.includes('projects') &&
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-20 translate-x-20" />
        }

        <ProjectCardHeader
          project={project}
          currentUserId={currentUserId}
          isHovered={isHovered}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          menuRef={menuRef}
        />
        <ProjectCardDescription description={project.description || ""} isHovered={isHovered} />
        <ProjectCardProgress project={project} />
        <div className="flex items-center justify-between mb-4 relative z-0">
          <ProjectCardMembers members={project.members || []} />
          <div className="flex items-center gap-4 text-sm text-base-content/60">
            <div className="flex items-center gap-1">
              <CheckCircle2 size={14} className="text-success" />
              <span>{completedTasks()}</span>
            </div>
          </div>
        </div>
        <ProjectCardFooter project={project} isHovered={isHovered} />

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isHovered ? "100%" : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent"
        />
      </div>
    </motion.div>
  );
};

export default ProjectCard;