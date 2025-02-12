import { motion } from "framer-motion";

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-[0.8] dark:opacity-[0.4]"
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 3, 0],
        }}
        transition={{
          duration: 20,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <svg
          className="w-full h-full text-white"
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="topo-pattern"
              x="0"
              y="0"
              width="200"
              height="200"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(0)"
            >
              <motion.path
                d="M 0,50 Q 50,0 100,50 T 200,50 M -50,50 Q 0,0 50,50 T 150,50 M 50,50 Q 100,0 150,50 T 250,50"
                fill="none"
                stroke="white"
                strokeWidth="2"
                animate={{
                  d: [
                    "M 0,50 Q 50,0 100,50 T 200,50 M -50,50 Q 0,0 50,50 T 150,50 M 50,50 Q 100,0 150,50 T 250,50",
                    "M 0,60 Q 50,10 100,60 T 200,60 M -50,60 Q 0,10 50,60 T 150,60 M 50,60 Q 100,10 150,60 T 250,60",
                    "M 0,50 Q 50,0 100,50 T 200,50 M -50,50 Q 0,0 50,50 T 150,50 M 50,50 Q 100,0 150,50 T 250,50",
                  ],
                }}
                transition={{
                  duration: 10,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
              <motion.path
                d="M 0,150 Q 50,100 100,150 T 200,150 M -50,150 Q 0,100 50,150 T 150,150 M 50,150 Q 100,100 150,150 T 250,150"
                fill="none"
                stroke="white"
                strokeWidth="2"
                animate={{
                  d: [
                    "M 0,150 Q 50,100 100,150 T 200,150 M -50,150 Q 0,100 50,150 T 150,150 M 50,150 Q 100,100 150,150 T 250,150",
                    "M 0,160 Q 50,110 100,160 T 200,160 M -50,160 Q 0,110 50,160 T 150,160 M 50,160 Q 100,110 150,160 T 250,160",
                    "M 0,150 Q 50,100 100,150 T 200,150 M -50,150 Q 0,100 50,150 T 150,150 M 50,150 Q 100,100 150,150 T 250,150",
                  ],
                }}
                transition={{
                  duration: 10,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: 0.5,
                }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo-pattern)" />
        </svg>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-background/30 to-background/80" />
    </div>
  );
};
