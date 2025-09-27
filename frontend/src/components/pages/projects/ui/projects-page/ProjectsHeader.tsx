import { motion } from "framer-motion";
import { FolderOpen, Plus } from "lucide-react";

const ProjectsHeader = ({ handleCreateProject }: { handleCreateProject: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6"
  >
    <div className="flex items-center gap-4">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl"
      >
        <FolderOpen size={28} className="text-primary" />
      </motion.div>
      <div>
        <h1 className="text-4xl font-bold text-base-content">My Projects</h1>
        <p className="text-base-content/60 mt-1">
          Manage and organize your team's work
        </p>
      </div>
    </div>
    <motion.button
      onClick={handleCreateProject}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="btn btn-primary rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-content shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
    >
      <Plus size={20} className="mr-2" />
      Create Project
    </motion.button>
  </motion.div>
);

export default ProjectsHeader;