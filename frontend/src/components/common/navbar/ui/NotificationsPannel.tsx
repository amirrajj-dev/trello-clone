"use client";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NotificationsPannel = ({
  showNotifications,
  setShowNotifications
}: {
  showNotifications: boolean;
  setShowNotifications : React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const notifcationsPannelRef = useRef<HTMLDivElement>(null)
  const handleClickOutSide = (e : MouseEvent)=>{
    if (notifcationsPannelRef.current && !notifcationsPannelRef.current.contains(e.target as Node) && showNotifications){
      setShowNotifications(false)
    }
  }
  useEffect(()=>{
    document.addEventListener('mousedown' , handleClickOutSide)
    return ()=>{
      document.removeEventListener('mousedown' , handleClickOutSide)
    }
  } , [showNotifications])
  return (
    <AnimatePresence>
      {showNotifications && (
        <motion.div
        ref={notifcationsPannelRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full right-4 mt-2 w-80 bg-base-200 backdrop-blur-xl rounded-2xl shadow-xl border border-base-300 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-base-content">Notifications</h3>
            <span className="text-xs bg-primary text-primary-content px-2 py-1 rounded-full">
              3 new
            </span>
          </div>
          <div className="text-center text-base-content/50 text-sm py-8">
            No new notifications
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationsPannel;
