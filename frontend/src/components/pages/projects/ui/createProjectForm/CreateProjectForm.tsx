import { useCreateProject } from "@/hooks/mutations/create-project";
import { useModal } from "@/stores/modal.store";
import React, { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import CreateProjectHeader from "./ui/CreateProjectHeader";
import ProjectNameInput from "./ui/ProjectNameInput";
import ProjectDescriptionInput from "./ui/ProjectDescriptionInput";
import FormCharacterCounter from "./ui/FormCharacterCounter";
import FormActions from "./ui/FormActions";

const CreateProjectForm = () => {
  const createProject = useCreateProject();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { closeModal } = useModal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (name.trim().length < 4) {
      toast.error("Project name must be minimum 4 characters long");
      return;
    }

    if (name && description.trim()) {
      if (description.trim().length < 4) {
        toast.error("Project description must be minimum 4 characters long");
        return;
      }
      createProject.mutate({ name, description });
    } else {
      createProject.mutate({ name });
    }
  };

  const isFormValid = name.trim().length > 0;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <CreateProjectHeader />
      <ProjectNameInput
        name={name}
        setName={setName}
        isPending={createProject.isPending}
      />
      <ProjectDescriptionInput
        description={description}
        setDescription={setDescription}
        isPending={createProject.isPending}
      />
      <FormCharacterCounter nameLength={name.length} />
      <FormActions
        isPending={createProject.isPending}
        isFormValid={isFormValid}
        closeModal={closeModal}
      />
    </motion.form>
  );
};

export default CreateProjectForm;
