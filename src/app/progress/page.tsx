"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCourses } from "@/components/courses/CourseProvider";
import type { Course } from "@/types/course";

export default function ProgressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  
  const { courses, setCourses } = useCourses();
  const [course, setCourse] = useState<Course | null>(null);
  const [completedHours, setCompletedHours] = useState(0);
  const [sessionHours, setSessionHours] = useState(1);
  
  useEffect(() => {
    if (!courseId) {
      router.push("/");
      return;
    }
    
    const foundCourse = courses.find(c => c.id === courseId);
    if (!foundCourse) {
      router.push("/");
      return;
    }
    
    setCourse(foundCourse);
    setCompletedHours(foundCourse.completedHours);
  }, [courseId, courses, router]);
  
  const handleUpdateProgress = () => {
    if (!course) return;
    
    // Update course progress
    const newHours = Math.min(completedHours + sessionHours, course.hoursNeeded);
    
    // Update the courses array
    setCourses(
      courses.map(c => 
        c.id === courseId 
          ? { ...c, completedHours: newHours } 
          : c
      )
    );
    
    // Go back to main page
    router.push("/");
  };
  
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
        <div className="text-center">
          <div className="mb-2 text-gray-500">Loading course data...</div>
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  const progressPercentage = Math.round((completedHours / course.hoursNeeded) * 100);
  
  return (
    <div className="min-h-screen bg-[#f8f8f8] text-gray-800 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-gray-500 hover:text-gray-700 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-xl font-medium text-gray-800">Update Progress</h1>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-1">{course.name}</h2>
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <span className="mr-2">Difficulty: {course.difficulty}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                course.priority === "High"
                  ? "bg-red-50 text-red-600"
                  : course.priority === "Medium"
                  ? "bg-yellow-50 text-yellow-600"
                  : "bg-green-50 text-green-600"
              }`}>
                {course.priority} Priority
              </span>
            </div>
            
            {course.deadline && (
              <div className="text-sm text-gray-500 mb-3">
                Deadline: {new Date(course.deadline).toLocaleDateString()}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Current Progress</span>
              <span>{completedHours}/{course.hoursNeeded} hours ({progressPercentage}%)</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full transition-all duration-300 ${
                  course.priority === "High"
                    ? "bg-red-400"
                    : course.priority === "Medium"
                    ? "bg-yellow-400"
                    : "bg-green-400"
                }`}
                style={{
                  width: `${Math.min(100, progressPercentage)}%`,
                }}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Study Session Hours
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setSessionHours(Math.max(0.5, sessionHours - 0.5))}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-l-md text-gray-500 hover:bg-gray-100"
              >
                -
              </button>
              <input
                type="number"
                value={sessionHours}
                onChange={(e) => setSessionHours(Math.max(0.5, Number(e.target.value)))}
                step="0.5"
                min="0.5"
                className="w-20 px-3 py-1.5 text-center border-t border-b border-gray-200 focus:outline-none"
              />
              <button
                onClick={() => setSessionHours(sessionHours + 0.5)}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-r-md text-gray-500 hover:bg-gray-100"
              >
                +
              </button>
              <span className="ml-2 text-sm text-gray-500">hours</span>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              {sessionHours > 0 ? (
                <>
                  This will update your progress to {Math.min(completedHours + sessionHours, course.hoursNeeded)}/{course.hoursNeeded} hours
                  ({Math.min(100, Math.round(((completedHours + sessionHours) / course.hoursNeeded) * 100))}%)
                </>
              ) : "Please enter a valid number of hours"}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleUpdateProgress}
              disabled={sessionHours <= 0 || completedHours >= course.hoursNeeded}
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Update Progress
            </button>
            <Link 
              href="/"
              className="flex-1 text-center bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
          
          {completedHours >= course.hoursNeeded && (
            <div className="mt-4 p-3 bg-green-50 text-green-600 text-sm rounded-md border border-green-200">
              Congratulations! You've completed all the required hours for this course.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
