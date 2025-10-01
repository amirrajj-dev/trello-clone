"use client";
import { Project } from "@/types/interfaces/interfaces";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar } from "lucide-react";
import Link from "next/link";

const ProjectCardFooter = ({
  project,
  isHovered,
}: {
  project: Project;
  isHovered: boolean;
}) => (
  <motion.div
    animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.8 }}
    className="flex items-center justify-between relative z-0"
  >
    <div className="flex items-center gap-2 text-xs text-base-content/40">
      <Calendar size={12} />
      <span>Updated recently</span>
    </div>

    <Link href={`/projects/${project.id}`}>
      <motion.button
        whileHover={{ scale: 1.05, x: 2 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 cursor-pointer text-primary-content px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
      >
        View Project
        <motion.div
          animate={{ x: isHovered ? 2 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowUpRight size={14} />
        </motion.div>
      </motion.button>
    </Link>
  </motion.div>
);

export default ProjectCardFooter