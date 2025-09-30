import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid, List } from "lucide-react";

const SearchAndControls = ({
  search,
  setSearch,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
}: {
  search: string;
  setSearch: (value: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  sortBy: "name" | "date" | "progress";
  setSortBy: (sort: "name" | "date" | "progress") => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="flex flex-col sm:flex-row gap-4 mb-8"
  >
    <div className="flex-1 relative">
      <motion.div whileHover={{ scale: 1.02 }} className="relative">
        <input
          type="text"
          placeholder="Search projects by name or description..."
          className="input input-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary pl-12 pr-4 h-12 transition-all duration-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
       <Search className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50" />
        <AnimatePresence>
          {search && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
            >
              ×
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    <div className="flex items-center gap-3">
      <motion.div whileHover={{ scale: 1.05 }} className="dropdown dropdown-end">
        <label
          tabIndex={0}
          className="btn btn-ghost rounded-xl border border-base-300 gap-2"
        >
          <Filter size={16} />
          Sort: {sortBy === "name" ? "Name" : sortBy === "date" ? "Recent" : "Progress"}
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-2 border border-base-300"
        >
          <li>
            <button onClick={() => setSortBy("name")}>Sort by Name</button>
          </li>
          <li>
            <button onClick={() => setSortBy("date")}>Sort by Recent</button>
          </li>
          <li>
            <button onClick={() => setSortBy("progress")}>Sort by Progress</button>
          </li>
        </ul>
      </motion.div>
      <motion.div className="flex items-center gap-1 p-1 bg-base-200 rounded-xl">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setViewMode("grid")}
          className={`p-2 rounded-lg transition-all duration-200 ${
            viewMode === "grid" ? "bg-primary text-primary-content" : "text-base-content/60"
          }`}
        >
          <Grid size={18} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setViewMode("list")}
          className={`p-2 rounded-lg transition-all duration-200 ${
            viewMode === "list" ? "bg-primary text-primary-content" : "text-base-content/60"
          }`}
        >
          <List size={18} />
        </motion.button>
      </motion.div>
    </div>
  </motion.div>
);

export default SearchAndControls;