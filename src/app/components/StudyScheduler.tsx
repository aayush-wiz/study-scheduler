"use client";

import { useState, useEffect } from "react";
import CourseForm from "./CourseForm";
import Schedule from "./Schedule";
import { useCourses } from "@/components/courses/CourseProvider";

export type Course = {
  id: string;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  hoursNeeded: number;
  priority: "Low" | "Medium" | "High";
  deadline?: string; // Optional deadline
  completedHours: number; // Track progress
};

const DIFFICULTY_WEIGHTS = {
  Hard: 1.5,
  Medium: 1,
  Easy: 0.7,
};

const PRIORITY_WEIGHTS = {
  High: 1.3,
  Medium: 1,
  Low: 0.7,
};

const MIN_HOURS_PER_COURSE = 1;
const MAX_HOURS_PERCENTAGE = 0.4; // Maximum 40% of total hours for any single course
const BREAK_TIME_RATIO = 0.2; // 20% of study time for breaks

export default function StudyScheduler({
  isPomodoroMode = false,
}: {
  isPomodoroMode?: boolean;
}) {
  const { courses, setCourses, availableHours, setAvailableHours } =
    useCourses();
  const [error, setError] = useState<string>("");
  const [showBreakTime, setShowBreakTime] = useState<boolean>(true);
  const [hoursInput, setHoursInput] = useState(availableHours.toString());
  const [activeTab, setActiveTab] = useState("courses"); // "courses" or "schedule"

  const MAX_WEEKLY_HOURS = 168; // Maximum hours in a week

  useEffect(() => {
    setHoursInput(availableHours.toString());
  }, [availableHours]);

  const validateHours = (value: string): boolean => {
    // Check if it's a valid number
    if (!/^\d*\.?\d*$/.test(value)) return false;

    const numValue = Number(value);
    // Check if it's greater than 0 and less than max weekly hours
    if (numValue <= 0 || numValue > MAX_WEEKLY_HOURS) return false;
    // Check if it has more than 1 decimal place
    if (value.includes(".") && value.split(".")[1].length > 1) return false;

    return true;
  };

  const handleHoursChange = (value: string) => {
    // Only allow numbers and one decimal point
    if (value === "" || validateHours(value)) {
      setHoursInput(value);
      if (value !== "") {
        const numValue = Number(value);
        if (numValue > MAX_WEEKLY_HOURS) {
          setError(
            `Maximum available hours per week cannot exceed ${MAX_WEEKLY_HOURS}`
          );
          return;
        }
        setAvailableHours(numValue);
        setError(
          numValue < courses.length ? "Not enough hours for all courses" : ""
        );
      }
    }
  };

  const addCourse = (course: Course) => {
    // Validate course hours
    if (course.hoursNeeded < 1) {
      setError("Course must require at least 1 hour per week");
      return;
    }

    setCourses([...courses, { ...course, completedHours: 0 }]);
    setError("");
  };

  const updateProgress = (courseId: string, completedHours: number) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              completedHours: Math.min(completedHours, course.hoursNeeded),
            }
          : course
      )
    );
  };

  const removeCourse = (courseId: string) => {
    setCourses(courses.filter((c) => c.id !== courseId));
  };

  const getEffectiveWeight = (course: Course) => {
    const difficultyWeight = DIFFICULTY_WEIGHTS[course.difficulty];
    const priorityWeight = PRIORITY_WEIGHTS[course.priority];

    // Calculate deadline urgency (if deadline exists)
    let deadlineWeight = 1;
    if (course.deadline) {
      const daysUntilDeadline = Math.max(
        1,
        Math.ceil(
          (new Date(course.deadline).getTime() - new Date().getTime()) /
            (1000 * 3600 * 24)
        )
      );
      deadlineWeight = Math.min(2, 14 / daysUntilDeadline); // More weight for closer deadlines
    }

    return difficultyWeight * priorityWeight * deadlineWeight;
  };

  const generateSchedule = () => {
    if (availableHours < courses.length) {
      setError("Not enough available hours for all courses");
      return [];
    }

    // Calculate effective study hours (accounting for breaks if enabled)
    const effectiveHours = showBreakTime
      ? availableHours * (1 - BREAK_TIME_RATIO)
      : availableHours;

    // Step 1: Calculate initial weighted hours with priority and deadline consideration
    let totalWeightedHours = 0;
    const initialAllocations = courses.map((course) => {
      const effectiveWeight = getEffectiveWeight(course);
      const remainingHours = course.hoursNeeded - course.completedHours;
      const weightedHours = remainingHours * effectiveWeight;
      totalWeightedHours += weightedHours;
      return { ...course, weightedHours, remainingHours };
    });

    // Step 2: Scale hours to fit available time while respecting minimums
    const scaleFactor = effectiveHours / totalWeightedHours;
    let remainingHours = effectiveHours;

    const allocatedCourses = initialAllocations.map((course) => {
      if (course.remainingHours <= 0) {
        return { ...course, allocatedHours: 0 };
      }

      // Calculate scaled hours
      let allocatedHours =
        Math.round(course.weightedHours * scaleFactor * 10) / 10;

      // Ensure minimum hours
      allocatedHours = Math.max(allocatedHours, MIN_HOURS_PER_COURSE);

      // Ensure no course takes too much time
      const maxHours = effectiveHours * MAX_HOURS_PERCENTAGE;
      allocatedHours = Math.min(
        allocatedHours,
        maxHours,
        course.remainingHours
      );

      remainingHours -= allocatedHours;

      return { ...course, allocatedHours };
    });

    // Step 3: Distribute any remaining hours proportionally
    if (remainingHours > 0) {
      const unfinishedCourses = allocatedCourses.filter(
        (c) => c.remainingHours > c.allocatedHours
      );
      const totalWeight = unfinishedCourses.reduce(
        (sum, course) => sum + getEffectiveWeight(course),
        0
      );

      if (totalWeight > 0) {
        return allocatedCourses.map((course) => {
          if (course.remainingHours <= course.allocatedHours) {
            return course;
          }
          const extraHours =
            (remainingHours * getEffectiveWeight(course)) / totalWeight;
          const newAllocatedHours = Math.min(
            course.remainingHours,
            Math.round((course.allocatedHours + extraHours) * 10) / 10
          );
          return { ...course, allocatedHours: newAllocatedHours };
        });
      }
    }

    return allocatedCourses;
  };

  const totalAllocatedHours = courses.reduce(
    (sum, course) => sum + course.hoursNeeded,
    0
  );

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "courses"
              ? "text-gray-800 border-b-2 border-gray-800"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("courses")}
        >
          Courses
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "schedule"
              ? "text-gray-800 border-b-2 border-gray-800"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("schedule")}
        >
          Weekly Schedule
        </button>
      </div>

      {activeTab === "courses" && (
        <>
          {/* Available Hours Input */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-gray-700 font-medium">Study Hours</h3>
              <span className="text-xs text-gray-500">
                {totalAllocatedHours}/{availableHours || "∞"} hours allocated
              </span>
            </div>
            <div className="flex mb-2">
              <input
                id="availableHours"
                type="text"
                value={hoursInput}
                onChange={(e) => handleHoursChange(e.target.value)}
                placeholder="Enter available hours"
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-l-md focus:outline-none w-full text-sm"
              />
              <div className="inline-flex">
                <button
                  onClick={() => handleHoursChange((Number(hoursInput) - 1).toString())}
                  className="px-3 py-1.5 bg-gray-50 border-t border-b border-r border-gray-200 text-gray-500 hover:bg-gray-100"
                  disabled={Number(hoursInput) <= 1}
                >
                  -
                </button>
                <button
                  onClick={() => handleHoursChange((Number(hoursInput) + 1).toString())}
                  className="px-3 py-1.5 bg-gray-50 border-t border-b border-r border-gray-200 rounded-r-md text-gray-500 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showBreakTime"
                checked={showBreakTime}
                onChange={() => setShowBreakTime(!showBreakTime)}
                className="h-3 w-3 text-gray-600 border-gray-300 rounded"
              />
              <label htmlFor="showBreakTime" className="text-xs text-gray-500">
                Include {Math.round(BREAK_TIME_RATIO * 100)}% break time in schedule
              </label>
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>
          
          {/* Course Form */}
          <div className="mb-6">
            <div className="mb-3 flex justify-between items-center">
              <h3 className="text-sm text-gray-700 font-medium">Add Course</h3>
            </div>
            <CourseForm
              onAddCourse={addCourse}
              totalAllocatedHours={totalAllocatedHours}
              availableHours={availableHours}
            />
          </div>

          {/* Courses List */}
          {courses.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <h3 className="text-sm text-gray-700 font-medium">Your Courses</h3>
                <span className="ml-2 text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{courses.length}</span>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-700">{course.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {course.difficulty} • {course.hoursNeeded}h 
                              {course.deadline && (
                                <> • Due: {new Date(course.deadline).toLocaleDateString()}</>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              course.priority === "High"
                                ? "bg-red-50 text-red-600"
                                : course.priority === "Medium"
                                ? "bg-yellow-50 text-yellow-600"
                                : "bg-green-50 text-green-600"
                            }`}
                          >
                            {course.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="w-32">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>{Math.round((course.completedHours / course.hoursNeeded) * 100)}%</span>
                              <span>{course.completedHours}/{course.hoursNeeded}h</span>
                            </div>
                            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gray-700 transition-all duration-300"
                                style={{
                                  width: `${Math.min(100, (course.completedHours / course.hoursNeeded) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-xs font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => updateProgress(course.id, course.completedHours - 1)}
                              disabled={course.completedHours <= 0}
                              className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                            >
                              -
                            </button>
                            <button
                              onClick={() => updateProgress(course.id, course.completedHours + 1)}
                              disabled={course.completedHours >= course.hoursNeeded}
                              className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeCourse(course.id)}
                              className="text-gray-400 hover:text-red-600 ml-2"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Weekly Schedule */}
      {activeTab === "schedule" && courses.length > 0 && (
        <div>
          <Schedule 
            allocatedCourses={generateSchedule()} 
            breakTimeRatio={showBreakTime ? BREAK_TIME_RATIO : 0}
            isPomodoroMode={isPomodoroMode}
          />
        </div>
      )}
    </div>
  );
}
