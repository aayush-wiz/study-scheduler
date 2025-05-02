"use client";

import { Course } from "@/types/course";

type AllocatedCourse = Course & {
  allocatedHours: number;
  weightedHours: number;
  remainingHours: number;
};

type ScheduleProps = {
  allocatedCourses: AllocatedCourse[];
  breakTimeRatio: number;
  isPomodoroMode: boolean;
};

export default function Schedule({
  allocatedCourses,
  breakTimeRatio,
  isPomodoroMode,
}: ScheduleProps) {
  // Calculate total allocated study hours
  const totalAllocatedHours = allocatedCourses.reduce(
    (sum, course) => sum + course.allocatedHours,
    0
  );

  // Calculate break time hours
  const breakTimeHours = totalAllocatedHours * breakTimeRatio;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">Weekly Study Schedule</h3>
        <p className="text-sm text-gray-500">
          {isPomodoroMode
            ? "Using Pomodoro technique (25 min study + 5 min break)"
            : "Recommended allocation of your available study time"}
        </p>
      </div>

      {allocatedCourses.length === 0 ? (
        <p className="text-center py-6 text-gray-500">No courses to schedule</p>
      ) : (
        <div className="space-y-4">
          {allocatedCourses.map((course) => (
            <div key={course.id} className="flex items-center">
              <div className="w-full">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{course.name}</span>
                  <span className="text-sm text-gray-500">
                    {course.allocatedHours} hours
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${(course.allocatedHours / totalAllocatedHours) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}

          {breakTimeRatio > 0 && (
            <div className="flex items-center mt-6 pt-4 border-t border-gray-200">
              <div className="w-full">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Break Time</span>
                  <span className="text-sm text-gray-500">
                    {breakTimeHours.toFixed(1)} hours
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${breakTimeRatio * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 