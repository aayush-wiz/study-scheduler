"use client";

import { useState } from "react";
import Link from "next/link";
import { useCourses } from "@/components/courses/CourseProvider";
import type { Course } from "@/types/course";

export default function ProgressPage() {
  const { courses, setCourses } = useCourses();

  // Sort courses by priority (High > Medium > Low)
  const sortedCourses = [...courses].sort((a, b) => {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return (
      priorityOrder[a.priority as keyof typeof priorityOrder] -
      priorityOrder[b.priority as keyof typeof priorityOrder]
    );
  });

  // Calculate overall stats
  const totalHoursNeeded = courses.reduce(
    (sum, course) => sum + course.hoursNeeded,
    0
  );
  const totalHoursCompleted = courses.reduce(
    (sum, course) => sum + course.completedHours,
    0
  );
  const overallProgress =
    totalHoursNeeded > 0
      ? Math.round((totalHoursCompleted / totalHoursNeeded) * 100)
      : 0;

  const handleUpdateProgress = (courseId: string, hours: number) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              completedHours: Math.min(
                course.completedHours + hours,
                course.hoursNeeded
              ),
            }
          : course
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Course Progress
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Track and update your progress across all courses
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

        {/* Overall Progress Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Overall Progress
          </h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Total Progress</span>
                <span>
                  {totalHoursCompleted}/{totalHoursNeeded} hours (
                  {overallProgress}%)
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                  style={{
                    width: `${Math.min(100, overallProgress)}%`,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
              <div className="text-2xl font-semibold text-gray-800">
                {courses.length}
              </div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
              <div className="text-2xl font-semibold text-gray-800">
                {totalHoursCompleted}
              </div>
              <div className="text-sm text-gray-600">Hours Completed</div>
            </div>
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
              <div className="text-2xl font-semibold text-gray-800">
                {totalHoursNeeded - totalHoursCompleted}
              </div>
              <div className="text-sm text-gray-600">Hours Remaining</div>
            </div>
          </div>
        </div>

        {/* Course Progress List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h2 className="text-lg font-semibold text-gray-800">
              Course Progress
            </h2>
          </div>

          {courses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-indigo-200 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                No Courses Added
              </h3>
              <p className="text-gray-500 mb-4">
                You haven&apos;t added any courses yet.
              </p>
              <Link
                href="/add-course"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-sm"
              >
                Add Your First Course
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {sortedCourses.map((course) => {
                const progressPercentage = Math.round(
                  (course.completedHours / course.hoursNeeded) * 100
                );

                return (
                  <li
                    key={course.id}
                    className="p-6 hover:bg-gradient-to-r hover:from-indigo-50/40 hover:to-purple-50/40 transition-colors"
                  >
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {course.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
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
                            {course.deadline && (
                              <>
                                <span className="mx-2">•</span>
                                <span>
                                  Due:{" "}
                                  {new Date(
                                    course.deadline
                                  ).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <CourseProgressUpdater
                          course={course}
                          onUpdate={(hours) =>
                            handleUpdateProgress(course.id, hours)
                          }
                        />
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>
                            {course.completedHours}/{course.hoursNeeded} hours (
                            {progressPercentage}%)
                          </span>
                        </div>
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

// Component for updating course progress
function CourseProgressUpdater({
  onUpdate,
}: {
  course: Course;
  onUpdate: (hours: number) => void;
}) {
  const [hours, setHours] = useState(1);

  const handleHoursChange = (value: number) => {
    setHours(Math.max(0.5, value));
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg border border-indigo-100/50">
      <div className="flex items-center mb-2">
        <button
          onClick={() => handleHoursChange(hours - 0.5)}
          className="p-1 bg-white rounded text-indigo-600 w-7 h-7 flex items-center justify-center border border-indigo-200 shadow-sm"
          disabled={hours <= 0.5}
        >
          -
        </button>
        <input
          type="number"
          min="0.5"
          step="0.5"
          value={hours}
          onChange={(e) => handleHoursChange(parseFloat(e.target.value))}
          className="w-16 mx-2 p-1 text-center border border-indigo-200 rounded"
        />
        <button
          onClick={() => handleHoursChange(hours + 0.5)}
          className="p-1 bg-white rounded text-indigo-600 w-7 h-7 flex items-center justify-center border border-indigo-200 shadow-sm"
        >
          +
        </button>
        <span className="ml-1 text-sm text-gray-600">hours</span>
      </div>
      <button
        onClick={() => onUpdate(hours)}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-1 px-4 rounded text-sm hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-sm"
      >
        Log Progress
      </button>
    </div>
  );
}
