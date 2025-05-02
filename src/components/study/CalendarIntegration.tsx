"use client";

import { useState } from "react";
import { Course } from "@/types";

type CalendarIntegrationProps = {
  courses: Course[];
  onClose: () => void;
};

export default function CalendarIntegration({
  courses,
  onClose,
}: CalendarIntegrationProps) {
  const [selectedCalendar, setSelectedCalendar] = useState<string>("google");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (selectedCalendar === "google") {
        const calendarEvents = courses.map((course) => ({
          title: `Study: ${course.name}`,
          description: `Study session for ${course.name}`,
          // Create study sessions based on deadline
          startTime: course.deadline
            ? new Date(
                new Date(course.deadline).getTime() - 7 * 24 * 60 * 60 * 1000
              )
            : new Date(),
          endTime: course.deadline
            ? new Date(
                new Date(course.deadline).getTime() -
                  7 * 24 * 60 * 60 * 1000 +
                  2 * 60 * 60 * 1000
              )
            : new Date(Date.now() + 2 * 60 * 60 * 1000),
        }));

        // In a real implementation, this would call the Google Calendar API
        console.log("Exporting to Google Calendar:", calendarEvents);
      } else if (selectedCalendar === "apple") {
        // Logic for Apple Calendar
        console.log("Exporting to Apple Calendar");
      } else if (selectedCalendar === "outlook") {
        // Logic for Outlook
        console.log("Exporting to Outlook");
      }

      setSuccess(true);
    } catch (err) {
      setError("Failed to export calendar events. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Calendar Integration
        </h2>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Successfully Exported!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your study schedule has been exported to your calendar.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Calendar Service
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setSelectedCalendar("google")}
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all ${
                    selectedCalendar === "google"
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[#4285F4]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12.545 10.239v3.821h5.445c-0.231 1.437-1.585 4.207-5.445 4.207-3.279 0-5.953-2.71-5.953-6.060s2.674-6.060 5.953-6.060c1.865 0 3.112 0.792 3.825 1.476l2.619-2.503c-1.665-1.549-3.819-2.480-6.444-2.480-5.329 0-9.653 4.307-9.653 9.567s4.324 9.567 9.653 9.567c5.572 0 9.260-3.909 9.260-9.403 0-0.617-0.066-1.126-0.165-1.631h-9.094z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Google</span>
                </button>

                <button
                  onClick={() => setSelectedCalendar("apple")}
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all ${
                    selectedCalendar === "apple"
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-900 dark:text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Apple</span>
                </button>

                <button
                  onClick={() => setSelectedCalendar("outlook")}
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all ${
                    selectedCalendar === "outlook"
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[#0078D4]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22.65 5.65v12.7H14V24l-9.65-5.35V5.35L14 0v5.65h8.65zm-1.925 1.925H14V12h6.725v-4.425zm0 6.35H14v4.425h6.725V13.925zM12.075 3.9L6.85 6.775v10.45l5.225 2.875V3.9z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Outlook</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isLoading}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-lg ${
                  isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-indigo-700"
                } transition-colors flex items-center space-x-2`}
              >
                {isLoading && (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                <span>{isLoading ? "Exporting..." : "Export to Calendar"}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
