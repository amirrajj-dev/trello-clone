"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ThemeMenu from "@/components/common/theme/ThemeMenu";
import Logo from "@/components/common/logo/Logo";
import { useGetMe } from "@/hooks/queries/user";
import UserMenu from "./ui/UserMenu";
import Notifications from "./ui/Notifications";
import NotificationsPannel from "./ui/NotificationsPannel";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all border-b border-accent duration-300 ${
        isScrolled
          ? "bg-base-100/90 backdrop-blur-xl shadow-lg border-b"
          : "bg-base-100/80 backdrop-blur-md shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <Logo size="text-2xl" />
          </motion.div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ThemeMenu />
            </motion.div>
            <UserMenu />
            <Notifications
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
            />
          </div>
        </div>
      </div>
      <NotificationsPannel setShowNotifications={setShowNotifications} showNotifications={showNotifications} />
    </motion.nav>
  );
};

export default Navbar;
