import { useQueryClient } from "@tanstack/react-query";
import { Notification } from "@/types/interfaces/interfaces";
import { NotificationType } from "@/types/enums/enums";

export const useNotificationUtils = () => {
  const queryClient = useQueryClient();

  const invalidateQueriesByNotificationType = (notification: Notification) => {
    const { type, projectId, taskId } = notification;

    switch (type) {
      // Task-related notifications
      case NotificationType.TASK_ASSIGNED:
      case NotificationType.TASK_UNASSIGNED:
      case NotificationType.TASK_STATUS_CHANGED:
      case NotificationType.TASK_DELETED:
      case NotificationType.TASK_PROGRESS_UPDATED:
        queryClient.invalidateQueries({ queryKey: ["user-tasks"] });
        if (projectId) {
          queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
          if (type === NotificationType.TASK_DELETED) {
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
          }
        }
        break;

      // Comment-related notifications
      case NotificationType.COMMENT_ADDED:
      case NotificationType.COMMENT_UPDATED:
      case NotificationType.COMMENT_DELETED:
        if (taskId && projectId) {
          queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
          queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
        }
        break;

      // Project member-related notifications
      case NotificationType.PROJECT_MEMBER_ADDED:
      case NotificationType.PROJECT_MEMBER_REMOVED:
      case NotificationType.ROLE_CHANGED:
      case NotificationType.OWNERSHIP_TRANSFERRED:
        if (projectId) {
          queryClient.invalidateQueries({ queryKey: ["project", projectId] });
          queryClient.invalidateQueries({ queryKey: ["user-projects"] });
          if (
            type === NotificationType.OWNERSHIP_TRANSFERRED ||
            type === NotificationType.PROJECT_MEMBER_ADDED ||
            type === NotificationType.PROJECT_MEMBER_REMOVED
          ) {
            queryClient.invalidateQueries({ queryKey: ["users"] });
          }
        }
        break;

      // Project-related notifications
      case NotificationType.PROJECT_DELETED:
      case NotificationType.PROJECT_UPDATED:
        queryClient.invalidateQueries({ queryKey: ["user-projects"] });
        if (projectId) {
          queryClient.invalidateQueries({ queryKey: ["project", projectId] });
          queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
        }
        if (type === NotificationType.PROJECT_DELETED) {
          queryClient.invalidateQueries({ queryKey: ["user", "me"] });
        }
        break;

      default:
        console.log(
          `No specific query invalidation for notification type: ${type}`
        );
        break;
    }

    // Always invalidate user data for user-related changes
    if (
      type === NotificationType.TASK_ASSIGNED ||
      type === NotificationType.TASK_UNASSIGNED ||
      type === NotificationType.PROJECT_MEMBER_ADDED ||
      type === NotificationType.PROJECT_MEMBER_REMOVED ||
      type === NotificationType.OWNERSHIP_TRANSFERRED
    ) {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      queryClient.invalidateQueries({ queryKey: ["user-tasks"] });
    }

    console.log(`Invalidated queries for notification type: ${type}`);
  };

  return {
    invalidateQueriesByNotificationType,
  };
};
