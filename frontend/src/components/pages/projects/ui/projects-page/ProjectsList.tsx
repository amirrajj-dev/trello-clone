import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Plus } from "lucide-react";
import ProjectCard from "@/components/common/projectCard/ProjectCard";
import { Project } from "@/types/interfaces/interfaces";

const ProjectList = ({
  isLoading,
  filteredProjects,
  viewMode,
  currentUserId,
  handleCreateProject,
  search,
}: {
  isLoading: boolean;
  filteredProjects: Project[];
  viewMode: "grid" | "list";
  currentUserId: string;
  handleCreateProject: () => void;
  search: string;
}) => (
  <AnimatePresence mode="wait">
    {isLoading ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex justify-center items-center py-20"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-base-content/60">Loading your projects...</p>
        </div>
      </motion.div>
    ) : filteredProjects.length === 0 ? (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-center py-20"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          className="inline-flex items-center justify-center w-24 h-24 bg-base-200 rounded-3xl mb-6"
        >
          <FolderOpen size={40} className="text-base-content/30" />
        </motion.div>
        <h3 className="text-xl font-semibold text-base-content mb-2">
          {search ? "No projects found" : "No projects yet"}
        </h3>
        <p className="text-base-content/60 mb-6 max-w-md mx-auto">
          {search
            ? `No projects match "${search}". Try adjusting your search terms.`
            : "Get started by creating your first project to organize your team's work."
          }
        </p>
        {!search && (
          <motion.button
            onClick={handleCreateProject}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary rounded-xl bg-gradient-to-r from-primary to-secondary gap-2"
          >
            <Plus size={20} />
            Create Your First Project
          </motion.button>
        )}
      </motion.div>
    ) : (
      <motion.div
        key={viewMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`grid gap-6 ${
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
        }`}
      >
        {filteredProjects.map((project: Project, index: number) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <ProjectCard project={project} currentUserId={currentUserId} />
          </motion.div>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

export default ProjectList;