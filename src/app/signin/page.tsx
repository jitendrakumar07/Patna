"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      username,
      password,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          🔐 Sign In
        </h1>

        {error && (
          <p className="mb-4 text-red-500 text-sm text-center">
            Sign in failed. Check your credentials.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-300 dark:border-gray-700 pt-4">
          <p className="font-semibold mb-1">💡 Demo Credentials:</p>
          <ul className="space-y-1">
            <li>
              <span className="font-medium">Admin:</span> <code>admin</code> /{" "}
              <code>admin123</code>
            </li>
            <li>
              <span className="font-medium">User:</span> <code>user</code> /{" "}
              <code>user123</code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
