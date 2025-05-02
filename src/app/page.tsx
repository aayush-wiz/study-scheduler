"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "./components/Sidebar";
import { useCourses } from "@/components/courses/CourseProvider";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const { courses } = useCourses();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [courseViewType, setCourseViewType] = useState<"list" | "card">("list");

  // Check for profile image when session changes or on mount
  useEffect(() => {
    // Prevent infinite loops by only updating when necessary
    const hasSessionWithoutImage = session?.user && !session.user.image;

    if (session?.user?.image) {
      setProfileImage(session.user.image);
      // Create a user-specific localStorage key
      const storageKey = `userProfileImage_${
        session.user.id || session.user.email
      }`;
      // Also save to localStorage as backup
      localStorage.setItem(storageKey, session.user.image);
    } else if (hasSessionWithoutImage) {
      // Create a user-specific localStorage key
      const storageKey = `userProfileImage_${
        session.user.id || session.user.email
      }`;
      // Check localStorage as a backup
      const savedImage = localStorage.getItem(storageKey);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, [session]); // Remove update from dependencies to prevent infinite loops

  // Remember view preference
  useEffect(() => {
    if (session?.user) {
      const storageKey = `courseViewPreference_${
        session.user.id || session.user.email
      }`;
      const savedPreference = localStorage.getItem(storageKey);
      if (
        savedPreference &&
        (savedPreference === "list" || savedPreference === "card")
      ) {
        setCourseViewType(savedPreference as "list" | "card");
      }
    }
  }, [session]);

  // Save view preference to localStorage
  const handleViewChange = (viewType: "list" | "card") => {
    setCourseViewType(viewType);
    if (session?.user) {
      const storageKey = `courseViewPreference_${
        session.user.id || session.user.email
      }`;
      localStorage.setItem(storageKey, viewType);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/signin" });
  };

  // Handle export schedule function
  const handleExportSchedule = () => {
    // Create a simple text version of the schedule
    let scheduleText = "STUDY SCHEDULE\n\n";

    sortedCourses.forEach((course) => {
      scheduleText += `Course: ${course.name}\n`;
      scheduleText += `Priority: ${course.priority}\n`;
      scheduleText += `Difficulty: ${course.difficulty}\n`;
      scheduleText += `Progress: ${course.completedHours}/${
        course.hoursNeeded
      } hours (${Math.round(
        (course.completedHours / course.hoursNeeded) * 100
      )}%)\n`;
      if (course.deadline) {
        scheduleText += `Deadline: ${new Date(
          course.deadline
        ).toLocaleDateString()}\n`;
      }
      scheduleText += "\n";
    });

    // Create a downloadable file
    const blob = new Blob([scheduleText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "study_schedule.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate stats
  const totalHoursCompleted = courses.reduce(
    (sum, course) => sum + course.completedHours,
    0
  );
  const totalHoursNeeded = courses.reduce(
    (sum, course) => sum + course.hoursNeeded,
    0
  );
  const completionPercentage =
    totalHoursNeeded > 0
      ? Math.round((totalHoursCompleted / totalHoursNeeded) * 100)
      : 0;

  // Sort courses by priority (High > Medium > Low)
  const sortedCourses = [...courses].sort((a, b) => {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return (
      priorityOrder[a.priority as keyof typeof priorityOrder] -
      priorityOrder[b.priority as keyof typeof priorityOrder]
    );
  });

  // Get courses with approaching deadlines (within 7 days)
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const upcomingDeadlines = sortedCourses
    .filter(
      (course) =>
        course.deadline &&
        new Date(course.deadline) <= nextWeek &&
        new Date(course.deadline) >= today
    )
    .sort(
      (a, b) =>
        new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
    );

  return (
    <div className="flex h-screen bg-[#fafafa] text-gray-800 font-sans overflow-hidden">
      <Sidebar
        courses={courses}
        onSidebarToggle={(isOpen) => setIsSidebarOpen(isOpen)}
        onExportSchedule={handleExportSchedule}
      />

      <main
        className={`flex-1 overflow-auto transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Navbar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-normal text-gray-800">
                Study Scheduler
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/add-course"
                className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
              >
                Add Course
              </Link>
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="focus:outline-none"
                  aria-label="User menu"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={session?.user?.name || "User"}
                        className="w-full h-full object-cover"
                        key={profileImage}
                        onError={(e) => {
                          console.error(
                            "Failed to load profile image in header"
                          );
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes("?v=")) {
                            target.src = `${profileImage}?v=${new Date().getTime()}`;
                          }
                        }}
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="px-4 py-3 text-sm text-gray-900 border-b border-gray-100">
                      <div className="font-medium">
                        {session?.user?.name || "User"}
                      </div>
                      <div className="text-gray-500 truncate">
                        {session?.user?.email}
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Overview Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Progress Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
              <h2 className="text-sm uppercase text-gray-500 font-medium mb-4">
                Progress
              </h2>
              <div className="text-4xl font-light mb-2">
                {completionPercentage}%
              </div>
              <div className="h-2 bg-gray-100 rounded-full mb-4">
                <div
                  className="h-full bg-gray-700 rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-500 mt-auto">
                {totalHoursCompleted} of {totalHoursNeeded} hours completed
              </div>
            </div>

            {/* Course Count */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
              <h2 className="text-sm uppercase text-gray-500 font-medium mb-4">
                Courses
              </h2>
              <div className="text-4xl font-light mb-2">{courses.length}</div>
              <div className="text-sm text-gray-500">
                {courses.filter((c) => c.priority === "High").length} high
                priority
              </div>
              <div className="text-sm text-gray-500 mt-auto">
                {upcomingDeadlines.length} with deadlines this week
              </div>
            </div>

            {/* Time Allocation */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
              <h2 className="text-sm uppercase text-gray-500 font-medium mb-4">
                Study Time
              </h2>
              <div className="text-4xl font-light mb-2">
                {totalHoursNeeded - totalHoursCompleted}
              </div>
              <div className="text-sm text-gray-500">hours remaining</div>
              <Link
                href="/progress"
                className="text-gray-700 hover:text-gray-900 inline-flex items-center mt-auto text-sm"
              >
                Log study time
              </Link>
            </div>
          </div>

          {/* Upcoming Deadlines Section */}
          {upcomingDeadlines.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Upcoming Deadlines
              </h2>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {upcomingDeadlines.map((course) => {
                    const daysLeft = Math.ceil(
                      (new Date(course.deadline!).getTime() - today.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    return (
                      <li
                        key={course.id}
                        className="p-4 flex justify-between items-center"
                      >
                        <div>
                          <h3 className="text-base font-medium">
                            {course.name}
                          </h3>
                          <div className="flex items-center mt-1">
                            <span
                              className={`inline-block w-2 h-2 rounded-full mr-1 ${
                                daysLeft <= 1
                                  ? "bg-gray-800"
                                  : daysLeft <= 3
                                  ? "bg-gray-600"
                                  : "bg-gray-400"
                              }`}
                            ></span>
                            <span className="text-sm text-gray-500">
                              {daysLeft === 0
                                ? "Due today"
                                : daysLeft === 1
                                ? "Due tomorrow"
                                : `Due in ${daysLeft} days`}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-4 text-right">
                            <div className="text-sm font-medium">
                              {Math.round(
                                (course.completedHours / course.hoursNeeded) *
                                  100
                              )}
                              %
                            </div>
                            <div className="text-xs text-gray-500">
                              {course.completedHours}/{course.hoursNeeded}h
                            </div>
                          </div>
                          <Link
                            href="/progress"
                            className="p-2 text-gray-400 hover:text-gray-700"
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
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {/* Course List */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-800">My Courses</h2>
              <div className="flex items-center">
                {/* View toggle buttons */}
                <div className="flex mr-4 border border-gray-200 rounded-md overflow-hidden">
                  <button
                    onClick={() => handleViewChange("list")}
                    className={`px-3 py-1 text-sm ${
                      courseViewType === "list"
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                    aria-label="List view"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleViewChange("card")}
                    className={`px-3 py-1 text-sm ${
                      courseViewType === "card"
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                    aria-label="Card view"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                </div>
                <Link
                  href="/courses"
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  View all courses
                </Link>
              </div>
            </div>

            {courses.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500 mb-4">
                  You haven&apos;t added any courses yet.
                </p>
                <Link
                  href="/add-course"
                  className="inline-block bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
                >
                  Add Your First Course
                </Link>
              </div>
            ) : courseViewType === "list" ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {sortedCourses.slice(0, 5).map((course) => (
                    <li
                      key={course.id}
                      className="p-4 flex items-center hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-base font-medium">
                            {course.name}
                          </h3>
                          <span
                            className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                              course.priority === "High"
                                ? "bg-gray-200 text-gray-800"
                                : course.priority === "Medium"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-gray-50 text-gray-600"
                            }`}
                          >
                            {course.priority}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {course.difficulty} •{" "}
                          {course.deadline
                            ? new Date(course.deadline).toLocaleDateString()
                            : "No deadline"}
                        </div>
                      </div>
                      <div className="ml-4 w-32">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>
                            {Math.round(
                              (course.completedHours / course.hoursNeeded) * 100
                            )}
                            %
                          </span>
                          <span>
                            {course.completedHours}/{course.hoursNeeded}h
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              course.priority === "High"
                                ? "bg-gray-800"
                                : course.priority === "Medium"
                                ? "bg-gray-600"
                                : "bg-gray-400"
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                (course.completedHours / course.hoursNeeded) *
                                  100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                      <Link
                        href="/progress"
                        className="ml-4 p-2 text-gray-400 hover:text-gray-700"
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
                    </li>
                  ))}
                </ul>
                {courses.length > 5 && (
                  <div className="bg-gray-50 py-3 px-4 border-t border-gray-200">
                    <Link
                      href="/courses"
                      className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center"
                    >
                      Show {courses.length - 5} more courses
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              // Card view
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCourses.slice(0, 6).map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-base font-medium text-gray-800 mb-1">
                          {course.name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            course.priority === "High"
                              ? "bg-gray-200 text-gray-800"
                              : course.priority === "Medium"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {course.priority}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mb-4">
                        {course.difficulty} •{" "}
                        {course.deadline
                          ? new Date(course.deadline).toLocaleDateString()
                          : "No deadline"}
                      </p>

                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>
                            {course.completedHours}/{course.hoursNeeded}h
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              course.priority === "High"
                                ? "bg-gray-800"
                                : course.priority === "Medium"
                                ? "bg-gray-600"
                                : "bg-gray-400"
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                (course.completedHours / course.hoursNeeded) *
                                  100
                              )}%`,
                            }}
                          />
                        </div>
                        <div className="text-center mt-2 text-sm font-medium">
                          {Math.round(
                            (course.completedHours / course.hoursNeeded) * 100
                          )}
                          % Complete
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-end">
                      <Link
                        href="/progress"
                        className="text-sm text-gray-700 hover:text-gray-900 flex items-center"
                      >
                        Log Progress
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {courseViewType === "card" && courses.length > 6 && (
              <div className="text-center mt-6">
                <Link
                  href="/courses"
                  className="inline-block text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center"
                >
                  Show {courses.length - 6} more courses
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
