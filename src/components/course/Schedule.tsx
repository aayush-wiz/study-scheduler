"use client";

import { useState } from 'react';
import { Course } from '@/types/course';

type ScheduleProps = {
  courses: Course[];
  onMarkProgress: (courseId: string, hoursCompleted: number) => void;
};

export default function Schedule({ courses, onMarkProgress }: ScheduleProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [progressHours, setProgressHours] = useState<number>(1);
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  
  // Sort courses by priority and deadline
  const sortedCourses = [...courses].sort((a, b) => {
    // First sort by priority (High > Medium > Low)
    const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then sort by deadline (closest first)
    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else if (a.deadline) {
      return -1; // a has deadline, b doesn't
    } else if (b.deadline) {
      return 1; // b has deadline, a doesn't
    }
    
    return 0; // both don't have deadlines
  });
  
  const handleOpenProgressModal = (course: Course) => {
    setSelectedCourse(course);
    setProgressHours(1);
    setShowProgressModal(true);
  };
  
  const handleSubmitProgress = () => {
    if (selectedCourse && progressHours > 0) {
      onMarkProgress(selectedCourse.id, progressHours);
      setShowProgressModal(false);
    }
  };
  
  const calculateProgress = (course: Course) => {
    return Math.min(100, Math.round((course.completedHours / course.hoursNeeded) * 100));
  };
  
  const getTimeLeft = (deadline: string | null) => {
    if (!deadline) return null;
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'Overdue';
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return '1 day left';
    } else {
      return `${diffDays} days left`;
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Study Schedule</h2>
      
      {courses.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Courses Added Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Add courses to see your study schedule and track your progress.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedCourses.map((course) => (
            <div key={course.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {course.name}
                  </h3>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(course.priority)}`}>
                  {course.priority} Priority
                </span>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-gray-800 dark:text-gray-300">{calculateProgress(course)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-indigo-600" 
                    style={{ 
                      width: `${calculateProgress(course)}%`
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span>{course.completedHours} of {course.hoursNeeded} hours</span>
                  {course.deadline && (
                    <span className="ml-4 inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {getTimeLeft(course.deadline)}
                    </span>
                  )}
                </div>
                
                <button 
                  onClick={() => handleOpenProgressModal(course)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Log Progress
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Progress Modal */}
      {showProgressModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md relative">
            <button 
              onClick={() => setShowProgressModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Log Study Progress</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Record your progress for <span className="font-medium text-gray-900 dark:text-white">{selectedCourse.name}</span>
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hours Studied
              </label>
              <div className="flex items-center">
                <button 
                  onClick={() => setProgressHours(prev => Math.max(0.5, prev - 0.5))}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-l-lg"
                >
                  -
                </button>
                <input 
                  type="number" 
                  min="0.5" 
                  step="0.5"
                  value={progressHours}
                  onChange={(e) => setProgressHours(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  className="w-full px-3 py-2 border-y border-gray-300 dark:border-gray-600 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
                />
                <button 
                  onClick={() => setProgressHours(prev => prev + 0.5)}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-r-lg"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={() => setShowProgressModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitProgress}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 