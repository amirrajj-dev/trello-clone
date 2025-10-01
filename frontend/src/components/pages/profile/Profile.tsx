"use client";
import React, { useEffect } from "react";
import { useGetMe } from "@/hooks/queries/user";
import { useGetProjects } from "@/hooks/queries/projects";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { useGetUserTasks } from "@/hooks/queries/tasks";
import { Task } from "@/types/interfaces/interfaces";
import Navbar from "@/components/common/navbar/Navbar";
import MotivationalQuoteCard from "./ui/profile-page/MotivitionalQuoteCard";
import ProfileHeader from "./ui/profile-page/ProfileHeader";
import StatsOverview from "./ui/profile-page/StatsOwerview";
import TaskStatusOverview from "./ui/profile-page/TaskStatusOwerview";
import ProjectsSection from "./ui/profile-page/ProjectsSection";
import TasksSection from "./ui/profile-page/TasksSection";
import { Users } from "lucide-react";

const Profile = () => {
  const { data: user, isLoading: userLoading, error: userError } = useGetMe();
  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError,
  } = useGetProjects();
  const {
    data: tasksData,
    isLoading: tasksLoading,
    error: tasksError,
  } = useGetUserTasks();

  useEffect(() => {
    if (tasksError) {
      toast.error(tasksError.message || "Failed to load tasks");
    }
  }, [tasksError]);

  if (userError || projectsError) {
    toast.error(
      userError?.message ||
        projectsError?.message ||
        "Failed to load profile data"
    );
  }

  const projects = projectsData?.data || [];
  const profileCompletion =
    ([
      user?.name && user.name !== "",
      user?.email && user.email !== "",
      user?.avatarUrl && user.avatarUrl !== "",
    ].filter(Boolean).length /
      3) *
    100;

  const taskStatusCounts = {
    TODO:
      tasksData?.data.filter((task: Task) => task.status === "TODO").length ||
      0,
    IN_PROGRESS:
      tasksData?.data.filter((task: Task) => task.status === "IN_PROGRESS")
        .length || 0,
    DONE:
      tasksData?.data.filter((task: Task) => task.status === "DONE").length ||
      0,
  };

  const totalTasks =
    taskStatusCounts.TODO +
    taskStatusCounts.IN_PROGRESS +
    taskStatusCounts.DONE;
  const completionRate =
    totalTasks > 0 ? (taskStatusCounts.DONE / totalTasks) * 100 : 0;

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <div className="container mx-auto p-6 pt-24">
        <MotivationalQuoteCard />
        <AnimatePresence>
          {userLoading || projectsLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-base-content/60">Loading your profile...</p>
              </div>
            </div>
          ) : user ? (
            <>
              <ProfileHeader
                user={user}
                profileCompletion={profileCompletion}
              />
              <StatsOverview
                projectsLength={projects.length}
                totalTasks={totalTasks}
                completionRate={completionRate}
                doneTasks={taskStatusCounts.DONE}
              />
              <TaskStatusOverview
                tasksLoading={tasksLoading}
                taskStatusCounts={taskStatusCounts}
                totalTasks={totalTasks}
              />
              <ProjectsSection
                projectsLoading={projectsLoading}
                projects={projects}
                userId={user.id}
              />
              <TasksSection
                tasksLoading={tasksLoading}
                tasks={tasksData?.data || []}
                userId={user.id}
              />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Users size={64} className="mx-auto text-base-content/20 mb-4" />
              <h3 className="text-xl font-semibold text-base-content mb-2">
                User Not Found
              </h3>
              <p className="text-base-content/60 mb-6">
                We couldn't find your profile information
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary rounded-xl"
              >
                Refresh Page
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;