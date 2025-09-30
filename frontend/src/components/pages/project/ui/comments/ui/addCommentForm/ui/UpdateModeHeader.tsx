import { motion, AnimatePresence } from "framer-motion";
import { Edit3, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const UpdateModeHeader = ({
  isInUpdateMode,
  isPendingUpdateComment,
  setIsInUpdateMode,
  setNewComment,
}: {
  isInUpdateMode: boolean;
  isPendingUpdateComment: boolean;
  setIsInUpdateMode: Dispatch<SetStateAction<boolean>>;
  setNewComment: (value: string) => void;
}) => (
  <AnimatePresence>
    {isInUpdateMode && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="p-4 bg-warning/10 border border-warning/20 rounded-xl"
      >
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="p-2 bg-warning/20 rounded-lg"
          >
            <Edit3 size={16} className="text-warning" />
          </motion.div>
          <div className="flex-1">
            <h4 className="font-semibold text-warning text-sm mb-1">
              Editing Comment
            </h4>
            <p className="text-warning/80 text-sm">
              You are currently editing your comment. Changes will be saved when
              you click "Update Comment".
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsInUpdateMode(false);
              setNewComment("");
            }}
            className="p-2 text-warning hover:text-warning/80 hover:bg-warning/10 rounded-lg transition-colors"
            disabled={isPendingUpdateComment}
          >
            <X size={16} />
          </motion.button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default UpdateModeHeader;