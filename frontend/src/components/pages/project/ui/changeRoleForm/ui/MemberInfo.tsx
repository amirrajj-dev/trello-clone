import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import React from "react";

const MemberInfo = ({
  memberName,
  currentRole,
  selectedRole,
  getRoleIcon,
  getRoleColor,
}: {
  memberName: string;
  currentRole: string;
  selectedRole: string;
  getRoleIcon: (role: string) => React.JSX.Element;
  getRoleColor: (role: string) => string;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 }}
    className="p-4 bg-base-200/50 rounded-xl border border-base-300"
  >
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-content text-lg font-bold">
        {memberName?.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-base-content">{memberName}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className={`size-14 rounded-full text-xs font-medium border flex flex-col gap-0.5 items-center justify-center ${getRoleColor(currentRole)}`}>
            {getRoleIcon(currentRole)}
            <span className="capitalize">{currentRole.toLowerCase()}</span>
          </div>
          <MoveRight className={`${selectedRole === currentRole ? "text-base-content/60" : "text-base-content"}`} />
          <div className={`size-14 flex flex-col items-center justify-center gap-0.5 rounded-full text-xs font-medium border ${getRoleColor(selectedRole)}`}>
            {getRoleIcon(selectedRole)}
            <span className="capitalize px-1">{selectedRole.toLowerCase()}</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default MemberInfo;