import { motion } from "framer-motion";
import { Folder } from "lucide-react";
import Link from "next/link";

const NotFoundState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-20"
  >
    <Folder size={64} className="mx-auto text-base-content/20 mb-4" />
    <h3 className="text-xl font-semibold text-base-content mb-2">
      Project Not Found
    </h3>
    <p className="text-base-content/60 mb-6">
      The project you're looking for doesn't exist or you don't have access to it.
    </p>
    <Link href="/projects" className="btn btn-primary">
      Back to Projects
    </Link>
  </motion.div>
);

export default NotFoundState;