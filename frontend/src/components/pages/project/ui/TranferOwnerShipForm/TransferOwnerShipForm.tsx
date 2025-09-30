import { useTransferOwnership } from "@/hooks/mutations/transfer-ownership";
import { useModal } from "@/stores/modal.store";
import React, { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import TransferOwnerHeader from "./ui/TransferOwnerHeader";
import CriticalWarning from "./ui/CriticalWarning";
import NewOwnerSelection from "./ui/NewOwnerSelection";
import ConfirmationInput from "./ui/ConfirmationInput";
import FinalConfirmation from "./ui/FinalConfirmation";
import TransferActions from "./ui/TransferActions";

const TransferOwnerShipForm = ({
  projectId,
  projectMembers,
  currentUserId,
}: {
  projectId: string;
  projectMembers: Array<{
    user: {
      id: string;
      name: string;
      email: string;
      avatarUrl?: string;
    };
    role: string;
  }>;
  currentUserId: string;
}) => {
  const transferOwnerShip = useTransferOwnership(projectId);
  const { closeModal } = useModal();
  const [newOwnerId, setNewOwnerId] = useState("");
  const [confirmationText, setConfirmationText] = useState("");

  const eligibleMembers = projectMembers.filter(
    (member) => member.user.id !== currentUserId && member.role !== "VIEWER"
  );

  const selectedMember = eligibleMembers.find(
    (member) => member.user.id === newOwnerId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newOwnerId) {
      toast.error("Please select a new project owner");
      return;
    }

    if (confirmationText !== "transfer ownership") {
      toast.error('Please type "transfer ownership" to confirm');
      return;
    }

    transferOwnerShip.mutate({
      projectId,
      newOwnerId,
    });
  };

  const isFormValid = newOwnerId && confirmationText === "transfer ownership";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <TransferOwnerHeader />
      <CriticalWarning />
      <NewOwnerSelection
        newOwnerId={newOwnerId}
        setNewOwnerId={setNewOwnerId}
        eligibleMembers={eligibleMembers}
        selectedMember={selectedMember}
      />
      <ConfirmationInput
        confirmationText={confirmationText}
        setConfirmationText={setConfirmationText}
      />
      <FinalConfirmation isFormValid={isFormValid} selectedMember={selectedMember} />
      <TransferActions
        isPending={transferOwnerShip.isPending}
        isFormValid={isFormValid}
        closeModal={closeModal}
      />
    </motion.form>
  );
};

export default TransferOwnerShipForm;