"use client";

import { useState, useEffect } from "react";
import { Course } from "@/types";

type Recommendation = {
  id: string;
  courseId: string;
  courseName: string;
  courseColor: string;
  recommendedHours: number;
  dayOfWeek: string;
  timeOfDay: string;
  reason: string;
};

type SmartRecommendationsProps = {
  courses: Course[];
};

export default function SmartRecommendations({
  courses,
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [weeklyPlan, setWeeklyPlan] = useState<{
    [key: string]: Recommendation[];
    Monday: Recommendation[];
    Tuesday: Recommendation[];
    Wednesday: Recommendation[];
    Thursday: Recommendation[];
    Friday: Recommendation[];
    Saturday: Recommendation[];
    Sunday: Recommendation[];
  }>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  // Generate smart recommendations based on course data
  useEffect(() => {
    // Simulate API call or algorithm processing
    const generateRecommendations = () => {
      setLoading(true);

      // In a real app, this would be a complex algorithm considering:
      // - Course priorities
      // - Deadlines
      // - Current progress
      // - Past study habits
      // - Cognitive science research on optimal learning times

      setTimeout(() => {
        const newRecommendations: Recommendation[] = [];

        // For each course, generate recommendations
        courses.forEach((course) => {
          // Determine how behind or ahead of schedule the student is
          const expectedProgress = calculateExpectedProgress(course);
          const actualProgress =
            (course.completedHours / course.hoursNeeded) * 100;
          const progressDifference = expectedProgress - actualProgress;

          // Calculate days until deadline
          const daysUntilDeadline = course.deadline
            ? Math.ceil(
                (new Date(course.deadline).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              )
            : 30; // Default to 30 days if no deadline

          // Calculate recommended daily study hours based on remaining work and time
          const remainingHours = course.hoursNeeded - course.completedHours;
          let recommendedHoursPerWeek = Math.ceil(
            remainingHours / (daysUntilDeadline / 7)
          );

          // Adjust based on priority
          if (course.priority === "High") {
            recommendedHoursPerWeek = Math.ceil(recommendedHoursPerWeek * 1.2);
          } else if (course.priority === "Low") {
            recommendedHoursPerWeek = Math.ceil(recommendedHoursPerWeek * 0.8);
          }

          // Determine optimal study days
          const studyDays = determineOptimalStudyDays(
            course,
            daysUntilDeadline
          );

          // Generate recommendations for each study day
          studyDays.forEach((day) => {
            const hoursForDay = Math.ceil(
              recommendedHoursPerWeek / studyDays.length
            );
            const timeOfDay = determineOptimalTimeOfDay(course, day);

            let reason = "";
            if (progressDifference > 15) {
              reason = `You're ${Math.round(
                progressDifference
              )}% behind the expected progress for this course.`;
            } else if (daysUntilDeadline < 14) {
              reason = `Only ${daysUntilDeadline} days left until the deadline.`;
            } else if (course.priority === "High") {
              reason =
                "This is a high priority course that needs consistent focus.";
            } else {
              reason = "Regular study sessions will help maintain progress.";
            }

            newRecommendations.push({
              id: `${course.id}-${day}-${Date.now()}`,
              courseId: course.id,
              courseName: course.name,
              courseColor: "#6366F1", // Default indigo color
              recommendedHours: hoursForDay,
              dayOfWeek: day,
              timeOfDay,
              reason,
            });
          });
        });

        // Organize recommendations by day of week
        const weekPlan = {
          Monday: [] as Recommendation[],
          Tuesday: [] as Recommendation[],
          Wednesday: [] as Recommendation[],
          Thursday: [] as Recommendation[],
          Friday: [] as Recommendation[],
          Saturday: [] as Recommendation[],
          Sunday: [] as Recommendation[],
        };

        newRecommendations.forEach((rec) => {
          if (rec.dayOfWeek in weekPlan) {
            weekPlan[rec.dayOfWeek as keyof typeof weekPlan].push(rec);
          }
        });

        setRecommendations(newRecommendations);
        setWeeklyPlan(weekPlan);
        setLoading(false);
      }, 1500); // Simulate loading time
    };

    if (courses.length > 0) {
      generateRecommendations();
    } else {
      setLoading(false);
    }
  }, [courses]);

  // Helper functions for the recommendation algorithm
  const calculateExpectedProgress = (course: Course): number => {
    if (!course.deadline) return 50; // Default expected progress

    const totalDays = Math.ceil(
      (new Date(course.deadline).getTime() -
        Date.now() -
        30 * 24 * 60 * 60 * 1000) /
        (1000 * 60 * 60 * 24)
    );
    const daysElapsed = 30; // Assuming course started 30 days ago

    if (totalDays <= 0) return 100;
    return Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
  };

  const determineOptimalStudyDays = (
    course: Course,
    daysUntilDeadline: number
  ): string[] => {
    const weekdays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    // For courses with close deadlines, recommend more frequent study
    if (daysUntilDeadline < 7) {
      return weekdays.slice(0, 5); // Study 5 days a week
    } else if (daysUntilDeadline < 14 || course.priority === "High") {
      return [weekdays[1], weekdays[3], weekdays[5]]; // Tuesday, Thursday, Saturday
    } else {
      return [weekdays[1], weekdays[4]]; // Tuesday, Friday
    }
  };

  const determineOptimalTimeOfDay = (course: Course, day: string): string => {
    // In a real app, this would consider user preferences and availability
    const weekend = ["Saturday", "Sunday"];

    if (weekend.includes(day)) {
      return "Morning (9:00 AM - 12:00 PM)"; // Weekend mornings
    } else {
      // Weekdays - alternate between evening and afternoon
      return day === "Monday" || day === "Wednesday" || day === "Friday"
        ? "Evening (6:00 PM - 9:00 PM)"
        : "Afternoon (2:00 PM - 5:00 PM)";
    }
  };

  // Determine the current day for highlighting in the UI
  const getCurrentDay = (): string => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[new Date().getDay()];
  };

  const currentDay = getCurrentDay();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Smart Study Recommendations
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Personalized study plan based on your course priorities, deadlines,
          and progress.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Analyzing your courses and generating smart recommendations...
          </p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Recommendations Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Add more courses or update your course information to receive
            personalized study recommendations.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-750">
              <tr>
                {Object.keys(weeklyPlan).map((day) => (
                  <th
                    key={day}
                    className={`py-4 px-4 text-sm font-medium ${
                      day === currentDay
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.entries(weeklyPlan).map(([day, dayRecommendations]) => (
                  <td
                    key={day}
                    className={`p-2 align-top border-t border-gray-200 dark:border-gray-700 ${
                      day === currentDay
                        ? "bg-indigo-50/50 dark:bg-indigo-900/10"
                        : ""
                    }`}
                  >
                    {dayRecommendations.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No study sessions
                      </div>
                    ) : (
                      <div className="space-y-3 p-2">
                        {dayRecommendations.map((rec) => (
                          <div
                            key={rec.id}
                            className="bg-white dark:bg-gray-750 rounded-lg shadow p-3 border-l-4"
                            style={{ borderLeftColor: rec.courseColor }}
                          >
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {rec.courseName}
                            </h4>
                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center mb-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1.5 text-gray-400"
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
                                {rec.timeOfDay}
                              </div>
                              <div className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1.5 text-gray-400"
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
                                {rec.recommendedHours}{" "}
                                {rec.recommendedHours === 1 ? "hour" : "hours"}
                              </div>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                              {rec.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-500 mr-2"
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
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Recommendations are dynamically adjusted based on your progress and
            deadlines.
          </span>
        </div>
      </div>
    </div>
  );
}
