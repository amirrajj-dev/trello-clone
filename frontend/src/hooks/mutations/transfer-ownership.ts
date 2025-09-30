import { useModal } from "@/stores/modal.store";
import { Role } from "@/types/enums/enums";
import { projectApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Project,
  ProjectWithDetails,
  User,
} from "@/types/interfaces/interfaces";
import { ApiResponse } from "@/types/api/api.response";

interface TransferOwnershipResponse {
  projectId?: string;
  newOwnerId?: string;
}

export const useTransferOwnership = (projectId: string) => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const updateCaches = (
    newOwnerId: string,
    oldProjects?: ApiResponse<Project[]>,
    oldProject?: { data: ProjectWithDetails }
  ) => {
    const users = queryClient.getQueryData<{ data: User[] }>(["users"]);
    const newOwner = users?.data.find((u) => u.id === newOwnerId) || {
      id: newOwnerId,
      name: "Unknown",
      email: "",
      avatarUrl: null,
    };

    // Update user-projects cache
    queryClient.setQueryData<ApiResponse<Project[]>>(
      ["user-projects"],
      (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  ownerId: newOwnerId,
                  owner: { name: newOwner.name },
                  members: p.members.map((m) =>
                    m.userId === newOwnerId
                      ? { ...m, role: Role.OWNER }
                      : m.userId === p.ownerId
                      ? { ...m, role: Role.ADMIN }
                      : m
                  ),
                }
              : p
          ),
        };
      }
    );

    // Update single project cache
    queryClient.setQueryData<{ data: ProjectWithDetails }>(
      ["project", projectId],
      (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            ownerId: newOwnerId,
            owner: { name: newOwner.name },
            members: old.data.members.map((m) =>
              m.userId === newOwnerId
                ? { ...m, role: Role.OWNER }
                : m.userId === old.data.ownerId
                ? { ...m, role: Role.ADMIN }
                : m
            ),
          },
        };
      }
    );

    return { previousProjects: oldProjects, previousProject: oldProject };
  };

  return useMutation({
    mutationFn: (data: { projectId: string; newOwnerId: string }) =>
      projectApi.transferOwnership(api, data.projectId, data.newOwnerId),
    onMutate: async ({ projectId, newOwnerId }) => {
      await queryClient.cancelQueries({ queryKey: ["user-projects"] });
      await queryClient.cancelQueries({ queryKey: ["project", projectId] });
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });

      const previousProjects = queryClient.getQueryData<ApiResponse<Project[]>>(
        ["user-projects"]
      );
      const previousProject = queryClient.getQueryData<{
        data: ProjectWithDetails;
      }>(["project", projectId]);

      return updateCaches(newOwnerId, previousProjects, previousProject);
    },
    onSuccess: (
      response: ApiResponse<TransferOwnershipResponse>,
      { projectId, newOwnerId }
    ) => {
      toast.success(`Ownership transferred successfully`);

      updateCaches(newOwnerId);

      queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      closeModal();
    },
    onError: (err, { projectId, newOwnerId }, context) => {
      queryClient.setQueryData(["user-projects"], context?.previousProjects);
      queryClient.setQueryData(
        ["project", projectId],
        context?.previousProject
      );
      toast.error(err.message || `Failed to transfer ownership`);
    },
  });
};
