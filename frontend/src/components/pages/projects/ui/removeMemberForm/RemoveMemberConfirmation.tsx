import { useRemoveMemberFromProject } from "@/hooks/mutations/remove-member-from-project";
import { useModal } from "@/stores/modal.store";
import React, { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import RemoveMemberHeader from "./ui/RemoveMemberHeader";
import UserSelection from "./ui/UserSelection";
import SelectedMemberPreview from "./ui/SelectedMemberPreview";
import WarningMessage from "./ui/WarningMessage";
import FormActions from "./ui/FormActions";

interface RemoveMemberConfirmationProps {
  projectId: string;
  projectMembers: {
    user: {
      name: string;
      avatarUrl: string | null;
      id: string;
    };
  }[];
  projectOwnerName: string;
}

const RemoveMemberConfirmation = ({
  projectId,
  projectMembers,
  projectOwnerName,
}: RemoveMemberConfirmationProps) => {
  const removeMemberFromProject = useRemoveMemberFromProject();
  const [userId, setUserId] = useState<string>("-1");
  const { closeModal } = useModal();

  const handleRemoveUserFromProject = () => {
    if (!userId || userId === "-1") {
      toast.error("Please select a user to remove");
      return;
    }

    const selectedMember = projectMembers.find(
      (member) => member.user.id === userId
    );

    if (!selectedMember) {
      toast.error("Selected user not found");
      return;
    }

    removeMemberFromProject.mutate({ projectId, memberId: userId });
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(e.target.value);
  };

  const selectedMember = projectMembers.find(
    (member) => member.user.id === userId
  );

  const isFormValid = Boolean(userId && userId !== "-1");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <RemoveMemberHeader />
      <UserSelection
        userId={userId}
        handleUserChange={handleUserChange}
        projectMembers={projectMembers}
        projectOwnerName={projectOwnerName}
      />
      <SelectedMemberPreview selectedMember={selectedMember} />
      <WarningMessage selectedMember={selectedMember} />
      <FormActions
        isFormValid={isFormValid}
        isPending={removeMemberFromProject.isPending}
        handleRemoveUserFromProject={handleRemoveUserFromProject}
        closeModal={closeModal}
      />
    </motion.div>
  );
};

export default RemoveMemberConfirmation;