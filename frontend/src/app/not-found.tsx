'use client'
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderX, Home, Search, Ghost } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/common/logo/Logo';
import { useTheme } from '@/stores/theme.store';

const NotFound = () => {
  const {initializeTheme} = useTheme()
  useEffect(()=>{
    initializeTheme()
  } , [initializeTheme])
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-secondary/10 rounded-full blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="absolute top-1/3 right-1/3 w-24 h-24 bg-accent/10 rounded-full blur-xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-8"
          >
            <Logo size="text-4xl" />
          </motion.div>

          {/* Main Illustration */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            className="relative mb-8"
          >
            <div className="relative inline-block">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-32 h-32 bg-gradient-to-br from-error/20 to-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-error/30"
              >
                <FolderX size={64} className="text-error" />
              </motion.div>
              
              {/* Floating Ghost */}
              <motion.div
                initial={{ opacity: 0, scale: 0, x: -50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="absolute -top-4 -right-4"
              >
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 10, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-16 h-16 bg-warning/20 rounded-2xl flex items-center justify-center border border-warning/30"
                >
                  <Ghost size={32} className="text-warning" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-6xl md:text-7xl font-bold text-base-content mb-4"
              >
                404
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-2xl md:text-3xl font-bold text-base-content mb-4"
              >
                Page Not Found
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="text-base-content/70 text-lg max-w-md mx-auto leading-relaxed"
              >
                Oops! The board or page you're looking for seems to have wandered off. 
                It might have been moved, deleted, or never existed in the first place.
              </motion.p>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-content w-full sm:w-auto gap-3 px-8 py-3 text-lg"
                >
                  <Home size={20} />
                  Back to Home
                </motion.button>
              </Link>
              
              <Link href="/projects" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-accent rounded-xl bg-gradient-to-r from-accent to-info hover:from-accent/90 hover:to-info/90 text-accent-content w-full sm:w-auto gap-3 px-8 py-3 text-lg"
                >
                  <Search size={20} />
                  Browse Projects
                </motion.button>
              </Link>
            </motion.div>

            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="bg-base-200/50 backdrop-blur-sm rounded-2xl p-6 border border-base-300/50 mt-8 max-w-md mx-auto"
            >
              <h3 className="font-semibold text-base-content mb-3 flex items-center justify-center gap-2">
                <Search size={18} className="text-info" />
                Quick Tips
              </h3>
              <ul className="text-base-content/60 text-sm space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Check if the project or board still exists
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Verify you have the correct permissions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Try searching for what you're looking for
                </li>
              </ul>
            </motion.div>

            {/* Fun Message */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
              className="bg-warning/10 border border-warning/20 rounded-2xl p-4 max-w-sm mx-auto"
            >
              <p className="text-warning text-sm flex items-center justify-center gap-2">
                <Ghost size={16} />
                Don't worry, even the best project managers get lost sometimes!
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-12 text-base-content/40 text-sm"
        >
          <p>If you believe this is an error, please contact support</p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;