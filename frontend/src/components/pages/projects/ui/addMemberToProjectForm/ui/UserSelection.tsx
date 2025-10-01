import { Role } from "@/types/enums/enums";
import { User } from "@/types/interfaces/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";

interface UserSelectionProps {
  users: User[] | undefined;
  userId: string;
  setUserId: (value: string) => void;
  projectMembers: string[];
}

const UserSelection = ({
  users,
  userId,
  setUserId,
  projectMembers,
}: UserSelectionProps) => {
  const selectedUser = users?.find((user) => user.id === userId);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-3"
    >
      <label className="flex items-center gap-2 text-sm font-medium text-base-content">
        <Users size={16} />
        Select Team Member
      </label>
      <select
        className="select select-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        required
      >
        <option value="-1" className="text-base-content/40">
          Choose a team member...
        </option>
        {users &&
          users.filter(user=>!projectMembers.includes(user.name))
            .map((user) => (
              <option
                key={user.id}
                value={user.id}
                className="text-base-content"
              >
                {user.name} • {user.email}
              </option>
            ))}
      </select>
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg border border-base-300"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
              {selectedUser.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-base-content">
                {selectedUser.name}
              </p>
              <p className="text-xs text-base-content/60">
                {selectedUser.email}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserSelection;
