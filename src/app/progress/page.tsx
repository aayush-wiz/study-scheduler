"use client";

import { useState } from "react";
import Link from "next/link";
import { useCourses } from "@/components/courses/CourseProvider";
import type { Course } from "@/types/course";

export default function ProgressPage() {
  const { courses, setCourses } = useCourses();
  
  // Sort courses by priority (High > Medium > Low)
  const sortedCourses = [...courses].sort((a, b) => {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return (
      priorityOrder[a.priority as keyof typeof priorityOrder] -
      priorityOrder[b.priority as keyof typeof priorityOrder]
    );
  });

  // Calculate overall stats
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

  const handleUpdateProgress = (courseId: string, hours: number) => {
    setCourses(
      courses.map(course => 
        course.id === courseId 
          ? { 
              ...course, 
              completedHours: Math.min(course.completedHours + hours, course.hoursNeeded) 
            } 
          : course
      )
    );
  };
  
  return (
    <div className="min-h-screen bg-[#f8f8f8] text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">Course Progress</h1>
            <p className="text-sm text-gray-500 mt-1">Track and update your progress across all courses</p>
          </div>
          <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        {/* Overall Progress Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Overall Progress</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Total Progress</span>
                <span>{totalHoursCompleted}/{totalHoursNeeded} hours ({overallProgress}%)</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-700 transition-all duration-300"
                  style={{
                    width: `${Math.min(100, overallProgress)}%`,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-light text-gray-800">{courses.length}</div>
              <div className="text-sm text-gray-500">Total Courses</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-light text-gray-800">{totalHoursCompleted}</div>
              <div className="text-sm text-gray-500">Hours Completed</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-light text-gray-800">{totalHoursNeeded - totalHoursCompleted}</div>
              <div className="text-sm text-gray-500">Hours Remaining</div>
            </div>
          </div>
        </div>
        
        {/* Course Progress List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Course Progress</h2>
          </div>
          
          {courses.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 mb-4">You haven&apos;t added any courses yet.</p>
              <Link href="/add-course" className="inline-block bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors">
                Add Your First Course
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {sortedCourses.map((course) => {
                const progressPercentage = Math.round((course.completedHours / course.hoursNeeded) * 100);
                
                return (
                  <li key={course.id} className="p-6 hover:bg-gray-50">
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">{course.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span>{course.difficulty}</span>
                            <span className="mx-2">•</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              course.priority === "High"
                                ? "bg-gray-200 text-gray-800"
                                : course.priority === "Medium"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-gray-50 text-gray-600"
                            }`}>
                              {course.priority} Priority
                            </span>
                            {course.deadline && (
                              <>
                                <span className="mx-2">•</span>
                                <span>Due: {new Date(course.deadline).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <CourseProgressUpdater 
                          course={course} 
                          onUpdate={(hours) => handleUpdateProgress(course.id, hours)} 
                        />
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{course.completedHours}/{course.hoursNeeded} hours ({progressPercentage}%)</span>
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
                              width: `${Math.min(100, progressPercentage)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// Component for updating course progress
function CourseProgressUpdater({ course, onUpdate }: { course: Course; onUpdate: (hours: number) => void }) {
  const [hours, setHours] = useState(1);
  
  const handleHoursChange = (value: number) => {
    setHours(Math.max(0.5, value));
  };
  
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="flex items-center mb-2">
        <button
          onClick={() => handleHoursChange(hours - 0.5)}
          className="p-1 bg-gray-200 rounded text-gray-600"
          disabled={hours <= 0.5}
        >
          -
        </button>
        <input
          type="number"
          value={hours}
          onChange={(e) => handleHoursChange(Number(e.target.value))}
          step="0.5"
          min="0.5"
          className="w-16 mx-2 p-1 text-center border border-gray-200 rounded"
        />
        <button
          onClick={() => handleHoursChange(hours + 0.5)}
          className="p-1 bg-gray-200 rounded text-gray-600"
        >
          +
        </button>
        <span className="ml-2 text-sm text-gray-500">hours</span>
      </div>
      <button
        onClick={() => onUpdate(hours)}
        disabled={course.completedHours >= course.hoursNeeded}
        className="w-full bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Update
      </button>
    </div>
  );
}
