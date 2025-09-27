"use client";
import AddMemberToProjectForm from "@/components/pages/projects/ui/addMemberToProjectForm/AddMemberToProjectForm";
import CreateTaskForm from "@/components/pages/projects/ui/createTaskForm/CreateTaskForm";
import DeleteProjectConfirmation from "@/components/pages/projects/ui/deleteProjectForm/DeleteProjectConfirmation";
import EditProjectForm from "@/components/pages/projects/ui/editProjectForm/EditProjectForm";
import RemoveMemberConfirmation from "@/components/pages/projects/ui/removeMemberForm/RemoveMemberConfirmation";
import { useModal } from "@/stores/modal.store";
import { Project } from "@/types/interfaces/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Folder,
  ListCheck,
  MoreHorizontal,
  Trash2,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { RefObject } from "react";
import { toast } from "sonner";

const ProjectCardHeader = ({
  project,
  currentUserId,
  isHovered,
  isMenuOpen,
  setIsMenuOpen,
  menuRef,
}: {
  project: Project;
  currentUserId: string;
  isHovered: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  menuRef: RefObject<HTMLDivElement | null>;
}) => {
  const pathname = usePathname();
  const { openModal } = useModal();

  const handleEdit = () => {
    setIsMenuOpen(false);
    openModal(
      <EditProjectForm
        projectName={project.name}
        projectDescription={project.description}
        projectId={project.id}
      />,
      "Edit Project"
    );
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    openModal(
      <DeleteProjectConfirmation
        projectName={project.name}
        projectId={project.id}
      />,
      "Delete Confirmation"
    );
  };

  const handleAddMember = () => {
    setIsMenuOpen(false);
    openModal(
      <AddMemberToProjectForm
        projectId={project.id}
        projectName={project.name}
        projectOwnerName={project.owner.name}
      />,
      "Add Member To The Project"
    );
  };
  const handleAddTask = () => {
    setIsMenuOpen(false);
    openModal(
      <CreateTaskForm
        projectId={project.id}
        projectMembers={project.members}
      />,
      "Create Task Form"
    );
  };
  const handleRemoveMember = () => {
    setIsMenuOpen(false);
    if (
      project.members.filter(
        (member) => member.user.name !== project.owner.name
      ).length > 0
    ){
      openModal(
        <RemoveMemberConfirmation
          projectId={project.id}
          projectMembers={project.members}
          projectOwnerName={project.owner.name}
        />,
        "Remove Member From Project"
      );
    }else {
      toast.warning('Add project member first !')
    }
  };

  return (
    <div className="flex items-start justify-between mb-4 relative z-10">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl">
          <Folder className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-base-content truncate pr-10">
            {project.name}
          </h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
            className="text-sm text-base-content/60 mt-1"
          >
            {project._count.tasks} tasks • {project._count.members} members
          </motion.div>
        </div>
      </div>

      {pathname.includes("projects") && project.ownerId === currentUserId && (
        <div className="relative" ref={menuRef}>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-base-content/40 hover:text-base-content hover:bg-base-content/10 rounded-xl transition-colors"
          >
            <MoreHorizontal size={16} />
          </motion.button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-base-100 rounded-xl shadow-xl border border-base-300 z-50 overflow-hidden"
              >
                <li>
                  <button
                    onClick={handleEdit}
                    className="flex items-center cursor-pointer gap-3 w-full px-4 py-3 text-base-content hover:bg-base-300 transition-colors"
                  >
                    <Edit size={16} className="text-info" />
                    <span>Edit Project</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleRemoveMember}
                    className="flex items-center cursor-pointer gap-3 w-full px-4 py-3 text-base-content hover:bg-base-300 transition-colors"
                  >
                    <UserMinus size={16} className="text-warning" />
                    <span>Remove Member</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleAddMember}
                    className="flex items-center cursor-pointer gap-3 w-full px-4 py-3 text-base-content hover:bg-base-300 transition-colors"
                  >
                    <UserPlus size={16} className="text-success" />
                    <span>Add Member</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleAddTask}
                    className="flex items-center cursor-pointer gap-3 w-full px-4 py-3 text-base-content hover:bg-base-300 transition-colors"
                  >
                    <ListCheck size={16} className="text-accent" />
                    <span>Add Task</span>
                  </button>
                </li>
                <li className="border-t border-base-300">
                  <button
                    onClick={handleDelete}
                    className="flex items-center cursor-pointer gap-3 w-full px-4 py-3 text-error hover:bg-error/10 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Delete Project</span>
                  </button>
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ProjectCardHeader;
