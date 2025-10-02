import { useUpdateTask } from "@/hooks/mutations/update-task";
import { useGetMe } from "@/hooks/queries/user";
import { useModal } from "@/stores/modal.store";
import { Priority, Role, TaskStatus } from "@/types/enums/enums";
import { UpdateTaskDto } from "@/utils/dtos";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import TaskFormHeader from "./ui/TaskFormHeader";
import TitleField from "./ui/TitleField";
import DescriptionField from "./ui/DescriptionField";
import PriorityStatusFields from "./ui/PriorityStatusFields";
import DueDateAssigneeFields from "./ui/DueDateAssigneeFields";
import FormActions from "./ui/FormActions";

interface UpdateTaskFormProps {
  projectId: string;
  task: {
    id: string;
    title: string;
    description?: string;
    priority: Priority;
    status: TaskStatus;
    dueDate?: string;
    assigneeId?: string;
  };
  projectMembers: {
    role: Role;
    userId: string;
    user: {
      name: string;
    };
  }[];
}

const UpdateTaskForm: React.FC<UpdateTaskFormProps> = ({
  projectId,
  task,
  projectMembers,
}) => {
  const { closeModal } = useModal();
  const updateTask = useUpdateTask(projectId);
  const { data: currentUser } = useGetMe();

  const [formData, setFormData] = useState<UpdateTaskDto>({
    title: "",
    description: "",
    priority: Priority.MEDIUM,
    status: TaskStatus.TODO,
    dueDate: undefined,
    assigneeId: "",
  });

  const ownerMember = projectMembers.find(
    (member) => member.role === Role.OWNER
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || Priority.MEDIUM,
        status: task.status || TaskStatus.TODO,
        dueDate: task.dueDate ? task.dueDate : undefined,
        assigneeId: task.assigneeId || "",
      });
    }
  }, [task]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.title && formData.title.trim()) {
      if (formData.title.length < 4) {
        newErrors.title = "Title must be at least 4 characters long";
      } else if (formData.title.length > 60) {
        newErrors.title = "Title must be less than 60 characters";
      }
    }

    if (formData.description && formData.description.trim()) {
      if (formData.description.length < 6) {
        newErrors.description =
          "Description must be at least 6 characters long";
      } else if (formData.description.length > 120) {
        newErrors.description = "Description must be less than 120 characters";
      }
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

    if (name === "dueDate") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? value : undefined,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

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

    const updatedFields: UpdateTaskDto = {};

    if (formData.title !== task.title) updatedFields.title = formData.title;
    if (formData.description){
      if (formData.description !== task.description)
      updatedFields.description = formData.description;
    }
    if (formData.priority !== task.priority)
      updatedFields.priority = formData.priority;
    if (formData.status !== task.status) updatedFields.status = formData.status;
    if (formData.dueDate){
      if (new Date(formData.dueDate as string)?.toISOString() !== task.dueDate)
      updatedFields.dueDate = new Date(
        formData.dueDate as string
      ).toISOString();
    }
    if (formData.assigneeId !== task.assigneeId)
      updatedFields.assigneeId = formData.assigneeId;

    if (Object.keys(updatedFields).length === 0) {
      toast.info("No changes were made");
      closeModal();
      return;
    }

    updateTask.mutate({
      projectId,
      taskId: task.id,
      task: updatedFields,
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const formatDateForInput = (date: string | undefined) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.LOW:
        return "text-success";
      case Priority.MEDIUM:
        return "text-warning";
      case Priority.HIGH:
        return "text-error";
      default:
        return "text-base-content";
    }
  };

  const hasChanges = () => {
    return (
      formData.title !== task.title ||
      formData.description !== task.description ||
      formData.priority !== task.priority ||
      formData.status !== task.status ||
      formatDateForInput(formData.dueDate as string) !== task.dueDate ||
      formData.assigneeId !== task.assigneeId
    );
  };

  const isFormValid =
    !formData.title ||
    (formData.title.length >= 4 && formData.title.length <= 60);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto overflow-x-hidden">
      <TaskFormHeader />
      <TitleField
        formData={formData}
        handleInputChange={handleInputChange}
        errors={errors}
        isPending={updateTask.isPending}
      />
      <DescriptionField
        formData={formData}
        handleInputChange={handleInputChange}
        errors={errors}
        isPending={updateTask.isPending}
      />
      <PriorityStatusFields
        formData={formData as { priority: Priority; status: TaskStatus }}
        handleInputChange={handleInputChange}
        getPriorityColor={getPriorityColor}
        isPending={updateTask.isPending}
        isOwner={currentUser?.id === ownerMember?.userId}
      />
      <DueDateAssigneeFields
        formData={formData}
        handleInputChange={handleInputChange}
        errors={errors}
        getMinDate={getMinDate}
        formatDateForInput={formatDateForInput}
        projectMembers={projectMembers}
        isPending={updateTask.isPending}
        isOwner={currentUser?.id === ownerMember?.userId}
      />
      <FormActions
        isPending={updateTask.isPending}
        hasChanges={hasChanges()}
        isFormValid={isFormValid}
        closeModal={closeModal}
      />
    </form>
  );
};

export default UpdateTaskForm;
