"use client"
import { motion } from "framer-motion";


const ProjectCardDescription = ({
  description,
  isHovered,
}: {
  description: string;
  isHovered: boolean;
}) => (
  <motion.p
    animate={{ height: isHovered ? "auto" : "3rem" }}
    className="text-base-content/90 leading-relaxed line-clamp-2 mb-4 overflow-hidden relative z-0 transition-all duration-300"
  >
    {description || "No description provided for this project."}
  </motion.p>
);

export default ProjectCardDescription