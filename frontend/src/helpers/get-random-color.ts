

export  const getRandomColor = (userId: string) => {
    const colors = [
      "bg-primary/20 text-primary border-primary/30",
      "bg-secondary/20 text-secondary border-secondary/30",
      "bg-accent/20 text-accent border-accent/30",
      "bg-info/20 text-info border-info/30",
      "bg-success/20 text-success border-success/30",
      "bg-warning/20 text-warning border-warning/30",
    ];
    const index = userId.charCodeAt(24) % colors.length;
    return colors[index];
  };