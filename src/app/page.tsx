"use client";

import Link from "next/link";
import ThemeToggleButton from "@/components/ThemeToggleButton";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 ">
      <h1 className="text-3xl font-bold">Home</h1>
      <p className="text-lg">Choose a problem to view its solution:</p>

      <div className="flex flex-col gap-3">
        {/* Problem 1 */}
        <Link
          href="/roman-numerals"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center"
        >
          1️⃣ Convert Numbers to Roman Numerals
        </Link>

        {/* Problem 2 */}
        <Link
          href="/pagination"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center"
        >
          2️⃣ Paginated Products
        </Link>

        {/* Problem 3 */}
        <Link
          href="/debounced-search"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center"
        >
          3️⃣ Debounced Book Search
        </Link>

        {/* Problem 4 */}
        <Link
          href="api/rate-limit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center"
        >
          4️⃣ Rate Limiting API
        </Link>
{/* Problem 5 */}
        <Link
          href="/signin"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center"
        >
          5️⃣ Sign In & RBAC
        </Link>

        {/* Problem 6 */}
        <Link
          href="/infinite-scroll"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center"
        >
          6️⃣ Infinite Scroll Products
        </Link>

        {/* Problem 7 */}
        <Link
          href="/toast"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center"
        >
          7️⃣ Toast Notifications
        </Link>
        {/* Problem 8 */}
        <Link
          href="/comments"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center"
        >
          8️⃣ Comments with Nested Replies
        </Link>

        {/* Problem 9 */}
        <ThemeToggleButton />
        {/* Problem 10 */}
        <Link
          href="/file-upload"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center"
        >
          10️⃣ File Upload with Preview
        </Link>
       


       
      </div>
    </div>
  );
}
