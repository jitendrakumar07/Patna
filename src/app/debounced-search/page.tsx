"use client";

import { useState, useEffect } from "react";

type Book = {
  key: string;
  title: string;
  author_name?: string[];
};

export default function DebouncedSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Clear existing timer before setting new one
    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data.docs.slice(0, 10)); // first 10 results
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }, 1000); // 1 second debounce

    setDebounceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-8">📚 Debounced Book Search</h1>

      {/* Search Input */}
      <div className="w-full max-w-lg relative text-white">
        <input
          type="text"
          placeholder="Search for books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-full px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white"
        />
        {loading && (
          <span className="absolute right-5 top-3 text-sm text-white animate-pulse">
            Loading...
          </span>
        )}
      </div>

      {/* Results Dropdown */}
      {results.length > 0 && (
        <ul className="mt-4 w-full max-w-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
          {results.map((book) => (
            <li
              key={book.key}
              className="px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition flex flex-col"
            >
              <span className="font-semibold">{book.title}</span>
              {book.author_name && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {book.author_name.join(", ")}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* No Results */}
      {query && !loading && results.length === 0 && (
        <p className="mt-4 text-gray-500">No results found.</p>
      )}
    </div>
  );
}
