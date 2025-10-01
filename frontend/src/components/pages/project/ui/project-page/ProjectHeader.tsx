import { motion } from "framer-motion";
import { Folder, Plus, UserPlus, Users, Settings, Edit, Trash, Handshake, UserMinus } from "lucide-react";
import { ProjectWithDetails } from "@/types/interfaces/interfaces";
import { Role } from "@/types/enums/enums";

interface ProjectHeaderProps {
  project: ProjectWithDetails;
  currentUser: { id: string } | undefined;
  handleAddTask: () => void;
  handleAddMember: () => void;
  handleRemoveMember: () => void;
  handleEditProject: () => void;
  handleDeleteProject: () => void;
  handleTransferOwnerShip: () => void;
}

const ProjectHeader = ({
  project,
  currentUser,
  handleAddTask,
  handleAddMember,
  handleRemoveMember,
  handleEditProject,
  handleDeleteProject,
  handleTransferOwnerShip,
}: ProjectHeaderProps) => {
  const nonViewerMembers = project.members.filter(
    (member) => member.role !== Role.VIEWER
  );
  const adminMembers = project.members.filter(
    (member) => member.role === Role.ADMIN
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Project Info Section */}
        <div className="flex flex-col sm:flex-row items-start gap-4 w-full lg:w-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl self-start"
          >
            <Folder className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content break-words">
              {project.name}
            </h1>
            <p className="text-base-content/60 mt-2 text-base sm:text-lg break-words">
              {project.description || "No description provided"}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-base-content/60">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{project.members.length} members</span>
              </div>
              <div className="flex items-center gap-1">
                <Plus className="w-4 h-4" />
                <span>{project.tasks?.length || 0} tasks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        {nonViewerMembers.some((member) => member.user.id === currentUser?.id) && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-2">
              {nonViewerMembers.some((member) => member.user.id === currentUser?.id) && (
                <motion.button
                  onClick={handleAddTask}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary rounded-xl bg-gradient-to-r from-primary to-secondary gap-2 w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="xs:hidden">Task</span>
                </motion.button>
              )}
              {(project.ownerId === currentUser?.id ||
                adminMembers.some((member) => member.user.id === currentUser?.id)) && (
                <motion.button
                  onClick={handleAddMember}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-accent rounded-xl gap-2 w-full sm:w-auto"
                >
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Add Member</span>
                  <span className="xs:hidden">Member</span>
                </motion.button>
              )}
            </div>

            {/* Settings Dropdown */}
            {(project.ownerId === currentUser?.id ||
              adminMembers.some((member) => member.user.id === currentUser?.id)) && (
              <div className="dropdown dropdown-end z-50 self-end sm:self-auto fixed top-20 right-6 sm:top-auto sm:right-auto sm:relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  tabIndex={0}
                  className="btn btn-info sm:btn-ghost btn-circle sm:text-base-content/60 hover:text-base-content"
                >
                  <Settings className="w-5 h-5" />
                </motion.button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 sm:w-56 mt-2 border border-base-300"
                >
                  {project.ownerId === currentUser?.id && (
                    <>
                      <li>
                        <button
                          onClick={handleEditProject}
                          className="flex items-center gap-2 text-info hover:bg-info/10"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Project
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={handleTransferOwnerShip}
                          className="flex items-center gap-2 text-warning hover:bg-warning/10"
                        >
                          <Handshake className="w-4 h-4" />
                          Transfer Ownership
                        </button>
                      </li>
                      <li className="border-t border-base-300">
                        <button
                          onClick={handleDeleteProject}
                          className="flex items-center gap-2 text-error hover:bg-error/10"
                        >
                          <Trash className="w-4 h-4" />
                          Delete Project
                        </button>
                      </li>
                    </>
                  )}
                  <li>
                    <button
                      onClick={handleRemoveMember}
                      className="flex items-center gap-2 text-primary hover:bg-pritext-primary/10"
                    >
                      <UserMinus className="w-4 h-4" />
                      Remove Member
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectHeader;