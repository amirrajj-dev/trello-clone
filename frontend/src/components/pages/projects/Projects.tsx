'use client';
import { useGetProjects } from "@/hooks/queries/projects";
import { toast } from "sonner";
import { useGetMe } from "@/hooks/queries/user";
import { useModal } from "@/stores/modal.store";
import { useState } from "react";
import { Project } from "@/types/interfaces/interfaces";
import CreateProjectForm from "@/components/pages/projects/ui/createProjectForm/CreateProjectForm";
import ProjectsHeader from "./ui/projects-page/ProjectsHeader";
import SearchAndControls from "./ui/projects-page/SearchAndControls";
import ProjectList from "./ui/projects-page/ProjectsList";
import ResultsCount from "./ui/projects-page/ResultsCount";

const Projects = () => {
  const { data: projectsData, isLoading, error } = useGetProjects();
  const { data: user } = useGetMe();
  const { openModal } = useModal();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "date" | "progress">("name");

  const projects = projectsData?.data || [];

  if (error) toast.error(error.message || "Failed to load projects");

  const filteredProjects = projects
    .filter((project: Project) =>
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a: Project, b: Project) => {
      switch (sortBy) {
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "progress":
          const progressA =
            a.tasks.length > 0
              ? a.tasks.reduce((sum, task) => sum + task.progress, 0) / a.tasks.length
              : 0;
          const progressB =
            b.tasks.length > 0
              ? b.tasks.reduce((sum, task) => sum + task.progress, 0) / b.tasks.length
              : 0;
          return progressB - progressA;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleCreateProject = () => {
    openModal(<CreateProjectForm />, "Create New Project");
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto p-6">
        <ProjectsHeader handleCreateProject={handleCreateProject} />
        <SearchAndControls
          search={search}
          setSearch={setSearch}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <ProjectList
          isLoading={isLoading}
          filteredProjects={filteredProjects}
          viewMode={viewMode}
          currentUserId={user?.id || ""}
          handleCreateProject={handleCreateProject}
          search={search}
        />
        <ResultsCount
          isLoading={isLoading}
          filteredProjects={filteredProjects}
          projects={projects}
          search={search}
          setSearch={setSearch}
        />
      </div>
    </div>
  );
};

export default Projects;