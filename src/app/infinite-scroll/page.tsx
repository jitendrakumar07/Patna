"use client";

import { useEffect, useRef, useState } from "react";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  description?: string;
};

export default function InfiniteScrollPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const LIMIT = 10;

  // USD → INR converter
  const usdToInr = (usd: number) => Math.round(usd * 83.5);

  useEffect(() => {
    const fetchProducts = async () => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const res = await fetch(
          `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`
        );
        const data = await res.json();

        setProducts((prev) => {
          // Avoid duplicates
          const newItems = data.products.filter(
            (p: Product) => !prev.some((existing) => existing.id === p.id)
          );
          return [...prev, ...newItems];
        });

        if (skip + LIMIT >= data.total) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          setSkip((prev) => prev + LIMIT);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasMore, loading]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Infinite Scroll Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
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
              {product.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {product.description}
                </p>
              )}

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

      {loading && <p className="mt-6">Loading...</p>}
      {!hasMore && <p className="mt-6 text-gray-500">No more products</p>}

      {/* Observer trigger element */}
      <div ref={observerRef} className="h-10"></div>
    </div>
  );
}
