"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCourses } from "@/components/courses/CourseProvider";
import { useSession } from "next-auth/react";
import Schedule from "@/components/course/Schedule";

export default function HomePage() {
  const { data: session } = useSession();
  const { courses } = useCourses();

  // Save user profile image to localStorage when session changes
  useEffect(() => {
    if (session?.user?.image) {
      // Create a user-specific localStorage key
      const storageKey = `userProfileImage_${
        session.user.id || session.user.email
      }`;
      // Save to localStorage as backup
      localStorage.setItem(storageKey, session.user.image);
    }
  }, [session]);

  const handleMarkProgress = (courseId: string, hoursCompleted: number) => {
    // Implement the logic to update the course progress in the state
    console.log(
      `Marking progress for course ${courseId} by ${hoursCompleted} hours`
    );
  };

  return (
    <div className="container mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Study Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your courses, manage your study time, and stay on top of
          deadlines.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Schedule courses={courses} onMarkProgress={handleMarkProgress} />
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link
                href="/add-course"
                className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
              >
                <span className="font-medium">Add New Course</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </Link>

              <Link
                href="/recommendations"
                className="w-full flex items-center justify-between px-4 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <span className="font-medium">View Recommendations</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </Link>

              <Link
                href="/statistics"
                className="w-full flex items-center justify-between px-4 py-3 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
              >
                <span className="font-medium">View Statistics</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </Link>

              <Link
                href="/study-groups"
                className="w-full flex items-center justify-between px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <span className="font-medium">Join Study Groups</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Upcoming Deadlines
            </h2>

            {courses.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No courses added yet
              </p>
            ) : (
              <div className="space-y-3">
                {courses
                  .filter((course) => course.deadline)
                  .sort((a, b) => {
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return (
                      new Date(a.deadline).getTime() -
                      new Date(b.deadline).getTime()
                    );
                  })
                  .slice(0, 3)
                  .map((course) => {
                    const deadlineDate = course.deadline
                      ? new Date(course.deadline)
                      : null;
                    const daysLeft = deadlineDate
                      ? Math.ceil(
                          (deadlineDate.getTime() - Date.now()) /
                            (1000 * 60 * 60 * 24)
                        )
                      : null;

                    const getUrgencyColor = () => {
                      if (!daysLeft) return "text-gray-600 dark:text-gray-400";
                      if (daysLeft <= 3)
                        return "text-red-600 dark:text-red-400";
                      if (daysLeft <= 7)
                        return "text-amber-600 dark:text-amber-400";
                      return "text-green-600 dark:text-green-400";
                    };

                    return (
                      <div
                        key={course.id}
                        className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {course.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {deadlineDate?.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        {daysLeft !== null && (
                          <span
                            className={`text-sm font-medium ${getUrgencyColor()}`}
                          >
                            {daysLeft === 0
                              ? "Due today"
                              : daysLeft < 0
                              ? "Overdue"
                              : daysLeft === 1
                              ? "1 day left"
                              : `${daysLeft} days left`}
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}

            <Link
              href="/deadlines"
              className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 inline-flex items-center"
            >
              View all deadlines
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
