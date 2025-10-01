import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/stores/theme.store";
import { themeItems } from "@/data/data";
import { Palette, Check, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Theme } from "@/types/theme/theme.type";

const ThemeMenu = () => {
  const themeMenuBtnRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { themeMenuOpen, setThemeMenuOpen, handleThemeChange, theme } = useTheme();

  const handleClickOutside = (event: MouseEvent) => {
    if (themeMenuBtnRef.current && 
        !themeMenuBtnRef.current.contains(event.target as Node) &&
        themeMenuOpen) {
      setThemeMenuOpen(false);
    }
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark";
    handleThemeChange(storedTheme as "light" | "dark" | "night" | "forest" | "dracula");
  }, [handleThemeChange]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [themeMenuOpen]);

  const getThemeColor = (themeValue: string) => {
    const colors = {
      light: "bg-gradient-to-r from-amber-400 to-yellow-500",
      dark: "bg-gradient-to-r from-base-300 to-base-400",
      night: "bg-gradient-to-r from-blue-700 to-indigo-800",
      forest: "bg-gradient-to-r from-emerald-600 to-green-700",
      dracula: "bg-gradient-to-r from-purple-600 to-pink-700",
    };
    return colors[themeValue as keyof typeof colors] || "bg-gradient-to-r from-base-400 to-base-500";
  };

  const getThemeIcon = (themeValue: string) => {
    const icons = {
      light: "🌞",
      dark: "🌙",
      night: "✨",
      forest: "🌲",
      dracula: "🧛",
    };
    return icons[themeValue as keyof typeof icons] || "🎨";
  };

  return (
    <div className="relative z-50">
      <motion.button
        ref={themeMenuBtnRef}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setThemeMenuOpen(!themeMenuOpen)}
        className={`relative p-2.5 rounded-xl transition-all duration-300 ${
          themeMenuOpen 
            ? "bg-primary/20 border border-primary/30" 
            : "hover:bg-base-300"
        }`}
      >
        <motion.div
          animate={{ rotate: isHovered ? 15 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Palette size={20} className="text-base-content" />
        </motion.div>
        
        {/* Animated sparkle effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles size={12} className="text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {themeMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute -right-10 sm:right-auto sm:left-0 mt-2 w-64 bg-base-200 backdrop-blur-xl rounded-2xl shadow-xl border border-base-300 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-base-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
                  <Palette size={16} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base-content">Theme</h3>
                  <p className="text-sm text-base-content/60">Choose your style</p>
                </div>
              </div>
            </div>

            {/* Theme Options */}
            <div className="p-2">
              {themeItems.map((themeOption, index) => (
                <motion.button
                  key={themeOption.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleThemeChange(themeOption.value as Theme)}
                  className={`flex items-center justify-between w-full px-3 py-3 rounded-lg transition-all duration-200 group ${
                    theme === themeOption.value
                      ? "bg-primary/20 border border-primary/30"
                      : "hover:bg-base-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Theme color preview */}
                    <div className={`w-6 h-6 rounded-full ${getThemeColor(themeOption.value)} shadow-sm border border-base-100/50`} />
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getThemeIcon(themeOption.value)}</span>
                      <span className="font-medium text-base-content capitalize">
                        {themeOption.value}
                      </span>
                    </div>
                  </div>

                  {/* Checkmark for selected theme */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: theme === themeOption.value ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`p-1 rounded-full ${
                      theme === themeOption.value ? 'bg-primary text-primary-content' : 'bg-base-300'
                    }`}
                  >
                    <Check size={12} />
                  </motion.div>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-base-300 bg-base-300/30">
              <p className="text-xs text-base-content/60 text-center">
                Your theme preference is saved automatically
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeMenu;