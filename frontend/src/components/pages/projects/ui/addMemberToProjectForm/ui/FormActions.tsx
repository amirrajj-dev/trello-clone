import { motion } from "framer-motion";
import { UserPlus, Loader } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api/api.response";
import { MembershipResponse, Project} from "@/types/interfaces/interfaces";
import { Role } from "@/types/enums/enums";
import { useModal } from "@/stores/modal.store";

const FormActions = ({
  addMemberToProject,
  userId,
  role,
}: {
  addMemberToProject: UseMutationResult<
    {
      data: MembershipResponse;
    },
    Error,
    {
      userId: string;
      role?: Role;
      projectId: string;
    },
    {
      previousProject:
        | {
            data: Project;
          }
        | undefined;
      previousProjects: ApiResponse<Project[]> | undefined;
    }
  >;
  userId: string;
  role: string;
}) => {
  const { closeModal } = useModal();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex gap-3 pt-4 border-t border-base-300"
    >
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={closeModal}
        className="btn btn-ghost flex-1 rounded-xl border border-base-300 hover:bg-base-300 transition-all duration-200"
        disabled={addMemberToProject.isPending}
      >
        Cancel
      </motion.button>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-primary flex-1 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-content shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={
          addMemberToProject.isPending ||
          !userId ||
          userId === "-1" ||
          !role ||
          role === "-1"
        }
      >
        {addMemberToProject.isPending ? (
          <div className="flex items-center gap-2">
            <Loader size={16} className="animate-spin" />
            Adding...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <UserPlus size={16} />
            Add to Project
          </div>
        )}
      </motion.button>
    </motion.div>
  );
};

export default FormActions;
