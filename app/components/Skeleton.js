"use client";
import { motion } from "framer-motion";

export function Skeleton({ className = "", rounded = "rounded-2xl", ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 0.9 }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      className={`bg-white/5 border border-white/5 relative overflow-hidden ${rounded} ${className}`}
      {...props}
    >
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 z-10 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
      />
    </motion.div>
  );
}

export function SkeletonCard({ className = "" }) {
  return (
    <Skeleton className={`p-6 flex flex-col gap-5 ${className}`}>
        <div className="flex gap-4 items-center">
             <Skeleton className="w-14 h-14" rounded="rounded-2xl" />
             <div className="flex flex-col gap-2.5 flex-grow">
                  <Skeleton className="h-4 w-3/4" rounded="rounded-md" />
                  <Skeleton className="h-3 w-2/5" rounded="rounded-md" />
             </div>
        </div>
        <div className="flex flex-col gap-2 mt-2">
            <Skeleton className="h-2.5 w-full" rounded="rounded-sm" />
            <Skeleton className="h-2.5 w-full" rounded="rounded-sm" />
            <Skeleton className="h-2.5 w-4/5" rounded="rounded-sm" />
        </div>
    </Skeleton>
  );
}

export function SkeletonText({ lines = 1, className = "" }) {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
       {Array.from({ length: lines }).map((_, i) => (
         <Skeleton key={i} className={`h-3 ${i === lines - 1 && lines > 1 ? 'w-2/3' : 'w-full'}`} rounded="rounded-md" />
       ))}
    </div>
  );
}
