import { motion } from "framer-motion";

const CommentsCount = ({ taskComments }: { taskComments: any[] | undefined }) => (
  <>
    {taskComments && taskComments.length > 0 && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <p className="text-base-content/40 text-sm">
          {taskComments.length} comment{taskComments.length !== 1 ? "s" : ""}
        </p>
      </motion.div>
    )}
  </>
);

export default CommentsCount;