import { useUpdateUser } from "@/hooks/mutations/update-user";
import { useModal } from "@/stores/modal.store";
import { useGetMe } from "@/hooks/queries/user";
import React, { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import UpdateUserHeader from "./ui/UpdateUserHeader";
import AvatarUpload from "./ui/AvatarUpload";
import NameInput from "./ui/NameInput";
import EmailInput from "./ui/Emailnput";
import ChangeIndicator from "./ui/ChangeIndicator";
import FormActions from "./ui/FormActions";

const UpdateUserForm = () => {
  const updateUser = useUpdateUser();
  const { closeModal } = useModal();
  const { data: currentUser } = useGetMe();
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(
    currentUser?.avatarUrl || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (name.length < 6 || name.length > 30) {
      toast.error("Name must be between 6 and 30 characters");
      return;
    }

    const updateData: { name?: string; email?: string; avatarUrl?: string } = {};
    if (name.trim() !== currentUser?.name.trim()) updateData.name = name;
    if (email.trim() !== currentUser?.email.trim()) updateData.email = email;
    if (avatarPreview !== currentUser?.avatarUrl && !avatarFile) {
      updateData.avatarUrl = avatarPreview;
    }
    updateUser.mutate({
      id: currentUser!.id,
      data: updateData,
      file: avatarFile || undefined,
    });
  };

  const hasChanges =
    name !== currentUser?.name ||
    email !== currentUser?.email ||
    avatarPreview !== currentUser?.avatarUrl;

  const isFormValid =
    name.trim().length >= 6 &&
    name.trim().length <= 30 &&
    email.trim().length > 0;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <UpdateUserHeader />
      <AvatarUpload
        avatarPreview={avatarPreview}
        setAvatarPreview={setAvatarPreview}
        avatarFile={avatarFile}
        setAvatarFile={setAvatarFile}
        currentUser={currentUser}
      />
      <NameInput name={name} setName={setName} />
      <EmailInput email={email} setEmail={setEmail} />
      <ChangeIndicator hasChanges={hasChanges} />
      <FormActions
        isPending={updateUser.isPending}
        isFormValid={isFormValid}
        hasChanges={hasChanges}
        closeModal={closeModal}
      />
    </motion.form>
  );
};

export default UpdateUserForm;