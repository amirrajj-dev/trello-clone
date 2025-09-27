import { Project } from "@/types/interfaces/interfaces";
import { motion, AnimatePresence } from "framer-motion";

const ResultsCount = ({
  isLoading,
  filteredProjects,
  projects,
  search,
  setSearch,
}: {
  isLoading: boolean;
  filteredProjects: Project[];
  projects: Project[];
  search: string;
  setSearch: (value: string) => void;
}) => (
  <AnimatePresence>
    {!isLoading && filteredProjects.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mt-8 pt-6 border-t border-base-300/50"
      >
        <p className="text-base-content/60 text-sm">
          Showing <span className="font-semibold text-base-content">{filteredProjects.length}</span> of{" "}
          <span className="font-semibold text-base-content">{projects.length}</span> projects
        </p>
        {search && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSearch("")}
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            Clear search
          </motion.button>
        )}
      </motion.div>
    )}
  </AnimatePresence>
);

export default ResultsCount;