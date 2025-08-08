"use client";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/signin" })}
      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow transition"
    >
      Sign Out
    </button>
  );
}
