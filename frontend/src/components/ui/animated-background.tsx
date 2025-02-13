import { motion } from "framer-motion";

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0 w-full h-full opacity-[0.15] dark:opacity-[0.2]"
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 2, 0],
        }}
        transition={{
          duration: 25,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <svg
          className="w-[200%] h-[200%] absolute -top-1/2 -left-1/2 text-black dark:text-white"
          viewBox="0 0 1600 1600"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id="topo-pattern"
              x="0"
              y="0"
              width="200"
              height="200"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(15)"
            >
              <motion.path
                d="M 0,50 C 40,20 60,80 100,50 C 140,20 160,80 200,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                animate={{
                  d: [
                    "M 0,50 C 40,20 60,80 100,50 C 140,20 160,80 200,50",
                    "M 0,50 C 40,80 60,20 100,50 C 140,80 160,20 200,50",
                    "M 0,50 C 40,20 60,80 100,50 C 140,20 160,80 200,50",
                  ],
                }}
                transition={{
                  duration: 10,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
              <motion.path
                d="M 0,150 C 40,120 60,180 100,150 C 140,120 160,180 200,150"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                animate={{
                  d: [
                    "M 0,150 C 40,120 60,180 100,150 C 140,120 160,180 200,150",
                    "M 0,150 C 40,180 60,120 100,150 C 140,180 160,120 200,150",
                    "M 0,150 C 40,120 60,180 100,150 C 140,120 160,180 200,150",
                  ],
                }}
                transition={{
                  duration: 10,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: 0.5,
                }}
              />
              <motion.path
                d="M 0,100 C 40,70 60,130 100,100 C 140,70 160,130 200,100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                animate={{
                  d: [
                    "M 0,100 C 40,70 60,130 100,100 C 140,70 160,130 200,100",
                    "M 0,100 C 40,130 60,70 100,100 C 140,130 160,70 200,100",
                    "M 0,100 C 40,70 60,130 100,100 C 140,70 160,130 200,100",
                  ],
                }}
                transition={{
                  duration: 10,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: 1,
                }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo-pattern)" />
        </svg>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background/5" />
    </div>
  );
};
