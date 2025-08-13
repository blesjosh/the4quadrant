"use client";

import { fetchTasks } from "@/app/actions/taskActions";
import KanbanBoard from "@/components/KanbanBoard";
import { Instrument_Serif } from 'next/font/google';
import { Task } from "@/types";
import { UserButton, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
});

export default function DashboardPage() {
  const { isLoaded, userId } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      // Only fetch tasks when Clerk auth is loaded and we have a userId
      if (isLoaded && userId) {
        setIsLoading(true);
        try {
          const fetchedTasks = await fetchTasks();
          console.log("Fetched tasks:", fetchedTasks);
          setTasks(fetchedTasks);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (isLoaded && !userId) {
        // User is not authenticated
        setIsLoading(false);
        setTasks([]);
      }
      // If not loaded yet, keep isLoading true
    }

    loadTasks();
  }, [isLoaded, userId]);

  return (
    <div className="min-h-screen w-full bg-white relative font-serif">
      {/* Noise Texture (Darker Dots) Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />
      {/* Content above background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Fixed Navbar */}
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center justify-between w-[95vw] max-w-6xl px-4 sm:px-6 py-3 border border-gray-300 rounded-full bg-white/80 backdrop-blur-sm shadow-lg" style={{ zIndex: 30 }}>
          <span className={`${instrumentSerif.className} font-sans text-xl sm:text-2xl`}>the4Q</span>
          <UserButton />
        </nav>
        {/* Main Content */}
        <main className="flex flex-col items-center justify-start pt-24 sm:pt-28 pb-8 w-full px-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Loading your tasks...</p>
            </div>
          ) : (
            <KanbanBoard initialTasks={tasks} />
          )}
          <footer className="mt-12 text-center text-base sm:text-lg text-gray-700 font-serif">
            Made by <span className={`${instrumentSerif.className} italic font-semibold`}>Blessing Joshua</span>
          </footer>
        </main>
      </div>
    </div>
  );
}