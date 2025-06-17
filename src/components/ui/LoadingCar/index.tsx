// components/CarPreloader.tsx
import { motion } from "framer-motion";

export function CarPreloader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18191C]/90 backdrop-blur-md">
      <motion.div
        className="bg-[#232428]/80 backdrop-blur-xl rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-8 border border-[#232428]/60"
        initial={{ opacity: 0, scale: 0.96, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Road with Car */}
        <div className="relative w-72 h-20 flex flex-col items-center justify-center select-none">
          {/* Road */}
          <div className="absolute left-0 right-0 top-1/2 h-6 -translate-y-1/2 flex items-center">
            <div className="w-full h-3 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-full shadow-inner relative overflow-hidden">
              {/* Dashed center line */}
              <div className="absolute left-0 top-1/2 w-full h-1 -translate-y-1/2 flex items-center">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-1 w-4 mx-1 bg-yellow-400 rounded-full opacity-70" />
                ))}
              </div>
            </div>
          </div>
          {/* Animated Car (SVG) */}
          <motion.svg
            width="56" height="32" viewBox="0 0 56 32" fill="none" xmlns="http://www.w3.org/2000/svg"
            className="absolute z-10"
            initial={{ x: 0 }}
            animate={{ x: 240 }}
            transition={{ duration: 2.2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
            style={{ top: '18px', left: 0 }}
          >
            {/* Car body */}
            <rect x="8" y="10" width="40" height="12" rx="6" fill="#43a1ff" />
            {/* Car roof */}
            <rect x="18" y="4" width="20" height="10" rx="5" fill="#37d67a" />
            {/* Wheels */}
            <ellipse cx="16" cy="24" rx="5" ry="5" fill="#232428" stroke="#fff" strokeWidth="2" />
            <ellipse cx="40" cy="24" rx="5" ry="5" fill="#232428" stroke="#fff" strokeWidth="2" />
            {/* Headlight */}
            <rect x="46" y="14" width="4" height="4" rx="2" fill="#f7e96b" />
          </motion.svg>
        </div>
        {/* Progress Bar */}
        <div className="w-64 h-2 bg-[#18191c] rounded-full overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2.2,
              ease: [0.4, 0, 0.2, 1],
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="h-full bg-gradient-to-r from-[#37d67a] via-[#43a1ff] to-[#f7971e] rounded-full"
          />
        </div>
        {/* Loading text */}
        <span className="text-neutral-100 text-lg font-semibold tracking-wide font-mono mt-2">
          Loading...
        </span>
      </motion.div>
    </div>
  );
}
