const TaskCardDescription = ({ description }: { description: string | null | undefined }) => {
  // if (!description) return null;
  return (
    <p className="text-sm text-base-content/90 h-4 leading-relaxed mb-4 line-clamp-2 relative z-0">
      {description}
    </p>
  );
};

export default TaskCardDescription;