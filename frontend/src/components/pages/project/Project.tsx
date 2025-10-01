"use client";
import React, { useEffect } from "react";
import { useGetMe } from "@/hooks/queries/user";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useModal } from "@/stores/modal.store";
import CreateTaskForm from "@/components/pages/projects/ui/createTaskForm/CreateTaskForm";
import { ProjectMember} from "@/types/interfaces/interfaces";
import { Role } from "@/types/enums/enums";
import { useGetProject } from "@/hooks/queries/project";
import { useGetProjectTasks } from "@/hooks/queries/project-tasks";
import ProjectHeader from "./ui/project-page/ProjectHeader";
import MembersSection from "./ui/project-page/MembersSection";
import KanbanBoard from "./ui/project-page/KanbanBoard";
import LoadingState from "./ui/project-page/LoadingState";
import NotFoundState from "./ui/project-page/NotFoundState";
import ChangeRoleForm from "./ui/changeRoleForm/ChangeRoleForm";
import RemoveMemberConfirmation from "@/components/pages/projects/ui/removeMemberForm/RemoveMemberConfirmation";
import EditProjectForm from "@/components/pages/projects/ui/editProjectForm/EditProjectForm";
import DeleteProjectConfirmation from "@/components/pages/projects/ui/deleteProjectForm/DeleteProjectConfirmation";
import AddMemberToProjectForm from "@/components/pages/projects/ui/addMemberToProjectForm/AddMemberToProjectForm";
import TransferOwnerShipForm from "@/components/pages/project/ui/TranferOwnerShipForm/TransferOwnerShipForm";
import { AnimatePresence } from "framer-motion";

const ProjectDetails = () => {
  const params: { id: string } = useParams();
  const { openModal } = useModal();
  const { data: currentUser, refetch: refetchUser } = useGetMe();
  const {
    data: projectData,
    isLoading: projectLoading,
    error: projectError,
  } = useGetProject(params.id);
  const {
    data: tasksData,
    isLoading: tasksLoading,
    error: tasksError,
  } = useGetProjectTasks(params.id, projectData);

  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  const handleEditProject = () => {
    if (projectData?.data) {
      openModal(
        <EditProjectForm
          projectName={projectData.data.name}
          projectDescription={projectData.data.description}
          projectId={projectData.data.id}
        />,
        "Edit Project"
      );
    }
  };

  const handleDeleteProject = () => {
    if (projectData?.data) {
      openModal(
        <DeleteProjectConfirmation
          projectName={projectData.data.name}
          projectId={projectData.data.id}
        />,
        "Delete Project"
      );
    }
  };

  const handleAddMember = () => {
    if (projectData?.data) {
      openModal(
        <AddMemberToProjectForm
          projectId={projectData.data.id}
          projectName={projectData.data.name}
          projectMembers={project!.members.map((member) => member.user.name)}
        />,
        "Add Member"
      );
    }
  };

  const handleRemoveMember = (userId? : string) => {
    if (
      project!.members.filter(
        (member) => member.user.name !== project!.owner.name
      ).length > 0
    ) {
      openModal(
        <RemoveMemberConfirmation
          projectId={project?.id as string}
          projectMembers={project?.members as ProjectMember[]}
          projectOwnerName={project?.owner.name as string}
          selectedUserId={userId || ""}
        />,
        "Remove Member From Project"
      );
    } else {
      toast.warning("Add project member first !");
    }
  };

  const handleChangeRole = (member: ProjectMember) => {
    const isProjectOwner = currentUser?.id === project?.ownerId;
    if ((member.role === Role.ADMIN || member.role === Role.OWNER) && !isProjectOwner) {
      toast.error(`You can not change the role of an ${member.role}`);
      return;
    }
    openModal(
      <ChangeRoleForm
        projectId={project?.id as string}
        memberId={member.userId}
        currentRole={member.role}
        currentUserId={member.userId}
        isCurrentUserOwner={member.role === Role.OWNER}
        memberName={member.user.name}
      />,
      "Change Role"
    );
  };

  const handleAddTask = () => {
    if (projectData?.data) {
      openModal(
        <CreateTaskForm
          projectId={projectData.data.id}
          projectMembers={projectData.data.members}
        />,
        "Create Task"
      );
    }
  };

  const handleTransferOwnerShip = () => {
    openModal(
      <TransferOwnerShipForm
        projectId={project?.id as string}
        projectMembers={
          project?.members as Array<{
            user: { id: string; name: string; email: string; avatarUrl?: string };
            role: string;
          }>
        }
        currentUserId={currentUser!.id}
      />,
      "Transfer OwnerShip"
    );
  };

  if (projectError || tasksError) {
    toast.error(
      projectError?.message ||
        tasksError?.message ||
        "Failed to load project data"
    );
  }

  const project = projectData?.data;
  
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto p-6">
        <AnimatePresence>
          {projectLoading ? (
            <LoadingState />
          ) : project ? (
            <>
              <ProjectHeader
                project={project}
                currentUser={currentUser}
                handleAddTask={handleAddTask}
                handleAddMember={handleAddMember}
                handleRemoveMember={handleRemoveMember}
                handleEditProject={handleEditProject}
                handleDeleteProject={handleDeleteProject}
                handleTransferOwnerShip={handleTransferOwnerShip}
              />
              <MembersSection
                project={project}
                currentUser={currentUser}
                handleChangeRole={handleChangeRole}
                handleRemoveMember={handleRemoveMember}
              />
              <KanbanBoard
                tasks={tasksData?.data || []}
                projectId={params.id}
                currentUserId={currentUser?.id || ""}
                isLoading={tasksLoading}
              />
            </>
          ) : (
            <NotFoundState />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectDetails;