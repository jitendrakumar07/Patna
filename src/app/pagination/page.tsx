"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
};

export default function PaginationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const [page, setPage] = useState(pageParam);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Fetch products whenever page changes
  useEffect(() => {
    async function fetchProducts() {
      const skip = (page - 1) * limit;
      const res = await fetch(
        `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
      );
      const data = await res.json();
      setProducts(data.products);
      setTotal(data.total);
    }
    fetchProducts();
  }, [page]);

  // Keep URL in sync
  useEffect(() => {
    router.push(`?page=${page}`);
  }, [page, router]);

  const totalPages = Math.ceil(total / limit);

  // Convert USD → INR (approx)
  const usdToInr = (usd: number) => Math.round(usd * 83.5);

  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-8">🛒 Paginated Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 w-full max-w-7xl">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            {/* Image Section with hover zoom */}
            <div className="overflow-hidden relative group">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-52 object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg font-semibold mb-2 truncate">{product.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {product.description}
              </p>

              {/* Price + Button Section */}
              <div className="mt-auto border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  ₹{usdToInr(product.price).toLocaleString("en-IN")}
                </span>
                <button
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-full shadow-md transition"
                  onClick={() => alert(`${product.title} added to cart`)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex gap-4 mt-10">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-5 py-2 rounded-full bg-gray-300 dark:bg-gray-700 disabled:opacity-50 shadow-md hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Previous
        </button>
        <span className="px-4 py-2 font-medium">
          Page {page} of {totalPages || 1}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-5 py-2 rounded-full bg-gray-300 dark:bg-gray-700 disabled:opacity-50 shadow-md hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
