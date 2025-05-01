"use client";

import { useState } from "react";
import { Course } from "../components/StudyScheduler";
import Link from "next/link";
import CourseForm from "../components/CourseForm";
import { useCourses } from "@/components/courses/CourseProvider";

export default function Courses() {
  const { courses, setCourses, availableHours, setAvailableHours } =
    useCourses();
  const [error, setError] = useState<string>("");

  const addCourse = (course: Course) => {
    setCourses([...courses, { ...course, completedHours: 0 }]);
  };

  const removeCourse = (courseId: string) => {
    setCourses(courses.filter((c) => c.id !== courseId));
  };

  const totalAllocatedHours = courses.reduce(
    (sum, course) => sum + course.hoursNeeded,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
            <p className="mt-2 text-gray-600">Add and manage your courses</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/progress"
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Track Progress
            </Link>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            >
              View Schedule
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-4 bg-white rounded-lg shadow space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Available Study Hours per Week
              <input
                type="number"
                min="1"
                value={availableHours}
                onChange={(e) => {
                  const hours = Number(e.target.value);
                  setAvailableHours(hours);
                  setError(
                    hours < courses.length
                      ? "Not enough hours for all courses"
                      : ""
                  );
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>

          <CourseForm
            onAddCourse={addCourse}
            totalAllocatedHours={totalAllocatedHours}
            availableHours={availableHours}
          />

          {/* Display added courses */}
          {courses.length > 0 && (
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Added Courses
                </h3>
                <div className="text-sm text-gray-500">
                  Total Hours: {totalAllocatedHours}/{availableHours || "∞"}
                </div>
              </div>
              <div className="space-y-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div>
                      <div className="font-medium">{course.name}</div>
                      <div className="text-sm text-gray-500">
                        <span>{course.hoursNeeded} hours/week • </span>
                        <span
                          className={`${
                            course.difficulty === "Hard"
                              ? "text-red-600"
                              : course.difficulty === "Medium"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {course.difficulty}
                        </span>
                        <span> • </span>
                        <span
                          className={`${
                            course.priority === "High"
                              ? "text-red-600"
                              : course.priority === "Medium"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {course.priority} Priority
                        </span>
                        {course.deadline && (
                          <>
                            <span> • Due: </span>
                            <span>
                              {new Date(course.deadline).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove course"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
