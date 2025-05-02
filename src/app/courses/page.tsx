"use client";

import React from "react";
import { Course } from "@/types";
import Link from "next/link";
import CourseForm from "@/components/course/CourseForm";
import { useCourses } from "@/components/courses/CourseProvider";

export default function Courses() {
  const { courses, setCourses } = useCourses();

  const addCourse = (courseData: Omit<Course, "id">) => {
    const newCourse: Course = {
      ...courseData,
      id: Math.random().toString(36).substring(7),
    };
    setCourses([...courses, newCourse]);
  };

  const removeCourse = (courseId: string) => {
    setCourses(courses.filter((c) => c.id !== courseId));
  };

  const totalHoursNeeded = courses.reduce(
    (sum, course) => sum + course.hoursNeeded,
    0
  );

  const totalHoursCompleted = courses.reduce(
    (sum, course) => sum + course.completedHours,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Manage Courses
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Add and manage your study courses
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

        <div className="space-y-8">
          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="text-sm uppercase text-indigo-400 font-medium mb-1">
                Total Courses
              </h3>
              <div className="text-3xl font-semibold text-gray-800">
                {courses.length}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="text-sm uppercase text-indigo-400 font-medium mb-1">
                Total Hours Needed
              </h3>
              <div className="text-3xl font-semibold text-gray-800">
                {totalHoursNeeded}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="text-sm uppercase text-indigo-400 font-medium mb-1">
                Completion
              </h3>
              <div className="text-3xl font-semibold text-gray-800">
                {totalHoursNeeded > 0
                  ? Math.round((totalHoursCompleted / totalHoursNeeded) * 100)
                  : 0}
                %
              </div>
            </div>
          </div>

          {/* Course form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <h2 className="text-lg font-semibold text-gray-800">
                Add New Course
              </h2>
            </div>
            <div className="p-6">
              <CourseForm
                onSubmit={addCourse}
              />
            </div>
          </div>

          {/* Display added courses */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <h2 className="text-lg font-semibold text-gray-800">
                Your Courses
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  No Courses Added
                </h3>
                <p className="text-gray-500 mb-4">
                  Start by adding your first course above.
                </p>
                <button
                  onClick={() => document.querySelector("input")?.focus()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-sm"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {courses.map((course) => {
                  const progressPercentage = Math.round(
                    (course.completedHours / course.hoursNeeded) * 100
                  );

                  return (
                    <li
                      key={course.id}
                      className="p-6 hover:bg-gradient-to-r hover:from-indigo-50/40 hover:to-purple-50/40 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {course.name}
                          </h3>
                          <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1">
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

                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>
                                {course.completedHours}/{course.hoursNeeded}{" "}
                                hours ({progressPercentage}%)
                              </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  course.priority === "High"
                                    ? "bg-gradient-to-r from-red-500 to-red-600"
                                    : course.priority === "Medium"
                                    ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                                    : "bg-gradient-to-r from-green-500 to-green-600"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    progressPercentage
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/progress`}
                            className="p-2 rounded-full hover:bg-indigo-50 text-indigo-600 hover:text-indigo-800 transition-colors"
                            aria-label="Update progress"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => removeCourse(course.id)}
                            className="p-2 rounded-full hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
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
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
