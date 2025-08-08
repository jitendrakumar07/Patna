import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !["user", "admin"].includes((session.user as any).role)) {
    redirect("/signin");
  }

  const role = (session.user as any).role;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">📊 Dashboard</h1>
        <p className="text-lg mb-2">
          Welcome back, <span className="font-semibold">{session.user?.name || "User"}</span>!
        </p>
        <span
          className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
            role === "admin"
              ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
              : "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white"
          }`}
        >
          {role.toUpperCase()}
        </span>

        <div className="mt-6">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
