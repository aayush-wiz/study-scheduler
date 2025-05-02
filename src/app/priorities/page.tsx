"use client";

import Link from "next/link";
import { useCourses } from "@/components/courses/CourseProvider";

export default function PrioritiesPage() {
  const { courses } = useCourses();
  
  // Filter high priority courses
  const highPriorityCourses = courses
    .filter(course => course.priority === "High")
    .sort((a, b) => {
      // Sort by deadline if available
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (a.deadline) {
        return -1; // a has deadline, b doesn't
      } else if (b.deadline) {
        return 1; // b has deadline, a doesn't
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">High Priority Courses</h1>
            <p className="text-sm text-gray-500 mt-1">Focus on these courses first</p>
          </div>
          <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">High Priority Courses</h2>
          </div>
          
          {highPriorityCourses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">No High Priority Courses</h3>
              <p className="text-gray-500 mb-4">You don't have any high priority courses at the moment.</p>
              <Link href="/add-course" className="inline-block bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors">
                Add a Course
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {highPriorityCourses.map((course) => {
                const progressPercentage = Math.round((course.completedHours / course.hoursNeeded) * 100);
                
                return (
                  <li key={course.id} className="p-6 hover:bg-gray-50">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">{course.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span>{course.difficulty}</span>
                            {course.deadline && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="font-medium">
                                  Due: {new Date(course.deadline).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block text-sm font-medium text-gray-800">
                            {progressPercentage}% Complete
                          </span>
                          <span className="text-xs text-gray-500">
                            {course.completedHours}/{course.hoursNeeded} hours
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gray-800 transition-all duration-300"
                            style={{
                              width: `${Math.min(100, progressPercentage)}%`,
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Link 
                          href={`/progress?courseId=${course.id}`}
                          className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                        >
                          Update Progress
                        </Link>
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