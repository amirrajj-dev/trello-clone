import { useAddMemberToProject } from "@/hooks/mutations/add-member-to-project";
import { useGetUsers } from "@/hooks/queries/users";
import { useModal } from "@/stores/modal.store";
import { Role } from "@/types/enums/enums";
import React, { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import AddMemberHeader from "./ui/AddMemberHeader";
import UserSelection from "./ui/UserSelection";
import RoleSelection from "./ui/RoleSelection";
import FormActions from "./ui/FormActions";

const AddMemberToProjectForm = ({
  projectId,
  projectName,
  projectOwnerName,
}: {
  projectId: string;
  projectName: string;
  projectOwnerName: string;
}) => {
  const { data: users, error: usersError } = useGetUsers();
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<Role | "-1">(Role.MEMBER);
  const { closeModal } = useModal();
  const addMemberToProject = useAddMemberToProject();

  if (usersError) {
    toast.error(usersError.message || "Failed to load users");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || userId === "-1") {
      toast.error("Please select a user");
      return;
    }

    if (!role || role === "-1") {
      toast.error("Please select a role");
      return;
    }

    addMemberToProject.mutate({ projectId, userId, role });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      <AddMemberHeader projectName={projectName} />
      <UserSelection
        users={users}
        userId={userId}
        setUserId={setUserId}
        projectOwnerName={projectOwnerName}
      />
      <RoleSelection role={role} setRole={setRole} />
      <FormActions
        addMemberToProject={addMemberToProject}
        userId={userId}
        role={role}
        closeModal={closeModal}
      />
    </motion.form>
  );
};

export default AddMemberToProjectForm;