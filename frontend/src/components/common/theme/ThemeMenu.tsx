import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/stores/theme.store";
import { themeItems } from "@/data/data";
import { Palette } from "lucide-react";
import { useEffect, useRef } from "react";

const ThemeMenu = () => {
  const themeMenuBtnRef = useRef<HTMLButtonElement>(null);
  const { themeMenuOpen, setThemeMenuOpen, handleThemeChange, theme } =
    useTheme();
  const handleClickOutside = (event: MouseEvent) => {
    if (themeMenuBtnRef.current && 
        !themeMenuBtnRef.current.contains(event.target as Node) &&
        themeMenuOpen) {
      setThemeMenuOpen(false);
    }
  }
  useEffect(()=>{
    const storedTheme = localStorage.getItem("theme") || "dark";
    handleThemeChange(storedTheme as "light" | "dark" | "night" | "forest" | "dracula");
  } , [])
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [themeMenuOpen]);
  return (
    <div className="relative z-50">
      <motion.button
        ref={themeMenuBtnRef}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setThemeMenuOpen(!themeMenuOpen)}
        className="btn bg-gradient-to-r from-primary to-accent btn-circle transition-all duration-300"
      >
        <Palette size={20} />
      </motion.button>

      <AnimatePresence>
        {themeMenuOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-0 mt-2 w-52 shadow-xl rounded-xl z-10 menu menu-sm border bg-base-200 border-gray-700"
          >
            {themeItems.map((themeOption, index) => (
              <motion.li
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => handleThemeChange(themeOption.value)}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-primary hover:text-primary-content rounded-lg transition duration-300 ease-in-out ${
                    theme === themeOption.value
                      ? "bg-primary text-primary-content"
                      : ""
                  }`}
                >
                  {themeOption.value}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeMenu;
