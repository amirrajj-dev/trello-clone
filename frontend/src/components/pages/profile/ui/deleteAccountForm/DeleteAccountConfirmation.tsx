import { useDeleteUser } from "@/hooks/mutations/delete-user";
import { useModal } from "@/stores/modal.store";
import { useGetMe } from "@/hooks/queries/user";
import React, { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import DeleteAccountHeader from "./ui/DeleteAccountHeader";
import CriticalWarning from "./ui/CriticalWarning";
import UserInfo from "./ui/UserInfo";
import ConfirmationInputs from "./ui/ConfirmationInputs";
import FinalWarning from "./ui/FinalWarning";
import FormActions from "./ui/FormActions";

const DeleteAccountConfirmation = () => {
  const deleteUser = useDeleteUser();
  const { closeModal } = useModal();
  const { data: currentUser } = useGetMe();
  const [confirmationText, setConfirmationText] = useState("");
  const [deleteMyAccount, setDeleteMyAccount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (confirmationText !== "delete my account") {
      toast.error('Please type "delete my account" to confirm');
      return;
    }

    if (deleteMyAccount !== currentUser?.name) {
      toast.error(`Please type your username "${currentUser?.name}" to confirm`);
      return;
    }

    deleteUser.mutate(currentUser!.id);
  };

  const isValid =
    confirmationText === "delete my account" &&
    deleteMyAccount === currentUser?.name;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <DeleteAccountHeader />
      <CriticalWarning />
      <UserInfo currentUser={currentUser} />
      <ConfirmationInputs
        confirmationText={confirmationText}
        setConfirmationText={setConfirmationText}
        deleteMyAccount={deleteMyAccount}
        setDeleteMyAccount={setDeleteMyAccount}
        currentUser={currentUser}
      />
      <FinalWarning isValid={isValid} />
      <FormActions
        isPending={deleteUser.isPending}
        isValid={isValid}
        closeModal={closeModal}
      />
    </motion.form>
  );
};

export default DeleteAccountConfirmation;