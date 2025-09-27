import { motion } from "framer-motion";
import { Users } from "lucide-react";

const UserSelection = ({
  userId,
  handleUserChange,
  projectMembers,
  projectOwnerName,
}: {
  userId: string;
  handleUserChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  projectMembers: {
    user: {
      name: string;
      avatarUrl: string | null;
      id: string;
    };
  }[];
  projectOwnerName: string;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 }}
    className="space-y-3"
  >
    <label className="flex items-center gap-2 text-sm font-medium text-base-content">
      <Users size={16} className="text-error" />
      Select Team Member to Remove
    </label>
    <motion.div whileHover={{ scale: 1.01 }}>
      <select
        className="select select-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-error/20 focus:border-error transition-all duration-200 h-12"
        value={userId}
        onChange={handleUserChange}
      >
        <option value="-1" className="text-base-content/40">
          Choose a team member...
        </option>
        {projectMembers
          .filter(
            (member) =>
              member.user.name.toLowerCase() !== projectOwnerName.toLowerCase()
          )
          .map((member) => (
            <option
              value={member.user.id}
              key={member.user.id}
              className="text-base-content"
            >
              {member.user.name}
            </option>
          ))}
      </select>
    </motion.div>
  </motion.div>
);

export default UserSelection;