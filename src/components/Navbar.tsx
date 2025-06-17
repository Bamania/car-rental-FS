import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate  } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
 
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const handleSignOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0f0f0f]/95 backdrop-blur-md border-b border-white/10 shadow-2xl"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
            onClick={() => navigate("/")}
          >
            <motion.span
              className="font-bold font-mono text-2xl bg-white bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              DriveGo
            </motion.span>
          </motion.div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="link"
                className="relative overflow-hidden shadow-lg hover:shadow-blue-500/50 transition-all duration-300 group"
                onClick={() => {navigate("/browse")}}
              >
                <span className="relative font-mono  text-white z-10">
                  Rent
                </span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="link"
                className="relative overflow-hidden shadow-lg hover:shadow-blue-500/50 transition-all duration-300 group"
                onClick={() => {navigate("/booking")}}
              >
                <span className="relative font-mono  text-white z-10">
                  My bookings
                </span>
              </Button>
            </motion.div>
          </nav>

          {/* Auth Buttons */}
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {isAuthenticated ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="link"
                  className="relative overflow-hidden shadow-lg hover:shadow-blue-500/50 transition-all duration-300 group"
                  onClick={handleSignOut}
                >
                  <span className="relative font-mono  text-white z-10">
                    Sign Out
                  </span>
                </Button>
              </motion.div>
            ) : (
              <div className="flex space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/login">
                    <Button
                      className="relative overflow-hidden shadow-lg hover:shadow-blue-500/50 transition-all duration-300 group"
                      variant="link"
                    >
                      <span className="relative z-10 text-white font-mono">
                        Sign In
                      </span>
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/signup">
                    <Button
                      className="relative overflow-hidden shadow-lg hover:shadow-blue-500/50 transition-all duration-300 group"
                      variant="link"
                    >
                      <span className="relative z-10 text-white font-mono">
                        Sign Up
                      </span>
                    </Button>
                  </Link>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
        </div>
      </div>

      {/* Animated bottom border */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.header>
  );
}
