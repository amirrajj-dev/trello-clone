import { motion } from "framer-motion";

const UserInfo = ({
  currentUser,
}: {
  currentUser: { name: string; email: string } | undefined;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 }}
    className="p-4 bg-base-200/50 rounded-xl border border-base-300"
  >
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center text-error-content text-lg font-bold">
        {currentUser?.name?.charAt(0).toUpperCase()}
      </div>
      <div>
        <p className="font-semibold text-base-content">{currentUser?.name}</p>
        <p className="text-base-content/60 text-sm">{currentUser?.email}</p>
        <p className="text-error text-xs mt-1">Account scheduled for deletion</p>
      </div>
    </div>
  </motion.div>
);

export default UserInfo;