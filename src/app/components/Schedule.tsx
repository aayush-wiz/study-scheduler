"use client";

import { Course } from "./StudyScheduler";

type ScheduleProps = {
  allocatedCourses: (Course & { allocatedHours: number; weightedHours?: number; remainingHours?: number })[];
  breakTimeRatio: number;
  isPomodoroMode: boolean;
};

export default function Schedule({
  allocatedCourses,
  breakTimeRatio,
  isPomodoroMode,
}: ScheduleProps) {
  const totalAllocatedHours = allocatedCourses.reduce(
    (sum, course) => sum + course.allocatedHours,
    0
  );
  const totalHours = totalAllocatedHours / (1 - breakTimeRatio);
  const breakTimeHours = totalHours * breakTimeRatio;
  const effectiveStudyHours = totalHours - breakTimeHours;

  // Calculate daily recommendations (assuming 7 days a week)
  const getDailyRecommendation = (hours: number) => {
    const dailyHours = Math.round((hours / 7) * 10) / 10;
    return dailyHours < 0.1 ? "< 0.1" : dailyHours;
  };

  // Get deadline status
  const getDeadlineStatus = (deadline?: string) => {
    if (!deadline) return null;

    const daysUntil = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    );

    if (daysUntil < 0) return { text: "Overdue", color: "text-red-600" };
    if (daysUntil === 0) return { text: "Due today", color: "text-orange-600" };
    if (daysUntil <= 7)
      return { text: `${daysUntil}d left`, color: "text-yellow-600" };
    return {
      text: `${Math.floor(daysUntil / 7)}w ${daysUntil % 7}d left`,
      color: "text-green-600",
    };
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {isPomodoroMode && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Pomodoro Mode Active</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Schedule optimized for 25-minute focus sessions with 5-minute breaks
          </p>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {allocatedCourses.map((course) => {
          const deadlineStatus = getDeadlineStatus(course.deadline);
          const progressPercentage = Math.round(
            (course.completedHours / course.hoursNeeded) * 100
          );

          return (
            <div key={course.id} className="p-4 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-gray-800 font-medium">{course.name}</h3>
                  <div className="text-sm text-gray-500 mt-1">
                    {course.allocatedHours > 0 ? (
                      <>
                        <span>{course.allocatedHours}h/week • </span>
                        <span>
                          {getDailyRecommendation(course.allocatedHours)}h/day
                        </span>
                      </>
                    ) : (
                      <span className="text-green-600">Completed!</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        course.priority === "High"
                          ? "bg-red-50 text-red-600 border border-red-100"
                          : course.priority === "Medium"
                          ? "bg-amber-50 text-amber-600 border border-amber-100"
                          : "bg-green-50 text-green-600 border border-green-100"
                      }`}
                    >
                      {course.priority}
                    </span>
                  </div>
                  {deadlineStatus && (
                    <div className={`text-xs mt-1 ${deadlineStatus.color}`}>
                      {deadlineStatus.text}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Progress:</span>
                  <span>
                    {progressPercentage}% ({course.completedHours}/
                    {course.hoursNeeded}h)
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-700"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {course.allocatedHours > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Time allocation</span>
                    <span>
                      {Math.round(
                        (course.allocatedHours / effectiveStudyHours) * 100
                      )}
                      % of study time
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-400"
                      style={{
                        width: `${
                          (course.allocatedHours / effectiveStudyHours) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-gray-700">
            <span>Total Weekly Study:</span>
            <span>{Math.round(effectiveStudyHours * 10) / 10} hours</span>
          </div>
          
          {breakTimeRatio > 0 && (
            <>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Study Time:</span>
                <span>
                  {Math.round(effectiveStudyHours * 10) / 10} hours ({Math.round((1 - breakTimeRatio) * 100)}%)
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Break Time:</span>
                <span>
                  {Math.round(breakTimeHours * 10) / 10} hours ({Math.round(breakTimeRatio * 100)}%)
                </span>
              </div>
            </>
          )}

          <div className="flex justify-between text-xs text-gray-500">
            <span>Daily Average:</span>
            <span>{getDailyRecommendation(totalHours)} hours/day</span>
          </div>
        </div>
      </div>
    </div>
  );
}
