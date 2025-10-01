import { motion } from "framer-motion";
import { Folder, TrendingUp } from "lucide-react";
import Link from "next/link";
import ProjectCard from "@/components/common/projectCard/ProjectCard";
import { Project } from "@/types/interfaces/interfaces";

interface ProjectsSectionProps {
  projectsLoading: boolean;
  projects: Project[];
  userId: string;
}

const ProjectsSection = ({
  projectsLoading,
  projects,
  userId,
}: ProjectsSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="mb-8"
  >
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-base-content flex items-center gap-3">
        <Folder size={28} className="text-primary" />
        Your Projects
        <span className="text-base-content/60 text-lg font-normal">
          ({projects.length})
        </span>
      </h2>
      {projects.length > 0 && (
        <Link href="/projects">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-ghost rounded-xl border border-base-300 hover:bg-base-300 gap-2"
          >
            View All
            <TrendingUp size={16} />
          </motion.button>
        </Link>
      )}
    </div>
    {projectsLoading ? (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-base-content/60">Loading projects...</p>
        </div>
      </div>
    ) : projects.length === 0 ? (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 bg-base-200/50 rounded-2xl border border-dashed border-base-300"
      >
        <Folder
          size={48}
          className="mx-auto text-base-content/20 mb-4"
        />
        <h3 className="text-lg font-semibold text-base-content mb-2">
          No projects yet
        </h3>
        <p className="text-base-content/60 mb-4">
          Start your journey by creating your first project
        </p>
        <Link href="/projects">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary rounded-xl bg-gradient-to-r from-primary to-secondary gap-2"
          >
            <Folder size={16} />
            Create Project
          </motion.button>
        </Link>
      </motion.div>
    ) : (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {projects.slice(0, 6).map((project: Project) => (
          <ProjectCard
            project={project}
            currentUserId={userId}
            key={project.id}
          />
        ))}
      </motion.div>
    )}
  </motion.div>
);

export default ProjectsSection;