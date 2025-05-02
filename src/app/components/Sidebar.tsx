"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Course } from "./StudyScheduler";

type SidebarProps = {
  courses: Course[];
  onExportSchedule: () => void;
  onTogglePomodoro?: () => void;
  onSidebarToggle?: (isOpen: boolean) => void;
};

export default function Sidebar({
  courses,
  onExportSchedule,
  onSidebarToggle,
}: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Notify parent component when sidebar state changes
  useEffect(() => {
    if (onSidebarToggle) {
      onSidebarToggle(isHovering);
    }
  }, [isHovering, onSidebarToggle]);

  // Handle hover effects with debounce to prevent flickering
  const handleMouseEnter = () => {
    if (!isMobile) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      // Add a delay to prevent flickering when mouse briefly leaves sidebar
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovering(false);
      }, 150);
    }
  };

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

  const highPriorityCount = courses.filter(
    (course) => course.priority === "High"
  ).length;

  const upcomingDeadlinesCount = courses.filter(
    (course) => course.deadline && new Date(course.deadline) > new Date()
  ).length;

  return (
    <>
      {/* Overlay for mobile */}
      {isHovering && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 transition-opacity duration-300"
          onClick={() => setIsHovering(false)}
        />
      )}
      
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out
          ${isHovering ? "w-64" : "w-20"} 
          ${isMobile && !isHovering ? "-translate-x-full" : "translate-x-0"}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* App Title */}
        <div className={`flex items-center h-14 px-4 border-b border-gray-200 transition-all duration-300 ${!isHovering && "justify-center"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`${isHovering ? 'h-6 w-6' : 'h-10 w-10'} text-gray-400 flex-shrink-0 transition-all duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <div className={`ml-2 overflow-hidden transition-all duration-300 ease-in-out ${isHovering ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`}>
            <h1 className="text-sm font-medium text-gray-800 whitespace-nowrap">Study Scheduler</h1>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
          <div className="flex flex-col h-full">
            {/* Main Navigation */}
            <div className="flex-1 p-4">
              {/* Menu Section */}
              <div className="mb-6">
                <div className={`mb-3 overflow-hidden transition-all duration-300 ease-in-out ${isHovering ? 'opacity-100 max-h-6' : 'opacity-0 max-h-0'}`}>
                  <h3 className="text-xs uppercase text-gray-400 font-medium tracking-wide">
                    Menu
                  </h3>
                </div>
                <div className="space-y-3">
                  {/* Dashboard */}
                  <Link
                    href="/"
                    className={`flex items-center ${!isHovering ? 'justify-center' : ''} p-2 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors relative`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${isHovering ? 'h-4 w-4' : 'h-9 w-9'} text-gray-500 transition-all duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <div className={`ml-2 overflow-hidden transition-all duration-300 ease-in-out ${isHovering ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`}>
                      <span className="whitespace-nowrap">Dashboard</span>
                    </div>
                  </Link>
                  
                  {/* All Courses */}
                  <Link
                    href="/courses"
                    className={`flex items-center ${!isHovering ? 'justify-center' : ''} p-2 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors relative`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${isHovering ? 'h-4 w-4' : 'h-9 w-9'} text-gray-500 transition-all duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <div className={`ml-2 overflow-hidden transition-all duration-300 ease-in-out ${isHovering ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`}>
                      <span className="whitespace-nowrap">All Courses</span>
                    </div>
                  </Link>
                  
                  {/* Track Progress */}
                  <Link
                    href="/progress"
                    className={`flex items-center ${!isHovering ? 'justify-center' : ''} p-2 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors relative`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${isHovering ? 'h-4 w-4' : 'h-9 w-9'} text-gray-500 transition-all duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <div className={`ml-2 overflow-hidden transition-all duration-300 ease-in-out ${isHovering ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`}>
                      <span className="whitespace-nowrap">Track Progress</span>
                    </div>
                  </Link>
                  
                  {/* High Priority */}
                  <Link
                    href="/priorities"
                    className={`flex items-center ${!isHovering ? 'justify-center' : ''} p-2 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors relative`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${isHovering ? 'h-4 w-4' : 'h-9 w-9'} text-gray-500 transition-all duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className={`ml-2 overflow-hidden transition-all duration-300 ease-in-out ${isHovering ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`}>
                      <span className="whitespace-nowrap">High Priority ({highPriorityCount})</span>
                    </div>
                    {!isHovering && highPriorityCount > 0 && (
                      <span className="absolute top-0 right-0 bg-gray-200 text-gray-800 rounded-full text-xs w-4 h-4 flex items-center justify-center translate-x-1/3 -translate-y-1/3">
                        {highPriorityCount}
                      </span>
                    )}
                  </Link>
                  
                  {/* Deadlines */}
                  <Link
                    href="/deadlines"
                    className={`flex items-center ${!isHovering ? 'justify-center' : ''} p-2 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors relative`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${isHovering ? 'h-4 w-4' : 'h-9 w-9'} text-gray-500 transition-all duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className={`ml-2 overflow-hidden transition-all duration-300 ease-in-out ${isHovering ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`}>
                      <span className="whitespace-nowrap">Deadlines ({upcomingDeadlinesCount})</span>
                    </div>
                    {!isHovering && upcomingDeadlinesCount > 0 && (
                      <span className="absolute top-0 right-0 bg-gray-200 text-gray-800 rounded-full text-xs w-4 h-4 flex items-center justify-center translate-x-1/3 -translate-y-1/3">
                        {upcomingDeadlinesCount}
                      </span>
                    )}
                  </Link>
                  
                  {/* Add Course */}
                  <Link
                    href="/add-course"
                    className={`flex items-center ${!isHovering ? 'justify-center' : ''} p-2 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors relative`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${isHovering ? 'h-4 w-4' : 'h-9 w-9'} text-gray-500 transition-all duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <div className={`ml-2 overflow-hidden transition-all duration-300 ease-in-out ${isHovering ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`}>
                      <span className="whitespace-nowrap">Add Course</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Overall Progress */}
              <div className={`mb-6 overflow-hidden transition-all duration-300 ease-in-out ${isHovering ? 'opacity-100 max-h-36' : 'opacity-0 max-h-0'}`}>
                <h3 className="text-xs uppercase text-gray-400 font-medium tracking-wide mb-3">
                  Quick Stats
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
            </div>
            
            {/* Actions */}
            <div className={`p-4 space-y-2 border-t border-gray-200 ${!isHovering && 'flex justify-center'}`}>
              <button
                onClick={onExportSchedule}
                className={`flex items-center ${!isHovering ? 'justify-center p-2' : 'w-full p-2 text-left'} text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`${isHovering ? 'h-4 w-4' : 'h-9 w-9'} text-gray-500 transition-all duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                </svg>
                <div className={`ml-2 overflow-hidden transition-all duration-300 ease-in-out ${isHovering ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`}>
                  <span className="whitespace-nowrap">Export Schedule</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
