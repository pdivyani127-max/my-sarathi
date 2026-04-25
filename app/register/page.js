"use client";
import { useRouter } from "next/navigation";
import BackButton from "../components/BackButton";
import LanguageSelector from "../components/LanguageSelector";

export default function Register() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center mt-20">
        <BackButton />
<LanguageSelector />
      <h2 className="text-2xl mb-4">Register As</h2>

      <button
        onClick={() => router.push("/register/user")}
        className="mb-2 bg-blue-500 p-2 text-white"
      >
        User
      </button>

      <button
        onClick={() => router.push("/register/admin")}
        className="bg-red-500 p-2 text-white"
      >
        Admin
      </button>
    </div>
  );
}