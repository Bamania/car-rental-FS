// components/CarPreloader.tsx
import { motion } from "framer-motion";
import carLoader from "@/assets/svgs/carloader.png"; // Use a clean, modern car SVG/PNG

export function CarPreloader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-[#232428] pt-12">
      {/* Loading text */}
      <span className="text-neutral-100 text-lg font-medium mb-4 tracking-wide">
        Loading...
      </span>
      {/* Progress Bar */}
      <div className="w-[60vw] max-w-xl h-2 bg-[#18191c] rounded-full mb-8 overflow-hidden">
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
      {/* Car Animation */}
      <div className="relative w-[60vw] max-w-xl h-16 mt-2">
        {/* Optional: Road effect */}
        <div className="absolute left-0 right-0 top-1/2 h-2 bg-gradient-to-r from-gray-700 via-gray-900 to-gray-700 rounded-full blur-sm opacity-40" />
        {/* Car */}
        <motion.img
          src={carLoader}
          alt="Accelerating Car"
          className="absolute top-[-24px] w-16 h-12"
          initial={{ x: 0, scale: 1, filter: "blur(0px)" }}
          animate={{
            x: ["0%", "20%", "45%", "75%", "100%"],
            scale: [1, 1.07, 1.13, 1.18, 1.22],
            filter: [
              "blur(0px)",
              "blur(0.5px)",
              "blur(1px)",
              "blur(2px)",
              "blur(3px)"
            ],
            y: [0, -2, 1, -1, 0], // subtle bounce
          }}
          transition={{
            duration: 2.2,
            times: [0, 0.2, 0.45, 0.75, 1],
            ease: [0.4, 0, 0.2, 1],
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      </div>
      {/* Optional: Description (from your screenshot) */}
      <div className="w-[60vw] max-w-xl mt-6 text-neutral-300 text-sm">
        Animating a stylized car driving across the screen, with the background visually representing a road or landscape. The animation transitions from assembling a car silhouette to road lines stretching into the horizon, culminating in a destination marker appearing as content loads. Vibrant colors and fluid transitions enhance the visual appeal.
      </div>
    </div>
  );
}
