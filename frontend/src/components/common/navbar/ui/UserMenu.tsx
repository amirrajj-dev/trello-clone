"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useGetMe } from "@/hooks/queries/user";
import { ChevronDown, LogOut, User } from "lucide-react";
import Link from "next/link";
import { deleteCookie } from "@/helpers/delete-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

const UserMenu = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: user, isLoading } = useGetMe();
  const menuItems = [{ icon: User, label: "Profile", href: "/profile" }];
  const queryClient = useQueryClient();
  const handleLogout = async () => {
    await deleteCookie();
    toast.success("Logged out successfully!");
    queryClient.removeQueries({queryKey : ['user']})
    queryClient.removeQueries({queryKey : ['me']})
    queryClient.removeQueries({queryKey : ['user-projects']})
    queryClient.removeQueries({queryKey : ['user-tasks']})
    router.push("/signin");
  };

  if (isLoading) {
    return <div className="loading loading-spinner"></div>;
  }

  return (
    <div>
      {user && (
        <motion.div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-200 ${
              isDropdownOpen
                ? "bg-base-300 border border-base-300"
                : "hover:bg-base-300"
            }`}
          >
            <div className="relative">
              <Image
                src={user.avatarUrl || "/avatar-placeholder.jpg"}
                alt="User avatar"
                width={36}
                height={36}
                className="rounded-full border-2 border-base-100 shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-base-100"></div>
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-base-content leading-none">
                {user.name || "User"}
              </p>
              <p className="text-xs text-base-content/60 truncate max-w-[120px]">
                {user.email}
              </p>
            </div>

            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="text-base-content/40" />
            </motion.div>
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-64 bg-base-200 backdrop-blur-xl rounded-2xl shadow-xl border border-base-300 overflow-hidden"
              >
                {/* User Info Header */}
                <div className="p-4 border-b border-base-300">
                  <div className="flex items-center gap-3">
                    <Image
                      src={user.avatarUrl || "/avatar-placeholder.jpg"}
                      alt="User avatar"
                      width={48}
                      height={48}
                      className="rounded-full border-2 border-base-100 shadow-md"
                    />
                    <div>
                      <p className="font-semibold text-base-content">
                        {user.name || "User"}
                      </p>
                      <p className="text-sm text-base-content/60 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-base-content hover:bg-base-300 rounded-lg transition-colors group"
                      >
                        <item.icon
                          size={18}
                          className="text-base-content/50 group-hover:text-primary"
                        />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Logout Button */}
                <div className="p-2 border-t border-base-300">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-error hover:bg-base-300 rounded-lg transition-colors group"
                  >
                    <LogOut
                      size={18}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="font-medium">Logout</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default UserMenu;
