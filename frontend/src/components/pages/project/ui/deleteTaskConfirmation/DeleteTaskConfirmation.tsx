import { useDeleteTask } from "@/hooks/mutations/delete-task";
import { useModal } from "@/stores/modal.store";
import { motion } from "framer-motion";
import DeleteTaskHeader from "./ui/DeleteTaskHeader";
import WarningCard from "./ui/WarningCard";
import AdditionalWarning from "./ui/AdditionalWarning";
import ActionButtons from "./ui/ActionButtons";
import SafetyNote from "./ui/SafetyNote";

interface DeleteTaskConfirmationProps {
  projectId: string;
  taskId: string;
  taskTitle: string;
}

const DeleteTaskConfirmation: React.FC<DeleteTaskConfirmationProps> = ({
  projectId,
  taskId,
  taskTitle,
}) => {
  const deleteTask = useDeleteTask(projectId);
  const { closeModal } = useModal();

  const handleDelete = () => {
    deleteTask.mutate({ projectId, taskId });
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      className="w-full max-w-md mx-auto"
    >
      <DeleteTaskHeader />
      <WarningCard taskTitle={taskTitle} />
      <AdditionalWarning />
      <ActionButtons
        isPending={deleteTask.isPending}
        handleDelete={handleDelete}
        handleCancel={handleCancel}
      />
      <SafetyNote taskId={taskId} />
    </motion.div>
  );
};

export default DeleteTaskConfirmation;