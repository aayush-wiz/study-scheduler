"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Course } from "./StudyScheduler";

type SidebarProps = {
  courses: Course[];
  onExportSchedule: () => void;
  onTogglePomodoro: () => void;
  onSidebarToggle?: (isOpen: boolean) => void;
};

export default function Sidebar({
  courses,
  onExportSchedule,
  onTogglePomodoro,
  onSidebarToggle,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Handle responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Notify parent component when sidebar state changes
  useEffect(() => {
    if (onSidebarToggle) {
      onSidebarToggle(isOpen);
    }
  }, [isOpen, onSidebarToggle]);

  // Calculate study statistics
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

  const upcomingDeadlines = courses
    .filter((course) => course.deadline)
    .sort(
      (a, b) =>
        new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
    )
    .slice(0, 3);

  const highPriorityCourses = courses.filter(
    (course) => course.priority === "High"
  );

  // Timer functions
  const startTimer = (minutes: number) => {
    if (activeTimer) {
      clearInterval(activeTimer);
    }
    const seconds = minutes * 60;
    setTimeLeft(seconds);
    const timerId = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          setActiveTimer(null);
          // Play notification sound
          const audio = new Audio("/notification.mp3");
          audio.play();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setActiveTimer(timerId);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50 
          ${isOpen ? "w-64" : "w-14"} 
          ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-6 bg-white border border-gray-200 text-gray-400 p-1.5 rounded-full shadow-sm z-10 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-3 w-3 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* App Title */}
        <div className={`flex items-center h-14 px-4 border-b border-gray-200 ${!isOpen && "justify-center"}`}>
          {isOpen ? (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h1 className="text-sm font-medium text-gray-800">Academic Planner</h1>
            </div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          )}
        </div>

        {/* Sidebar Content */}
        <div className={`h-[calc(100%-3.5rem)] overflow-y-auto ${!isOpen && "hidden"}`}>
          <div className="flex flex-col h-full">
            {/* Main Navigation */}
            <div className="flex-1 p-4">
              {/* Quick Actions Section */}
              <div className="mb-6">
                <h3 className="text-xs uppercase text-gray-400 font-medium tracking-wide mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => startTimer(25)}
                    className="flex items-center w-full gap-2 p-2 text-xs text-left text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    New Study Session
                  </button>
                  <Link
                    href="/progress"
                    className="flex items-center gap-2 p-2 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Track Progress
                  </Link>
                  <button
                    onClick={onExportSchedule}
                    className="flex items-center gap-2 w-full p-2 text-xs text-left text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                    </svg>
                    Export Schedule
                  </button>
                </div>
              </div>

              {/* Focus Timer */}
              {activeTimer && (
                <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-light text-gray-800 mb-1">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">Focus Timer</div>
                    <button
                      onClick={() => {
                        clearInterval(activeTimer);
                        setActiveTimer(null);
                      }}
                      className="text-xs text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel Timer
                    </button>
                  </div>
                </div>
              )}

              {/* Course Categories */}
              <div className="mb-6">
                <h3 className="text-xs uppercase text-gray-400 font-medium tracking-wide mb-3">
                  Course Status
                </h3>
                
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span className="text-xs text-gray-600">All Courses</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{courses.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs text-gray-600">High Priority</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{highPriorityCourses.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs text-gray-600">Upcoming Deadlines</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{upcomingDeadlines.length}</span>
                  </div>
                </div>
              </div>

              {/* Overall Progress */}
              <div className="mb-6">
                <h3 className="text-xs uppercase text-gray-400 font-medium tracking-wide mb-3">
                  Progress Overview
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-600">Overall Progress</span>
                    <span className="text-xs text-gray-500">
                      {totalHoursCompleted}/{totalHoursNeeded}h
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-700 transition-all duration-300"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* High Priority Courses */}
              {highPriorityCourses.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs uppercase text-gray-400 font-medium tracking-wide mb-3 flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                    High Priority
                  </h3>
                  <div className="space-y-2">
                    {highPriorityCourses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
                      >
                        <div className="text-sm font-medium text-gray-800">{course.name}</div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{course.completedHours}/{course.hoursNeeded}h</span>
                          {course.deadline && (
                            <span>Due: {new Date(course.deadline).toLocaleDateString()}</span>
                          )}
                        </div>
                        <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-400 transition-all duration-300"
                            style={{
                              width: `${(course.completedHours / course.hoursNeeded) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Deadlines */}
              {upcomingDeadlines.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs uppercase text-gray-400 font-medium tracking-wide mb-3 flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></span>
                    Upcoming Deadlines
                  </h3>
                  <div className="space-y-2">
                    {upcomingDeadlines.map((course) => (
                      <div
                        key={course.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
                      >
                        <div className="text-sm font-medium text-gray-800">{course.name}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          Due: {new Date(course.deadline!).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Settings */}
            <div className="p-4 space-y-2 border-t border-gray-200">
              <button
                onClick={onTogglePomodoro}
                className="flex items-center gap-2 w-full p-2 text-xs text-left text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Toggle Pomodoro Mode
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
