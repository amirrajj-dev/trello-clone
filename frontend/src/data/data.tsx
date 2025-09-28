import { Crown, Eye, Shield, User } from "lucide-react";

type Theme = "light" | "dark" | "night" | "forest" | "dracula" | "coffee";

export const themeItems: {
  value: Theme;
}[] = [
  { value: "light" },
  { value: "dark" },
  { value: "night" },
  { value: "forest" },
  { value: "dracula" },
  { value: "coffee" },
];

  export const roleStyles = {
    OWNER: <Crown size={12} className="text-amber-500" />,
    ADMIN: <Shield size={12} className="text-blue-500" />,
    MEMBER: <User size={12} className="text-green-500" />,
    VIEWER: <Eye size={12} className="text-gray-500" />,
  };