import { motion } from "framer-motion";
import { Edit, Award } from "lucide-react";
import Image from "next/image";
import { useModal } from "@/stores/modal.store";
import UpdateUserForm from "@/components/pages/profile/ui/updateUserForm/UpdateUserForm";
import DeleteAccountConfirmation from "@/components/pages/profile/ui/deleteAccountForm/DeleteAccountConfirmation";
import { User } from "@/types/interfaces/interfaces";

const ProfileHeader = ({
  user,
  profileCompletion,
}: {
  user: User;
  profileCompletion: number;
}) => {
  const { openModal } = useModal();

  const handleEditProfile = () => {
    if (user) {
      openModal(<UpdateUserForm />, "Edit Profile");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-base-200/80 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-base-300/50 shadow-lg"
    >
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
        <div className="flex items-start gap-6">
          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <div className="w-24 h-24 rounded-2xl border-4 border-base-100 shadow-lg overflow-hidden">
              <Image
                src={user?.avatarUrl || "/avatar-placeholder.jpg"}
                alt="User avatar"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            {profileCompletion === 100 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center"
              >
                <Award size={12} className="text-success-content" />
              </motion.div>
            )}
          </motion.div>
          <div className="space-y-3">
            <div>
              <h1 className="text-3xl font-bold text-base-content">
                {user?.name}
              </h1>
              <p className="text-base-content/60 text-lg">{user?.email}</p>
            </div>
            {profileCompletion !== 100 && (
              <motion.div
                className="space-y-2 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-base-content/70">
                    Profile Completion
                  </span>
                  <span className="font-semibold text-primary">
                    {profileCompletion.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2.5">
                  <motion.div
                    className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${profileCompletion}%` }}
                    transition={{ duration: 1, type: "spring" }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"
                      animate={{ x: ["0%", "200%"] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                  </motion.div>
                </div>
                <p className="text-xs text-base-content/50">
                  Complete your profile by adding an avatar and updating your
                  information
                </p>
              </motion.div>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
          <motion.button
            onClick={handleEditProfile}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary rounded-xl bg-gradient-to-r from-primary to-secondary gap-3 px-6"
          >
            <Edit size={20} />
            Edit Profile
          </motion.button>
          <motion.button
            onClick={() =>
              openModal(<DeleteAccountConfirmation />, "Delete Account")
            }
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-error btn-soft rounded-xl border border-base-300 hover:border-error/30 hover:bg-error/10 text-error gap-3"
          >
            Delete Account
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;