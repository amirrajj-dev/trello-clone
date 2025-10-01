import { motion } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import { useState } from "react";
import { motivationalQuotes } from "@/data/data";

const MotivationalQuoteCard = () => {
  const [quote, setQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  const refreshQuote = () => {
    const newQuote =
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(newQuote);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-6 mb-8 border border-primary/20 backdrop-blur-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-base-content">
              Daily Inspiration
            </h2>
          </div>
          <p className="text-base-content/80 text-lg italic leading-relaxed">
            "{quote}"
          </p>
        </div>
        <motion.button
          onClick={refreshQuote}
          whileHover={{ scale: 1.05, rotate: 15 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-ghost btn-circle text-primary hover:bg-primary/10 transition-all duration-200"
        >
          <RefreshCw size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MotivationalQuoteCard;