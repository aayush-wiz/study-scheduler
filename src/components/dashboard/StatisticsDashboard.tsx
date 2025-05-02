"use client";

import { useState, useEffect } from "react";
import { Course } from "@/types/course";

// Mock study session data for the charts
const mockStudySessions = [
  // Last 7 days of study (hours)
  { date: "2023-05-01", hours: 2.5 },
  { date: "2023-05-02", hours: 1.0 },
  { date: "2023-05-03", hours: 3.0 },
  { date: "2023-05-04", hours: 2.0 },
  { date: "2023-05-05", hours: 1.5 },
  { date: "2023-05-06", hours: 4.0 },
  { date: "2023-05-07", hours: 1.0 },
];

// Mock productivity data by time of day
const productivityByTime = [
  { time: "Morning", productivity: 85 },
  { time: "Afternoon", productivity: 65 },
  { time: "Evening", productivity: 75 },
  { time: "Night", productivity: 45 },
];

// Mock course progress data
const courseProgress = [
  { course: "Calculus II", completed: 42 },
  { course: "Physics 101", completed: 22 },
  { course: "Data Structures", completed: 57 },
  { course: "History of Art", completed: 12 },
];

type StatisticsDashboardProps = {
  courses: Course[];
};

export default function StatisticsDashboard({
  courses,
}: StatisticsDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "courses" | "insights"
  >("overview");
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [averageDailyTime, setAverageDailyTime] = useState(0);
  const [mostProductiveTime, setMostProductiveTime] = useState("");

  useEffect(() => {
    // Calculate statistics based on mock data and courses
    const total = mockStudySessions.reduce(
      (sum, session) => sum + session.hours,
      0
    );
    setTotalStudyTime(total);
    setAverageDailyTime(total / mockStudySessions.length);

    // Find most productive time
    const mostProductiveTimeObj = productivityByTime.reduce((prev, current) =>
      prev.productivity > current.productivity ? prev : current
    );
    setMostProductiveTime(mostProductiveTimeObj.time);
  }, [courses]);

  // Calculate study streak
  const calculateStreak = () => {
    // In a real app, this would analyze actual study logs
    return 5; // Mock value
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-3 text-sm font-medium flex-1 text-center ${
            activeTab === "overview"
              ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-3 text-sm font-medium flex-1 text-center ${
            activeTab === "courses"
              ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Course Analytics
        </button>
        <button
          onClick={() => setActiveTab("insights")}
          className={`px-4 py-3 text-sm font-medium flex-1 text-center ${
            activeTab === "insights"
              ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Insights
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Total Study Time */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600 dark:text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Total Study Time
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {totalStudyTime.toFixed(1)} hours
                    </h4>
                  </div>
                </div>
              </div>

              {/* Avg. Daily Study */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-600 dark:text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Avg. Daily Study
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {averageDailyTime.toFixed(1)} hours
                    </h4>
                  </div>
                </div>
              </div>

              {/* Study Streak */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600 dark:text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Current Streak
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {calculateStreak()} days
                    </h4>
                  </div>
                </div>
              </div>

              {/* Most Productive Time */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-amber-600 dark:text-amber-400"
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
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Most Productive
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {mostProductiveTime}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Daily Study Hours */}
              <div className="bg-white dark:bg-gray-750 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Daily Study Hours
                </h3>
                <div className="h-64 flex items-end space-x-2">
                  {mockStudySessions.map((session, index) => {
                    const height = (session.hours / 5) * 100; // 5 is the max expected hours
                    const day = new Date(session.date).toLocaleDateString(
                      "en-US",
                      { weekday: "short" }
                    );

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div
                          className="w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-t-sm relative"
                          style={{ height: `${height}%` }}
                        >
                          <div
                            className="absolute inset-x-0 bottom-0 bg-indigo-500 dark:bg-indigo-400 rounded-t-sm"
                            style={{ height: `${height}%` }}
                          ></div>
                        </div>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">
                          {day}
                        </div>
                        <div className="text-xs text-gray-900 dark:text-white mt-1">
                          {session.hours}h
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Productivity by Time of Day */}
              <div className="bg-white dark:bg-gray-750 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Productivity by Time of Day
                </h3>
                <div className="h-64 flex items-end space-x-2">
                  {productivityByTime.map((timeSlot, index) => {
                    const height = (timeSlot.productivity / 100) * 100;

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div
                          className="w-full bg-purple-100 dark:bg-purple-900/30 rounded-t-sm relative"
                          style={{ height: `${height}%` }}
                        >
                          <div
                            className="absolute inset-x-0 bottom-0 rounded-t-sm"
                            style={{
                              height: `${height}%`,
                              backgroundColor:
                                timeSlot.time === mostProductiveTime
                                  ? "#8B5CF6"
                                  : "#A78BFA",
                              opacity:
                                timeSlot.time === mostProductiveTime ? 1 : 0.7,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">
                          {timeSlot.time}
                        </div>
                        <div className="text-xs text-gray-900 dark:text-white mt-1">
                          {timeSlot.productivity}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Most Studied Courses */}
            <div className="bg-white dark:bg-gray-750 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Course Study Distribution
              </h3>
              <div className="space-y-4">
                {courseProgress.map((course, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {course.course}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {course.completed}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${course.completed}%`,
                          backgroundColor:
                            index === 0
                              ? "#6366F1"
                              : index === 1
                              ? "#8B5CF6"
                              : index === 2
                              ? "#EC4899"
                              : "#F59E0B",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Course Performance Analytics
            </h3>

            <div className="space-y-6">
              {courses.map((course, index) => {
                const progress = Math.round(
                  (course.completedHours / course.hoursNeeded) * 100
                );
                const daysLeft = course.deadline
                  ? Math.max(
                      0,
                      Math.ceil(
                        (new Date(course.deadline).getTime() - Date.now()) /
                          (1000 * 60 * 60 * 24)
                      )
                    )
                  : 0;
                const hoursLeft = course.hoursNeeded - course.completedHours;
                const dailyHoursNeeded =
                  daysLeft > 0 ? (hoursLeft / daysLeft).toFixed(1) : 0;

                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-750 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {course.name}
                        </h4>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          course.priority === "High"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            : course.priority === "Medium"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {course.priority} Priority
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Progress
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{
                            width: `${progress}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Study Hours
                        </p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {course.completedHours}/{course.hoursNeeded}h
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Days Left
                        </p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {daysLeft}
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Daily Goal
                        </p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {dailyHoursNeeded}h
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {daysLeft === 0 ? (
                        <p>This course has reached its deadline.</p>
                      ) : (
                        <p>
                          You need to study{" "}
                          <span className="font-medium">
                            {dailyHoursNeeded} hours
                          </span>{" "}
                          daily to complete this course by the deadline.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "insights" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Study Insights
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Productivity Insights */}
              <div className="bg-white dark:bg-gray-750 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Productivity Insights
                </h4>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-600 dark:text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        Morning Focus
                      </h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Your productivity is highest in the morning. Consider
                        scheduling challenging tasks during this time.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-600 dark:text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        Night Productivity Drop
                      </h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Your productivity decreases significantly at night.
                        Avoid studying after 10 PM when possible.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        Optimal Session Length
                      </h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Your most productive study sessions last between 45-60
                        minutes. Consider using this timeframe for focused work.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject Insights */}
              <div className="bg-white dark:bg-gray-750 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Subject Insights
                </h4>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-purple-600 dark:text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        Physics Needs Attention
                      </h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        You&apos;re falling behind in Physics 101. Consider
                        allocating more time to this subject.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-600 dark:text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        Data Structures Progress
                      </h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        You&apos;re making excellent progress in Data
                        Structures. Keep up the good work!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-amber-600 dark:text-amber-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        History of Art Deadline
                      </h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        You&apos;ve barely started this course and the deadline
                        is 30 days away. Begin studying soon.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg p-5 shadow-sm text-white">
                <h4 className="font-semibold mb-4">Improvement Suggestions</h4>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span className="text-sm opacity-90">
                      <strong>Create a study routine:</strong> Your consistency
                      has improved, but establishing a fixed study schedule
                      could further enhance your productivity.
                    </span>
                  </div>

                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span className="text-sm opacity-90">
                      <strong>Balance your subjects:</strong> You&apos;re
                      focusing heavily on Data Structures while neglecting
                      Physics. Try to distribute your time more evenly.
                    </span>
                  </div>

                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span className="text-sm opacity-90">
                      <strong>Utilize your productive hours:</strong> Schedule
                      more study sessions in the morning when your focus is at
                      its peak.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
