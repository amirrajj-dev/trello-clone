import { motion } from "framer-motion";
import { Users } from "lucide-react";
import React from "react";

const RoleSelection = ({
  selectedRole,
  setSelectedRole,
  availableRoles,
  getRoleIcon,
  getRoleDescription,
}: {
  selectedRole: string;
  setSelectedRole: (value: string) => void;
  availableRoles: string[];
  getRoleIcon: (role: string) => React.JSX.Element;
  getRoleDescription: (role: string) => string;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 }}
    className="space-y-3"
  >
    <label className="flex items-center gap-2 text-sm font-medium text-base-content">
      <Users size={16} className="text-primary" />
      Select New Role
    </label>
    <div className="grid gap-3">
      {availableRoles.map((role) => (
        <motion.label
          key={role}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
            selectedRole === role
              ? "border-primary bg-primary/10"
              : "border-base-300 bg-base-200 hover:border-base-400"
          }`}
        >
          <input
            type="radio"
            name="role"
            value={role}
            checked={selectedRole === role}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="radio radio-primary"
          />
          <div className="flex items-center gap-3">
            {getRoleIcon(role)}
            <div>
              <span className="font-medium text-base-content capitalize">
                {role.toLowerCase()}
              </span>
              <p className="text-xs text-base-content/60 mt-1">
                {getRoleDescription(role)}
              </p>
            </div>
          </div>
        </motion.label>
      ))}
    </div>
  </motion.div>
);

export default RoleSelection;