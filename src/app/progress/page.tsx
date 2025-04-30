'use client';

import { useContext } from 'react';
import { Course } from '../components/StudyScheduler';
import Link from 'next/link';
import { CourseContext } from '../layout';

export default function Progress() {
  const { courses, setCourses } = useContext(CourseContext);

  const updateProgress = (courseId: string, completedHours: number) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, completedHours: Math.min(completedHours, course.hoursNeeded) }
        : course
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Progress</h1>
            <p className="mt-2 text-gray-600">
              Track and update your study progress
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          >
            Back to Schedule
          </Link>
        </div>

        <div className="space-y-6">
          {courses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">No courses added yet.</p>
              <Link
                href="/"
                className="mt-4 inline-block text-blue-600 hover:text-blue-700"
              >
                Go add some courses
              </Link>
            </div>
          ) : (
            courses.map(course => {
              const progress = Math.round((course.completedHours / course.hoursNeeded) * 100);
              const isCompleted = course.completedHours >= course.hoursNeeded;
              
              return (
                <div key={course.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{course.name}</h2>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span className={`${
                          course.difficulty === 'Hard' ? 'text-red-600' :
                          course.difficulty === 'Medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {course.difficulty}
                        </span>
                        <span>•</span>
                        <span className={`${
                          course.priority === 'High' ? 'text-red-600' :
                          course.priority === 'Medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {course.priority} Priority
                        </span>
                        {course.deadline && (
                          <>
                            <span>•</span>
                            <span>Due: {new Date(course.deadline).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isCompleted ? 'Completed' : `${progress}% Complete`}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Progress ({course.completedHours}/{course.hoursNeeded} hours)</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isCompleted ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700">
                          Update Progress
                          <input
                            type="range"
                            min="0"
                            max={course.hoursNeeded}
                            value={course.completedHours}
                            onChange={(e) => updateProgress(course.id, Number(e.target.value))}
                            className="w-full h-2 mt-2"
                          />
                        </label>
                      </div>
                      <div className="w-20">
                        <input
                          type="number"
                          min="0"
                          max={course.hoursNeeded}
                          value={course.completedHours}
                          onChange={(e) => updateProgress(course.id, Number(e.target.value))}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
} 