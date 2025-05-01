"use client";

import { useState } from "react";
import Link from "next/link";
import StudyScheduler from "./components/StudyScheduler";
import Sidebar from "./components/Sidebar";
import { useCourses } from "@/components/courses/CourseProvider";

export default function Home() {
  const { courses } = useCourses();
  const [isPomodoroMode, setIsPomodoroMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleExportSchedule = () => {
    if (!courses.length) {
      alert("No courses to export!");
      return;
    }
    
    // Create a formatted text version of the schedule
    const scheduleText = courses
      .map((course) => {
        const progress = Math.round(
          (course.completedHours / course.hoursNeeded) * 100
        );
        const deadline = course.deadline
          ? `Deadline: ${new Date(course.deadline).toLocaleDateString()}`
          : "No deadline";

        return `
Course: ${course.name}
Difficulty: ${course.difficulty}
Priority: ${course.priority}
Hours Needed: ${course.hoursNeeded}
Progress: ${progress}% (${course.completedHours}/${course.hoursNeeded} hours)
${deadline}
-------------------`;
      })
      .join("\n");

    const fullText = `Study Schedule Export
Generated: ${new Date().toLocaleString()}
===================
${scheduleText}
`;

    // Create a blob and download it
    const blob = new Blob([fullText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `study-schedule-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get current month and year for calendar header
  const getCurrentMonth = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  const totalHoursCompleted = courses.reduce((sum, course) => sum + course.completedHours, 0);
  const totalHoursNeeded = courses.reduce((sum, course) => sum + course.hoursNeeded, 0);
  const completionPercentage = totalHoursNeeded > 0 ? Math.round((totalHoursCompleted / totalHoursNeeded) * 100) : 0;

  return (
    <div className="flex h-screen bg-[#f8f8f8] text-gray-800 font-sans overflow-hidden">
      <Sidebar
        courses={courses}
        onExportSchedule={handleExportSchedule}
        onTogglePomodoro={() => setIsPomodoroMode(!isPomodoroMode)}
        onSidebarToggle={(isOpen) => setIsSidebarOpen(isOpen)}
      />
      
      <main className={`flex-1 overflow-auto transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-14'}`}>
        {/* Banner with inspirational quote */}
        <div className="bg-[#f0f0f0] border-b border-gray-200 py-8 px-8 text-center">
          <p className="text-lg italic text-gray-500 font-light">
            "Whatever I put my mind to, I achieve."
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 py-6">
          {/* Page Header with Academic Icon */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h1 className="text-2xl font-normal text-gray-800">My Academic Planner</h1>
            </div>
            <Link href="/add-course" className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors">
              Add New Course
            </Link>
          </div>
          
          {/* Stats Overview */}
          <div className="mb-8 grid grid-cols-1 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border-r border-gray-100 pr-4">
                  <div className="text-6xl font-extralight text-gray-700">{completionPercentage}</div>
                  <div className="text-sm text-gray-500 mt-1">Completion %</div>
                </div>
                <div>
                  <div className="text-6xl font-extralight text-gray-700">{courses.length}</div>
                  <div className="text-sm text-gray-500 mt-1">Total Courses</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1 text-xs text-gray-500">
                  <span>Year: {completionPercentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded">
                  <div className="bg-gray-700 h-full rounded" style={{ width: `${completionPercentage}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center mb-1 mt-2 text-xs text-gray-500">
                  <span>Month: {Math.min(100, completionPercentage + 10)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded">
                  <div className="bg-gray-700 h-full rounded" style={{ width: `${Math.min(100, completionPercentage + 10)}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center mb-1 mt-2 text-xs text-gray-500">
                  <span>Week: {Math.min(100, completionPercentage + 20)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded">
                  <div className="bg-gray-700 h-full rounded" style={{ width: `${Math.min(100, completionPercentage + 20)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Course Cards */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-800 mb-4">My Courses</h2>
            {courses.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500">You haven't added any courses yet.</p>
                <Link href="/add-course" className="mt-4 inline-block bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors">
                  Add Your First Course
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map(course => (
                  <div key={course.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-base font-medium text-gray-800">{course.name}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        course.priority === "High"
                          ? "bg-red-50 text-red-600"
                          : course.priority === "Medium"
                          ? "bg-yellow-50 text-yellow-600"
                          : "bg-green-50 text-green-600"
                      }`}>
                        {course.priority}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-3">
                      <div className="flex justify-between mb-1">
                        <span>Difficulty: {course.difficulty}</span>
                        <span>{course.hoursNeeded} hours total</span>
                      </div>
                      {course.deadline && (
                        <div className="mt-1">
                          Due: {new Date(course.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{Math.round((course.completedHours / course.hoursNeeded) * 100)}% complete</span>
                        <span>{course.completedHours}/{course.hoursNeeded}h</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            course.priority === "High"
                              ? "bg-red-400"
                              : course.priority === "Medium"
                              ? "bg-yellow-400"
                              : "bg-green-400"
                          }`}
                          style={{
                            width: `${Math.min(100, (course.completedHours / course.hoursNeeded) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    
                    <Link 
                      href={`/progress?courseId=${course.id}`}
                      className="text-xs text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Update progress →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-400 pb-8">
            <p>Created with Next.js • {new Date().getFullYear()}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
