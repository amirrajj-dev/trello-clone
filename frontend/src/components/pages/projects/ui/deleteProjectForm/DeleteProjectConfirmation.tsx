import { useDeleteProject } from "@/hooks/mutations/delete-project";
import { useModal } from "@/stores/modal.store";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import DeleteProjectHeader from "./ui/DeleteProjectHeader";
import CriticalWarning from "./ui/CriticalWarning";
import AttemptsWarning from "./ui/AttemptsWarning";
import ConfirmationInputs from "./ui/ConfirmationInputs";
import ValidationSuccess from "./ui/ValidationSuccess";
import FormActions from "./ui/FormActions";

const DeleteProjectConfirmation = ({
  projectName,
  projectId,
}: {
  projectName: string;
  projectId: string;
}) => {
  const { closeModal } = useModal();
  const deleteProject = useDeleteProject();
  const [deleteMyProject, setDeleteMyProject] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [attempts, setAttempts] = useState(0);

  const isValid =
    projectTitle.trim().toLowerCase() === projectName.toLowerCase() &&
    deleteMyProject.toLowerCase() === "delete my project";

  const handleDeleteProject = () => {
    if (isValid) {
      deleteProject.mutate({projectId});
    } else {
      toast.error("Please fill the confirmation fields correctly");
      setAttempts((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (isValid) {
      setAttempts(0);
    }
  }, [isValid]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <DeleteProjectHeader />
      <CriticalWarning projectName={projectName} />
      <AttemptsWarning attempts={attempts} />
      <ConfirmationInputs
        projectName={projectName}
        deleteMyProject={deleteMyProject}
        setDeleteMyProject={setDeleteMyProject}
        projectTitle={projectTitle}
        setProjectTitle={setProjectTitle}
      />
      <ValidationSuccess isValid={isValid} />
      <FormActions
        isValid={isValid}
        isPending={deleteProject.isPending}
        handleDeleteProject={handleDeleteProject}
        closeModal={closeModal}
      />
    </motion.div>
  );
};

export default DeleteProjectConfirmation;