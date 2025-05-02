"use client";

import Link from "next/link";
import { useCourses } from "@/components/courses/CourseProvider";

export default function DeadlinesPage() {
  const { courses } = useCourses();

  // Get current date
  const today = new Date();

  // Filter courses with deadlines and sort by closest deadline
  const upcomingDeadlines = courses
    .filter((course) => course.deadline && new Date(course.deadline) >= today)
    .sort(
      (a, b) =>
        new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
    );

  // Function to calculate days until deadline
  const getDaysUntil = (dateString: string) => {
    const deadline = new Date(dateString);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Function to get deadline status text and class
  const getDeadlineStatus = (dateString: string) => {
    const daysUntil = getDaysUntil(dateString);

    if (daysUntil <= 1) {
      return {
        text: daysUntil === 0 ? "Due today" : "Due tomorrow",
        className: "bg-amber-500 text-white",
      };
    } else if (daysUntil <= 3) {
      return {
        text: `Due in ${daysUntil} days`,
        className: "bg-amber-400 text-amber-900",
      };
    } else {
      return {
        text: `Due in ${daysUntil} days`,
        className: "bg-amber-100 text-amber-800",
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Upcoming Deadlines
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your course deadlines
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
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-amber-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Upcoming Deadlines
            </h2>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-amber-200 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                No Upcoming Deadlines
              </h3>
              <p className="text-gray-500 mb-4">
                You don&apos;t have any upcoming deadlines at the moment.
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
              {upcomingDeadlines.map((course) => {
                const progressPercentage = Math.round(
                  (course.completedHours / course.hoursNeeded) * 100
                );
                const deadlineStatus = getDeadlineStatus(course.deadline!);

                return (
                  <li
                    key={course.id}
                    className="p-6 hover:bg-gradient-to-r hover:from-amber-50/40 hover:to-amber-50/20 transition-colors"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {course.name}
                            </h3>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full font-medium ${deadlineStatus.className}`}
                            >
                              {deadlineStatus.text}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{course.difficulty}</span>
                            <span className="mx-2">•</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                course.priority === "High"
                                  ? "bg-red-100 text-red-800"
                                  : course.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {course.priority} Priority
                            </span>
                            <span className="mx-2">•</span>
                            <span className="text-gray-500">
                              Due:{" "}
                              {new Date(course.deadline!).toLocaleDateString()}
                            </span>
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
                            className={`h-full transition-all duration-300 ${
                              course.priority === "High"
                                ? "bg-gradient-to-r from-red-500 to-red-600"
                                : course.priority === "Medium"
                                ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                                : "bg-gradient-to-r from-green-500 to-green-600"
                            }`}
                            style={{
                              width: `${Math.min(100, progressPercentage)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Link
                          href={`/progress?courseId=${course.id}`}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm rounded-md hover:from-amber-600 hover:to-amber-700 transition-colors shadow-sm flex items-center"
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
