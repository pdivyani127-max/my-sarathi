"use client";
import { useRouter, usePathname } from "next/navigation";

export default function BackButton({ disabled = false, redirectTo = null }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (disabled) return;

    if (redirectTo) {
      router.push(redirectTo);
    } else if (pathname === "/user") {
      router.push("/login");
    } else if (pathname === "/admin") {
      router.push("/");
    } else if (pathname === "/login") {
      router.push("/");
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-white/70 font-sora text-[13px] font-medium transition-all duration-200 backdrop-blur-md tracking-wide whitespace-nowrap group ${disabled ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer hover:bg-white/10 hover:border-white/20 hover:text-white hover:-translate-x-0.5 active:scale-95'}`}
    >
      <span className={`text-sm transition-transform duration-200 ${disabled ? '' : 'group-hover:-translate-x-1'}`}>←</span>
      Back
    </button>
  );
}
