"use client";

import { useState } from "react";

function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 100) {
    throw new Error("Please enter an integer between 1 and 100");
  }

  const map: [number, string][] = [
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];

  let result = "";
  for (const [value, numeral] of map) {
    while (n >= value) {
      result += numeral;
      n -= value;
    }
  }
  return result;
}

export default function RomanNumeralsPage() {
  const [number, setNumber] = useState("");
  const [roman, setRoman] = useState("");
  const [error, setError] = useState("");

  const handleConvert = () => {
    try {
      const num = parseInt(number, 10);
      const result = toRoman(num);
      setRoman(result);
      setError("");
    } catch (err) {
      setRoman("");
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">🔢 Roman Numerals Converter</h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter 1-100"
            className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handleConvert}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition"
          >
            Convert
          </button>
        </div>

        {error && (
          <p className="mt-4 text-red-500 font-medium text-center">{error}</p>
        )}

        {roman && !error && (
          <p className="mt-6 text-center text-xl">
            <strong>Result:</strong> <span className="text-green-600 dark:text-green-400">{roman}</span>
          </p>
        )}
      </div>
    </div>
  );
}
