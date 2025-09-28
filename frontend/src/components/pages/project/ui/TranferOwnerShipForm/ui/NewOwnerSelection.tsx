import { motion, AnimatePresence } from "framer-motion";
import { Users, UserCheck } from "lucide-react";

const NewOwnerSelection = ({
  newOwnerId,
  setNewOwnerId,
  eligibleMembers,
  selectedMember,
}: {
  newOwnerId: string;
  setNewOwnerId: (value: string) => void;
  eligibleMembers: Array<{
    user: { id: string; name: string; email: string; avatarUrl?: string };
    role: string;
  }>;
  selectedMember: { user: { id: string; name: string; email: string; avatarUrl?: string }; role: string } | undefined;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 }}
    className="space-y-3"
  >
    <label className="flex items-center gap-2 text-sm font-medium text-base-content">
      <Users size={16} className="text-warning" />
      Select New Project Owner
    </label>
    <motion.div whileHover={{ scale: 1.01 }}>
      <select
        value={newOwnerId}
        onChange={(e) => setNewOwnerId(e.target.value)}
        className="select select-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-warning/20 focus:border-warning transition-all duration-200 h-12"
      >
        <option value="" className="text-base-content/40">
          Choose a team member...
        </option>
        {eligibleMembers.map((member) => (
          <option key={member.user.id} value={member.user.id} className="text-base-content">
            {member.user.name} • {member.user.email}
          </option>
        ))}
      </select>
    </motion.div>
    <AnimatePresence>
      {selectedMember && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-3 p-4 bg-base-200/50 rounded-xl border border-base-300"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-warning to-amber-500 rounded-full flex items-center justify-center text-warning-content text-sm font-bold">
            {selectedMember.user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-medium text-base-content">{selectedMember.user.name}</p>
            <p className="text-xs text-base-content/60">{selectedMember.user.email}</p>
            <p className="text-xs text-warning mt-1">
              Current role: {selectedMember.role.toLowerCase()}
            </p>
          </div>
          <UserCheck size={16} className="text-warning" />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default NewOwnerSelection;