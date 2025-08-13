"use client";

import { Instrument_Serif, Inter } from "next/font/google";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function HowToUsePage() {
  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Noise Texture Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Content above background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Fixed Navbar */}
        <nav
          className="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center justify-between w-[95vw] max-w-6xl px-4 sm:px-6 py-3 border border-gray-300 rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
          style={{ zIndex: 30 }}
        >
          <Link
            href="/"
            className={`${instrumentSerif.className} font-sans text-xl sm:text-2xl hover:opacity-80 transition-opacity`}
          >
            the4Q
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`${inter.className} text-gray-700 hover:text-gray-900 font-medium`}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/how-to-use"
              className={`${inter.className} text-gray-900 font-medium underline underline-offset-4`}
            >
              How to Use
            </Link>
            <UserButton />
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex flex-col items-center justify-start pt-24 sm:pt-28 pb-16 w-full px-4">
          <div className="w-full max-w-4xl mx-auto">
            <div className="mb-10 text-center">
              <h1 className={`${instrumentSerif.className} text-4xl sm:text-5xl md:text-6xl font-normal italic mb-4`}>
                The 4 Quadrants
              </h1>
              <p className={`${inter.className} text-lg text-gray-600`}>
                From Stephen Covey's "The 7 Habits of Highly Effective People"
              </p>
            </div>

            <div className="mb-12">
              <p className={`${inter.className} text-lg mb-6 leading-relaxed`}>
                Stephen Covey introduces a powerful tool called the Time Management Matrix, 
                which divides our activities into four quadrants based on their urgency and importance. 
                Here's a straightforward guide to understanding and using these quadrants:
              </p>
            </div>

            {/* Quadrant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Quadrant I */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`${instrumentSerif.className} text-4xl font-normal italic text-red-700`}>I</span>
                  <h2 className={`${inter.className} font-semibold text-xl`}>
                    Urgent & Important <span className="text-red-600 font-normal">(Do It!)</span>
                  </h2>
                </div>
                <p className={`${inter.className} leading-relaxed`}>
                  Tasks that demand immediate attention—emergencies, deadlines, and pressing problems. 
                  Living here causes stress and burnout, as you're always reacting to crises.
                </p>
                <div className="mt-4 bg-red-100/80 p-3 rounded-lg">
                  <p className="text-sm text-red-800 font-medium">Examples: Crises, pressing problems, deadlines</p>
                </div>
              </div>

              {/* Quadrant II */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`${instrumentSerif.className} text-4xl font-normal italic text-emerald-700`}>II</span>
                  <h2 className={`${inter.className} font-semibold text-xl`}>
                    Not Urgent & Important <span className="text-emerald-600 font-normal">(Plan It!)</span>
                  </h2>
                </div>
                <p className={`${inter.className} leading-relaxed`}>
                  Activities that build the foundation for long-term success. 
                  Effectiveness grows when you prioritize these tasks, as they align with your 
                  values and high-priority goals.
                </p>
                <div className="mt-4 bg-emerald-100/80 p-3 rounded-lg">
                  <p className="text-sm text-emerald-800 font-medium">Examples: Planning, relationships, prevention, growth, long-term goals</p>
                </div>
              </div>

              {/* Quadrant III */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`${instrumentSerif.className} text-4xl font-normal italic text-amber-700`}>III</span>
                  <h2 className={`${inter.className} font-semibold text-xl`}>
                    Urgent & Not Important <span className="text-amber-600 font-normal">(Avoid It!)</span>
                  </h2>
                </div>
                <p className={`${inter.className} leading-relaxed`}>
                  These can feel important because they're urgent, but they don't move you toward your goals. 
                  Spending too much time here leads to feeling busy but not productive.
                </p>
                <div className="mt-4 bg-amber-100/80 p-3 rounded-lg">
                  <p className="text-sm text-amber-800 font-medium">Examples: Interruptions, some calls/emails, "busy work"—usually for others' priorities</p>
                </div>
              </div>

              {/* Quadrant IV */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`${instrumentSerif.className} text-4xl font-normal italic text-blue-700`}>IV</span>
                  <h2 className={`${inter.className} font-semibold text-xl`}>
                    Not Urgent & Not Important <span className="text-blue-600 font-normal">(Delete It!)</span>
                  </h2>
                </div>
                <p className={`${inter.className} leading-relaxed`}>
                  Activities that offer little value and should be minimized to avoid wasted time.
                  These are time-wasters that don't contribute to your goals or well-being.
                </p>
                <div className="mt-4 bg-blue-100/80 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">Examples: Mindless scrolling, excessive TV, and procrastination activities</p>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="my-10 border-l-4 border-gray-300 pl-6 py-2">
              <blockquote className={`${instrumentSerif.className} text-2xl italic text-gray-700`}>
                "Quadrant II is the heart of effective personal management."
              </blockquote>
              <p className={`${inter.className} mt-2 text-gray-600`}>— Stephen Covey</p>
            </div>

            {/* Key Takeaways */}
            <div className="bg-gray-50 rounded-xl p-8 mb-12">
              <h3 className={`${instrumentSerif.className} text-2xl mb-5 italic`}>Key Takeaways</h3>
              <ul className={`${inter.className} space-y-4 list-disc pl-5`}>
                <li className="text-lg">
                  <span className="font-medium">Effective people spend most of their time in Quadrant II</span>,
                  tackling important, non-urgent tasks and setting themselves up for success.
                </li>
                <li className="text-lg">
                  <span className="font-medium">Prioritizing Quadrant II activities reduces burnout</span>,
                  improves life balance, and leads to greater achievement.
                </li>
                <li className="text-lg">
                  <span className="font-medium">Ask yourself regularly:</span> How can I spend more time in Quadrant II?
                </li>
              </ul>
            </div>

            {/* How to Use This App */}
            <div className="mt-16 mb-12">
              <h2 className={`${instrumentSerif.className} text-3xl mb-6 italic text-center`}>How to Use This App</h2>
              
              <ol className={`${inter.className} space-y-6 list-decimal pl-5`}>
                <li className="text-lg">
                  <span className="font-semibold">Create tasks</span> by clicking the "+" button in any quadrant or using the "Create Task" button.
                </li>
                <li className="text-lg">
                  <span className="font-semibold">Drag and drop tasks</span> between quadrants to prioritize your work based on urgency and importance.
                </li>
                <li className="text-lg">
                  <span className="font-semibold">Complete tasks</span> by clicking the checkbox when they're done.
                </li>
                <li className="text-lg">
                  <span className="font-semibold">Review your completed tasks</span> to see your productivity patterns.
                </li>
                <li className="text-lg">
                  <span className="font-semibold">Aim to maximize time in Quadrant II</span> for the greatest long-term effectiveness.
                </li>
              </ol>
            </div>
          </div>

          <footer className="mt-16 text-center text-base sm:text-lg text-gray-700">
            <p className={inter.className}>
              Made by{" "}
              <span className={`${instrumentSerif.className} italic font-semibold`}>
                Blessing Joshua
              </span>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}