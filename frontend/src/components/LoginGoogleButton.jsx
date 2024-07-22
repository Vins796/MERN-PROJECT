import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export default function LoginGoogleButton({ handleGoogleLogin }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const newPosition = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      // console.log("Mouse position:", newPosition);
      setMousePosition(newPosition);
    }
  };

  useEffect(() => {
    // console.log("Button ref:", buttonRef.current);
  }, []);

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleGoogleLogin}
      onMouseMove={handleMouseMove}
      className="w-full text-white mx-auto justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-gray-700 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex items-center gap-2 relative overflow-hidden"
    >
      <motion.div
        className="absolute bg-blue-700 rounded-full pointer-events-none"
        style={{
          width: 199,
          height: 199,
          transform: `translate(${mousePosition.x - 260}px, ${mousePosition.y - 0}px)`,
          opacity: 0.5,
        }}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="4"></circle>
        <line x1="21.17" x2="12" y1="8" y2="8"></line>
        <line x1="3.95" x2="8.54" y1="6.06" y2="14"></line>
        <line x1="10.88" x2="15.46" y1="21.94" y2="14"></line>
      </svg>
      Sign in with Google
    </motion.button>
  );
}