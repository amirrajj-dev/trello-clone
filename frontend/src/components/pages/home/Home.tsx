"use client";
import React from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import Navbar from "../../common/navbar/Navbar";
import ProjectsSection from "./ui/ProjectsSection";
import TasksSection from "./ui/TasksSection";

const Home = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      {/* Main Content */}
      <div className="container mx-auto p-4 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl"
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-base-content">
                Your Projects
              </h1>
              <p className="text-base-content/60 text-sm mt-1">
                Manage your tasks and collaborate with your team
              </p>
            </div>
          </div>
          
          <Link href="/projects">
            <motion.button
              className="btn btn-primary bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-content rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={20} className="mr-2 group-hover:scale-110 transition-transform" />
              Create Project
            </motion.button>
          </Link>
        </motion.div>

        {/* Content Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-8"
        >
          <ProjectsSection />
          <TasksSection />
        </motion.div>

        {/* Floating Action Button for Mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="fixed bottom-6 right-6 z-40 sm:hidden"
        >
          <Link href="/projects">
            <motion.button
              className="btn btn-circle btn-primary bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus size={24} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;