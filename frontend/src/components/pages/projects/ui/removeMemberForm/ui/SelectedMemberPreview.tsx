import { motion, AnimatePresence } from "framer-motion";
import { ShieldOff } from "lucide-react";
import Image from "next/image";

const SelectedMemberPreview = ({
  selectedMember,
}: {
  selectedMember:
    | {
        user: {
          name: string;
          avatarUrl: string | null;
          id: string;
        };
      }
    | undefined;
}) => (
  <AnimatePresence>
    {selectedMember && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="flex items-center gap-3 p-4 bg-base-200/50 rounded-xl border border-base-300"
      >
        {selectedMember.user.avatarUrl ? (
          <Image
            src={selectedMember.user.avatarUrl}
            width={40}
            height={40}
            className="rounded-full border-2 border-base-100"
            alt={selectedMember.user.name}
          />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-error to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {selectedMember.user.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <p className="font-medium text-base-content">
            {selectedMember.user.name}
          </p>
          <p className="text-xs text-base-content/60">Team Member</p>
        </div>
        <ShieldOff size={16} className="text-error" />
      </motion.div>
    )}
  </AnimatePresence>
);

export default SelectedMemberPreview;