"use client";

import { useState } from 'react';
import StudyGroup from '@/components/study/StudyGroup';
import { Course, User } from '@/types';
import Image from 'next/image';

// Sample user data - in a real app this would come from authentication
const currentUser: User = {
  id: 'user1',
  name: 'Current User',
  avatar: 'https://ui-avatars.com/api/?name=Current+User&background=6366f1&color=fff',
  status: 'online'
};

export default function StudyGroupsPage() {
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
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Study Groups & Sessions</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Collaborate with classmates, join study sessions, and improve your productivity together.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StudyGroup courses={courses} currentUser={currentUser} />
        </div>
        
        <div className="space-y-6">
          {/* Active Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Online Classmates</h3>
            
            <div className="space-y-3">
              <div className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image 
                      src="https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff" 
                      alt="Alex Johnson" 
                      className="w-full h-full object-cover"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Alex Johnson</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Studying Calculus II</p>
                </div>
                <button className="ml-auto p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image 
                      src="https://ui-avatars.com/api/?name=Maria+Garcia&background=8b5cf6&color=fff" 
                      alt="Maria Garcia" 
                      className="w-full h-full object-cover"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Maria Garcia</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                </div>
                <button className="ml-auto p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image 
                      src="https://ui-avatars.com/api/?name=Jamal+Wilson&background=9333ea&color=fff" 
                      alt="Jamal Wilson" 
                      className="w-full h-full object-cover"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Jamal Wilson</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Away (20m)</p>
                </div>
                <button className="ml-auto p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Invite Classmates
              </button>
            </div>
          </div>
          
          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Study Group Tips</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm opacity-90">Set clear agendas for each study session</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm opacity-90">Take turns explaining concepts to each other</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm opacity-90">Use shared notes for collaborative learning</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm opacity-90">Schedule regular sessions for consistency</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 