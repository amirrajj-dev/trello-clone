import { useUpdateProject } from "@/hooks/mutations/update-project";
import { useModal } from "@/stores/modal.store";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import EditProjectHeader from "./ui/EditProjectHeader";
import ChangesIndicator from "./ui/ChangesIndicator";
import ProjectNameInput from "./ui/ProjectNameInput";
import ProjectDescriptionInput from "./ui/ProjectDescriptionInput";
import FormActions from "./ui/FormActions";

const EditProjectForm = ({
  projectId,
  projectDescription,
  projectName,
}: {
  projectId: string;
  projectName: string;
  projectDescription?: string | null;
}) => {
  const [name, setName] = useState(projectName || "");
  const [originalName, setOriginalName] = useState(projectName || "");
  const [description, setDescription] = useState(projectDescription || "");
  const [originalDescription, setOriginalDescription] = useState(
    projectDescription || ""
  );
  const { closeModal } = useModal();
  const updateProject = useUpdateProject();

  const hasChanges =
    name !== originalName || description !== originalDescription;

  useEffect(() => {
    setOriginalName(projectName || "");
    setOriginalDescription(projectDescription || "");
    setName(projectName || "");
    setDescription(projectDescription || "");
  }, [projectName, projectDescription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (!hasChanges) {
      toast.info("No changes detected");
      return;
    }

    updateProject.mutate({ name, description, projectId });
  };

  const handleReset = () => {
    setName(originalName);
    setDescription(originalDescription);
  };

  const isFormValid = name.trim().length > 0 && hasChanges;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <EditProjectHeader />
      <ChangesIndicator hasChanges={hasChanges} handleReset={handleReset} />
      <ProjectNameInput
        name={name}
        setName={setName}
        originalName={originalName}
      />
      <ProjectDescriptionInput
        description={description}
        setDescription={setDescription}
        originalDescription={originalDescription}
      />
      <FormActions
        isFormValid={isFormValid}
        isPending={updateProject.isPending}
        closeModal={closeModal}
      />
    </motion.form>
  );
};

export default EditProjectForm;