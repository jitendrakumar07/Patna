"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type ToastType = "success" | "error" | "info";
type Toast = { id: string; type: ToastType; message: string; title?: string };

// --- Toast Context ---
type ToastContextValue = {
  pushToast: (opts: { type?: ToastType; title?: string; message: string }) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// --- Toast Provider ---
function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const pushToast = useCallback(({ type = "info", title, message }: { type?: ToastType; title?: string; message: string }) => {
    const id = `${Date.now()}-${Math.random()}`;
    const toast: Toast = { id, type, title, message };
    setToasts((prev) => [toast, ...prev]);

    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timers.current.delete(id);
    }, 3000);
    timers.current.set(id, timer);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  };

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      <div className="fixed right-4 bottom-4 flex flex-col gap-3 max-w-[300px]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex justify-between items-start p-3 rounded shadow-md border text-sm ${
              t.type === "success"
                ? "bg-green-50 border-green-300 text-green-800"
                : t.type === "error"
                ? "bg-red-50 border-red-300 text-red-800"
                : "bg-blue-50 border-blue-300 text-blue-800"
            }`}
          >
            <div>
              {t.title && <div className="font-semibold">{t.title}</div>}
              <div>{t.message}</div>
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="ml-3 text-lg leading-none hover:text-black"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// --- Demo Page ---
export default function ToastDemoPage() {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <h1 className="text-2xl font-bold mb-4">Custom Toast Demo</h1>
        <ToastButtons />
      </div>
    </ToastProvider>
  );
}

function ToastButtons() {
  const { pushToast } = useToast();

  return (
    <div className="flex gap-3">
      <button
        onClick={() => pushToast({ type: "success", title: "Success", message: "Data saved successfully!" })}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Show Success
      </button>

      <button
        onClick={() => pushToast({ type: "error", title: "Error", message: "Something went wrong." })}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Show Error
      </button>

      <button
        onClick={() => pushToast({ type: "info", title: "Info", message: "Here’s some information." })}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Show Info
      </button>
    </div>
  );
}
