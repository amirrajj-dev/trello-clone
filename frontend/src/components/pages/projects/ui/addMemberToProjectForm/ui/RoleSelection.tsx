import { Role } from "@/types/enums/enums";
import { motion } from "framer-motion";
import { Shield, User, Eye } from "lucide-react";

const RoleSelection = ({
  role,
  setRole,
}: {
  role: Role | "-1";
  setRole: (value: Role) => void;
}) => {
  const getRoleIcon = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return <Shield size={16} className="text-blue-500" />;
      case Role.MEMBER:
        return <User size={16} className="text-green-500" />;
      case Role.VIEWER:
        return <Eye size={16} className="text-purple-500" />;
      default:
        return <User size={16} />;
    }
  };

  const getRoleDescription = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return "Manage members and project settings";
      case Role.MEMBER:
        return "Create and edit tasks, comment";
      case Role.VIEWER:
        return "View project and tasks only";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-3"
    >
      <label className="flex items-center gap-2 text-sm font-medium text-base-content">
        <Shield size={16} />
        Assign Role
      </label>
      <div className="grid gap-2">
        {Object.values(Role)
          .slice(1)
          .map((roleOption) => (
            <motion.label
              key={roleOption}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                role === roleOption
                  ? "border-primary bg-primary/10"
                  : "border-base-300 bg-base-200 hover:border-base-400"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={roleOption}
                checked={role === roleOption}
                onChange={(e) => setRole(e.target.value as Role)}
                className="radio radio-primary"
              />
              <div className="flex items-center gap-2">
                {getRoleIcon(roleOption)}
                <span className="font-medium text-base-content capitalize">
                  {roleOption.toLowerCase()}
                </span>
              </div>
              <span className="text-xs text-base-content/60 ml-auto">
                {getRoleDescription(roleOption)}
              </span>
            </motion.label>
          ))}
      </div>
    </motion.div>
  );
};

export default RoleSelection;