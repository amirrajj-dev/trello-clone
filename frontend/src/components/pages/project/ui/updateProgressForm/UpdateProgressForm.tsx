import { useUpdateTask } from "@/hooks/mutations/update-task";
import { useModal } from "@/stores/modal.store";
import React, { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ProgressHeader from "./ui/ProgressHeader";
import CurrentProgressDisplay from "./ui/CurrentProgressDisplay";
import ProgressSlider from "./ui/ProgressSlider";
import ChangeIndicator from "./ui/ChangeIndicator";
import ProgressActions from "./ui/ProgressActions";

const UpdateProgressForm = ({
  projectId,
  taskId,
  currentProgress = 0,
}: {
  projectId: string;
  taskId: string;
  currentProgress?: number;
}) => {
  const updateTask = useUpdateTask(projectId);
  const { closeModal } = useModal();
  const [progress, setProgress] = useState(currentProgress);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (progress < 0 || progress > 100) {
      toast.error("Progress must be between 0 and 100");
      return;
    }

    updateTask.mutate({
      projectId,
      taskId,
      task: { progress },
    });
  };

  const getProgressColor = (value: number) => {
    if (value >= 90) return "text-success";
    if (value >= 70) return "text-primary";
    if (value >= 50) return "text-info";
    if (value >= 30) return "text-warning";
    return "text-error";
  };

  const getProgressLabel = (value: number) => {
    if (value === 0) return "Not Started";
    if (value === 100) return "Completed";
    if (value >= 90) return "Almost Done";
    if (value >= 70) return "In Progress";
    if (value >= 50) return "Halfway There";
    if (value >= 30) return "Getting There";
    return "Just Started";
  };

  const hasChanged = progress !== currentProgress;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <ProgressHeader />
      <CurrentProgressDisplay
        currentProgress={currentProgress}
        getProgressColor={getProgressColor}
        getProgressLabel={getProgressLabel}
      />
      <ProgressSlider
        progress={progress}
        setProgress={setProgress}
        getProgressColor={getProgressColor}
        getProgressLabel={getProgressLabel}
      />
      <ChangeIndicator
        hasChanged={hasChanged}
        currentProgress={currentProgress}
        progress={progress}
      />
      <ProgressActions
        isPending={updateTask.isPending}
        hasChanged={hasChanged}
        closeModal={closeModal}
      />
    </motion.form>
  );
};

export default UpdateProgressForm;