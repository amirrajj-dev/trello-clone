import React from "react";
import { motion } from "framer-motion";
import { useGetProjects } from "@/hooks/queries/projects";
import ProjectCard from "@/components/common/projectCard/ProjectCard";
import { Project } from "@/types/interfaces/interfaces";
import { toast } from "sonner";
import { Snail } from "lucide-react";
import { useGetMe } from "@/hooks/queries/user";

const ProjectsSection = () => {
  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError,
  } = useGetProjects();
  const projects = projectsData?.data;
  if (projectsError) {
    toast.error(projectsError.message || "Failed to load projects");
  }
  const { data: user } = useGetMe();
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-8"
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-6 flex items-center gap-3 group"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative p-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl"
        >
          <Snail size={22} className="text-primary" />
          <motion.div
            whileHover={{ scale: 1.2, rotate: 180 }}
            className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full"
          />
        </motion.div>
        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Projects
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent ml-4"></div>
      </motion.h2>
      {projectsLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : projects?.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-base-content/70"
        >
          No projects yet. Create one to get started!
        </motion.p>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {projects?.map((project: Project) => (
            <ProjectCard
              key={project.id}
              project={project}
              currentUserId={user?.id || ""}
            />
          ))}
        </motion.div>
      )}
    </motion.section>
  );
};

export default ProjectsSection;
