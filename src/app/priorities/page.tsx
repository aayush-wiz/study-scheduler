"use client";

import Link from "next/link";
import { useCourses } from "@/components/courses/CourseProvider";

export default function PrioritiesPage() {
  const { courses } = useCourses();

  // Filter high priority courses
  const highPriorityCourses = courses
    .filter((course) => course.priority === "High")
    .sort((a, b) => {
      // Sort by deadline if available
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (a.deadline) {
        return -1; // a has deadline, b doesn't
      } else if (b.deadline) {
        return 1; // b has deadline, a doesn't
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              High Priority Courses
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Focus on these courses first
            </p>
          </div>
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-red-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              High Priority Courses
            </h2>
          </div>

          {highPriorityCourses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-red-200 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                No High Priority Courses
              </h3>
              <p className="text-gray-500 mb-4">
                You don&apos;t have any high priority courses at the moment.
              </p>
              <Link
                href="/add-course"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-sm"
              >
                Add a Course
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {highPriorityCourses.map((course) => {
                const progressPercentage = Math.round(
                  (course.completedHours / course.hoursNeeded) * 100
                );
                const daysUntilDeadline = course.deadline
                  ? Math.ceil(
                      (new Date(course.deadline).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  : null;

                return (
                  <li
                    key={course.id}
                    className="p-6 hover:bg-gradient-to-r hover:from-red-50/40 hover:to-red-50/20 transition-colors"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            {course.name}
                            {daysUntilDeadline !== null &&
                              daysUntilDeadline <= 3 && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  {daysUntilDeadline === 0
                                    ? "Due today"
                                    : daysUntilDeadline === 1
                                    ? "Due tomorrow"
                                    : `${daysUntilDeadline} days left`}
                                </span>
                              )}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span>{course.difficulty}</span>
                            {course.deadline && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="font-medium">
                                  Due:{" "}
                                  {new Date(
                                    course.deadline
                                  ).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block text-sm font-medium text-gray-800">
                            {progressPercentage}% Complete
                          </span>
                          <span className="text-xs text-gray-500">
                            {course.completedHours}/{course.hoursNeeded} hours
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300"
                            style={{
                              width: `${Math.min(100, progressPercentage)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Link
                          href={`/progress?courseId=${course.id}`}
                          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm rounded-md hover:from-red-700 hover:to-red-800 transition-colors shadow-sm flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Update Progress
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
