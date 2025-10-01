"use client";
import React from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";

const Notifications = ({
  showNotifications,
  setShowNotifications,
}: {
  showNotifications: boolean;
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setShowNotifications(!showNotifications)}
      className="relative p-2 text-base-content/70 hover:text-primary hover:bg-base-300 rounded-xl transition-colors"
    >
      <Bell size={20} />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-base-100"></span>
    </motion.button>
  );
};

export default Notifications;
