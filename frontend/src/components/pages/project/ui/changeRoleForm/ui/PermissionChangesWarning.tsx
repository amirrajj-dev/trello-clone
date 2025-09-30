import { motion, AnimatePresence } from "framer-motion";

const PermissionChangesWarning = ({
  hasRoleChanged,
  currentRole,
  selectedRole,
}: {
  hasRoleChanged: boolean;
  currentRole: string;
  selectedRole: string;
}) => (
  <AnimatePresence>
    {hasRoleChanged && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="p-4 bg-warning/10 border border-warning/20 rounded-xl"
      >
        <h4 className="font-semibold text-warning text-sm mb-2">Permission Changes</h4>
        <ul className="text-warning/80 text-sm space-y-1">
          {selectedRole === "VIEWER" && currentRole !== "VIEWER" && (
            <li>• Will lose ability to create/edit tasks and comments</li>
          )}
          {selectedRole === "MEMBER" && currentRole === "ADMIN" && (
            <li>• Will lose ability to manage project settings and members</li>
          )}
          {selectedRole === "ADMIN" && currentRole !== "ADMIN" && (
            <li>• Will gain ability to manage project settings and members</li>
          )}
          {selectedRole === "MEMBER" && currentRole === "VIEWER" && (
            <li>• Will gain ability to create/edit tasks and comments</li>
          )}
        </ul>
      </motion.div>
    )}
  </AnimatePresence>
);

export default PermissionChangesWarning;