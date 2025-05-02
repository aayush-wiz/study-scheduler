"use client";

import { useState } from 'react';
import StatisticsDashboard from '@/components/dashboard/StatisticsDashboard';
import { Course } from '@/types/course';

export default function StatisticsPage() {
  // In a real app, this would fetch courses from an API or database
  const [courses] = useState<Course[]>([
    {
      id: '1',
      name: 'Calculus II',
      difficulty: 'Medium',
      hoursNeeded: 60,
      completedHours: 25,
      priority: 'Medium',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      name: 'Physics 101',
      difficulty: 'Hard',
      hoursNeeded: 45,
      completedHours: 10,
      priority: 'High',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      name: 'Data Structures',
      difficulty: 'Hard',
      hoursNeeded: 70,
      completedHours: 40,
      priority: 'Medium',
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      name: 'History of Art',
      difficulty: 'Easy',
      hoursNeeded: 40,
      completedHours: 5,
      priority: 'Low',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Study Statistics & Analytics</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your study habits, analyze your progress, and identify opportunities for improvement.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <StatisticsDashboard courses={courses} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Comparative Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              How You Compare
            </h3>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Average Study Time</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Top 35%</span>
              </div>
              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                <div className="absolute inset-y-0 left-0 w-0.5 bg-black dark:bg-white opacity-70" style={{ left: '79%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>0h</span>
                <span>You: 15h</span>
                <span>Avg: 19h</span>
                <span>30h</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Study Consistency</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Top 20%</span>
              </div>
              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-indigo-500 rounded-full" style={{ width: '80%' }}></div>
                <div className="absolute inset-y-0 left-0 w-0.5 bg-black dark:bg-white opacity-70" style={{ left: '65%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Low</span>
                <span>Avg</span>
                <span>You</span>
                <span>High</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Completion Rate</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Top 50%</span>
              </div>
              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-purple-500 rounded-full" style={{ width: '50%' }}></div>
                <div className="absolute inset-y-0 left-0 w-0.5 bg-black dark:bg-white opacity-70" style={{ left: '50%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>0%</span>
                <span>You & Avg: 50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
          
          {/* Goal Setting */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Study Goals
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Weekly Study Goal</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">15 hours / week</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">75%</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">11.3h of 15h</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Consistency Goal</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Study 5 days / week</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">100%</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">5 of 5 days</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-pink-100 dark:bg-pink-800 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-600 dark:text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Physics Progress Goal</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Reach 30% completion</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-pink-600 dark:text-pink-400">73%</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">22% of 30%</p>
                </div>
              </div>
            </div>
            
            <button className="mt-6 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Set New Study Goal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 