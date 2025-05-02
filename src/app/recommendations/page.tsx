"use client";

import { useState } from 'react';
import SmartRecommendations from '@/components/study/SmartRecommendations';
import { Course } from '@/types';

export default function RecommendationsPage() {
  // In a real app, this would fetch courses from an API or database
  const [courses] = useState<Course[]>([
    {
      id: '1',
      name: 'Calculus II',
      instructor: 'Dr. Smith',
      credits: 4,
      hoursNeeded: 60,
      completedHours: 25,
      priority: 'Medium',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Covers integral calculus, sequences and series, parametric equations, and polar coordinates.',
      color: '#6366F1',
      difficulty: 'Medium'
    },
    {
      id: '2',
      name: 'Physics 101',
      instructor: 'Dr. Johnson',
      credits: 3,
      hoursNeeded: 45,
      completedHours: 10,
      priority: 'High',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Introduction to mechanics, waves, and thermodynamics.',
      color: '#8B5CF6',
      difficulty: 'Hard'
    },
    {
      id: '3',
      name: 'Data Structures',
      instructor: 'Prof. Williams',
      credits: 4,
      hoursNeeded: 70,
      completedHours: 40,
      priority: 'Medium',
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Implementation and analysis of fundamental data structures.',
      color: '#EC4899',
      difficulty: 'Hard'
    },
    {
      id: '4',
      name: 'History of Art',
      instructor: 'Dr. Garcia',
      credits: 3,
      hoursNeeded: 40,
      completedHours: 5,
      priority: 'Low',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Survey of major artistic movements from antiquity to present day.',
      color: '#F59E0B',
      difficulty: 'Easy'
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Smart Study Recommendations</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Optimize your study time with AI-powered scheduling recommendations based on your deadlines, priorities, and current progress.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <SmartRecommendations courses={courses} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Focus Course Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Focus Course
            </h3>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Physics 101</h4>
                <p className="text-sm text-red-600 dark:text-red-400">Needs immediate attention</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>22%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '22%' }}></div>
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                This course needs more attention as you&apos;re falling behind schedule with only 7 days left until the deadline.
              </p>
              <button className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg">
                Focus on This Course
              </button>
            </div>
          </div>
          
          {/* Study Streak */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Study Streak
            </h3>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">5</span>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">Day Streak</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                You&apos;ve studied consistently for 5 days in a row!
              </p>
            </div>
            <div className="mt-6 grid grid-cols-7 gap-1">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-8 rounded ${
                    i < 5 
                      ? 'bg-green-500 dark:bg-green-600' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                ></div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
              Keep going! Your longest streak was 12 days.
            </p>
          </div>
          
          {/* Learning Tips */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Effective Learning Tips</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm opacity-90">Use active recall instead of passive review</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm opacity-90">Space your study sessions over time for better retention</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm opacity-90">Alternate between different subjects in one study session</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm opacity-90">Take short breaks every 25-30 minutes (Pomodoro Technique)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 