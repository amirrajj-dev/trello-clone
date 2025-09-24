import React from "react";
import { Trello } from "lucide-react";

const Logo = ({
  size = "text-xl",
  showIcon = true,
}: {
  size?: "text-lg" | "text-xl" | "text-2xl" | "text-3xl" | "text-4xl";
  showIcon?: boolean;
}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {showIcon && (
        <div className="bg-gradient-to-tr from-primary to-accent p-1.5 -translate-y-0.5 rounded-lg">
          <Trello className="text-base-content h-5 w-5" />
        </div>
      )}
      <h2
        className={`text-transparent font-bold ${size} bg-clip-text bg-gradient-to-tr from-primary to-accent tracking-tight`}
      >
        TrelloClone
      </h2>
    </div>
  );
};

export default Logo;