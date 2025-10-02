import ProjectDetails from "@/components/pages/project/Project";
import { projectApi } from "@/utils/api";
import api from "@/utils/axios";
import React from "react";

interface ProjectDetailsPageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: ProjectDetailsPageProps) => {
  const { id } = await params;
  const { data: project } = await projectApi.getProject(api, id);

  return {
    title: `${project?.name || "Project"} - Trello Clone`,
    description: project?.description
      ? `Manage tasks and collaborate on ${project.name} in Trello Clone. ${project.description}`
      : `Manage tasks and collaborate on your project in Trello Clone.`,
  };
};

const ProjectDetailsPage = () => <ProjectDetails />;

export default ProjectDetailsPage;
