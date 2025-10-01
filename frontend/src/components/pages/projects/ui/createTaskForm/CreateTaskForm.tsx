import React, { useState } from "react";
import { useModal } from "@/stores/modal.store";
import { useCreateTask } from "@/hooks/mutations/create-task";
import { Priority, TaskStatus } from "@/types/enums/enums";
import { toast } from "sonner";
import { motion } from "framer-motion";
import CreateTaskHeader from "./ui/CreateTaskHeader";
import TaskTitleInput from "./ui/TaskTitleInput";
import TaskDescriptionInput from "./ui/TaskDescriptionInput";
import PriorityStatusFields from "./ui/PriorityStatusFields";
import DueDateAssigneeFields from "./ui/DueDateAssigneeFields";
import FormActions from "./ui/FormActions";

const CreateTaskForm: React.FC<{
  projectId: string;
  projectMembers: {
    user: {
      name: string;
      avatarUrl: string | null;
      id: string;
    };
  }[];
}> = ({ projectId, projectMembers }) => {
  const { closeModal } = useModal();
  const createTaskMutation = useCreateTask();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: Priority.MEDIUM,
    status: TaskStatus.TODO,
    dueDate: "",
    assigneeId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 4) {
      newErrors.title = "Title must be at least 4 characters long";
    } else if (formData.title.length > 60) {
      newErrors.title = "Title must be less than 60 characters";
    }

    if (formData.description && formData.description.length < 6) {
      newErrors.description = "Description must be at least 6 characters long";
    } else if (formData.description && formData.description.length > 120) {
      newErrors.description = "Description must be less than 120 characters";
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.dueDate = "Due date must be today or in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate ? formData.dueDate : undefined,
      assigneeId: formData.assigneeId || undefined,
    };

    createTaskMutation.mutate({ projectId, task: taskData });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const isFormValid =
    formData.title.trim().length >= 4 && formData.title.trim().length <= 60;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="space-y-6 max-h-[80vh] overflow-y-auto"
    >
      <CreateTaskHeader />
      <TaskTitleInput
        title={formData.title}
        handleInputChange={handleInputChange}
        errors={errors}
        isPending={createTaskMutation.isPending}
      />
      <TaskDescriptionInput
        description={formData.description}
        handleInputChange={handleInputChange}
        errors={errors}
        isPending={createTaskMutation.isPending}
      />
      <PriorityStatusFields
        priority={formData.priority}
        status={formData.status}
        handleInputChange={handleInputChange}
        isPending={createTaskMutation.isPending}
      />
      <DueDateAssigneeFields
        dueDate={formData.dueDate}
        assigneeId={formData.assigneeId}
        handleInputChange={handleInputChange}
        errors={errors}
        isPending={createTaskMutation.isPending}
        projectMembers={projectMembers}
        getMinDate={getMinDate}
      />
      <FormActions
        isPending={createTaskMutation.isPending}
        isFormValid={isFormValid}
        closeModal={closeModal}
      />
    </motion.form>
  );
};

export default CreateTaskForm;