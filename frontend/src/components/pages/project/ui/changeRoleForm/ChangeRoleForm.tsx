import { useChangeRole } from "@/hooks/mutations/change-role";
import { useModal } from "@/stores/modal.store";
import React, { useState } from "react";
import { toast } from "sonner";
import { Role } from "@/types/enums/enums";
import ChangeRoleHeader from "./ui/ChangeRoleHeader";
import MemberInfo from "./ui/MemberInfo";
import RoleSelection from "./ui/RoleSelection";
import ChangeIndicator from "./ui/ChangeIndicator";
import PermissionChangesWarning from "./ui/PermissionChangesWarning";
import ConfirmationInput from "./ui/ConfirmationInput";
import FormActions from "./ui/FormActions";
import { motion } from "framer-motion";
import { Shield, User, Eye } from "lucide-react";

const ChangeRoleForm = ({
  memberId,
  projectId,
  memberName,
  currentRole,
  isCurrentUserOwner,
}: {
  projectId: string;
  memberId: string;
  memberName: string;
  currentRole: string;
  currentUserId: string;
  isCurrentUserOwner: boolean;
}) => {
  const changeMemberRole = useChangeRole(projectId);
  const { closeModal } = useModal();
  const [selectedRole, setSelectedRole] = useState<string>(currentRole);
  const [confirmationText, setConfirmationText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRole === currentRole) {
      toast.error("Please select a different role");
      return;
    }

    if (!isCurrentUserOwner && confirmationText !== "change role") {
      toast.error('Please type "change role" to confirm');
      return;
    }

    changeMemberRole.mutate(
      {
        projectId,
        userId: memberId,
        role: selectedRole as Role,
      },
      {
        onSuccess: () => {
          closeModal();
        },
      }
    );
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield size={20} className="text-blue-500" />;
      case "MEMBER":
        return <User size={20} className="text-green-500" />;
      case "VIEWER":
        return <Eye size={20} className="text-purple-500" />;
      default:
        return <User size={20} />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Can manage members and project settings";
      case "MEMBER":
        return "Can create and edit tasks, comment on projects";
      case "VIEWER":
        return "Can only view project and tasks (read-only)";
      default:
        return "";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-blue-500/20 text-blue-600 border-blue-500/30";
      case "MEMBER":
        return "bg-green-500/20 text-green-600 border-green-500/30";
      case "VIEWER":
        return "bg-purple-500/20 text-purple-600 border-purple-500/30";
      default:
        return "bg-base-300 text-base-content border-base-300";
    }
  };

  const availableRoles = ["ADMIN", "MEMBER", "VIEWER"];
  const hasRoleChanged = selectedRole !== currentRole;
  const isFormValid =
    hasRoleChanged && (isCurrentUserOwner || confirmationText === "change role");

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <ChangeRoleHeader />
      <MemberInfo
        memberName={memberName}
        currentRole={currentRole}
        selectedRole={selectedRole}
        getRoleIcon={getRoleIcon}
        getRoleColor={getRoleColor}
      />
      <RoleSelection
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        availableRoles={availableRoles}
        getRoleIcon={getRoleIcon}
        getRoleDescription={getRoleDescription}
      />
      <ChangeIndicator
        hasRoleChanged={hasRoleChanged}
        currentRole={currentRole}
        selectedRole={selectedRole}
      />
      <PermissionChangesWarning
        hasRoleChanged={hasRoleChanged}
        currentRole={currentRole}
        selectedRole={selectedRole}
      />
      <ConfirmationInput
        isCurrentUserOwner={isCurrentUserOwner}
        hasRoleChanged={hasRoleChanged}
        confirmationText={confirmationText}
        setConfirmationText={setConfirmationText}
      />
      <FormActions
        isPending={changeMemberRole.isPending}
        isFormValid={isFormValid}
        closeModal={closeModal}
      />
    </motion.form>
  );
};

export default ChangeRoleForm;