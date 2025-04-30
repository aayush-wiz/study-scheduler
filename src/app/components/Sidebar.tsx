'use client';

import { useState } from 'react';
import { Course } from './StudyScheduler';

type SidebarProps = {
  courses: Course[];
  onExportSchedule: () => void;
  onTogglePomodoro: () => void;
};

export default function Sidebar({ courses, onExportSchedule, onTogglePomodoro }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Calculate study statistics
  const totalHoursNeeded = courses.reduce((sum, course) => sum + course.hoursNeeded, 0);
  const totalHoursCompleted = courses.reduce((sum, course) => sum + course.completedHours, 0);
  const overallProgress = totalHoursNeeded > 0 
    ? Math.round((totalHoursCompleted / totalHoursNeeded) * 100) 
    : 0;

  const upcomingDeadlines = courses
    .filter(course => course.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 3);

  const highPriorityCourses = courses.filter(course => course.priority === 'High');

  // Timer functions
  const startTimer = (minutes: number) => {
    if (activeTimer) {
      clearInterval(activeTimer);
    }
    const seconds = minutes * 60;
    setTimeLeft(seconds);
    const timerId = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          setActiveTimer(null);
          // Play notification sound
          const audio = new Audio('/notification.mp3');
          audio.play();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setActiveTimer(timerId);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-8 bg-blue-500 text-white p-1 rounded-full shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className={`h-full overflow-y-auto p-4 ${!isOpen && 'hidden'}`}>
        <h2 className="text-lg font-semibold mb-6">Study Dashboard</h2>

        {/* Overall Progress */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Overall Progress</h3>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  {overallProgress}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {totalHoursCompleted}/{totalHoursNeeded}h
                </span>
              </div>
            </div>
            <div className="flex h-2 mb-4 overflow-hidden bg-blue-200 rounded">
              <div
                style={{ width: `${overallProgress}%` }}
                className="flex flex-col justify-center overflow-hidden bg-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Study Timer */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Study Timer</h3>
          <div className="space-y-2">
            {activeTimer ? (
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {formatTime(timeLeft)}
                </div>
                <button
                  onClick={() => {
                    clearInterval(activeTimer);
                    setActiveTimer(null);
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Stop Timer
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => startTimer(25)}
                  className="p-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  25min Focus
                </button>
                <button
                  onClick={() => startTimer(5)}
                  className="p-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  5min Break
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        {upcomingDeadlines.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Upcoming Deadlines</h3>
            <div className="space-y-2">
              {upcomingDeadlines.map(course => (
                <div
                  key={course.id}
                  className="p-2 bg-gray-50 rounded text-sm"
                >
                  <div className="font-medium">{course.name}</div>
                  <div className="text-xs text-gray-500">
                    Due: {new Date(course.deadline!).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* High Priority Courses */}
        {highPriorityCourses.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">High Priority</h3>
            <div className="space-y-2">
              {highPriorityCourses.map(course => (
                <div
                  key={course.id}
                  className="p-2 bg-red-50 rounded text-sm"
                >
                  <div className="font-medium text-red-700">{course.name}</div>
                  <div className="text-xs text-red-500">
                    {Math.round((course.completedHours / course.hoursNeeded) * 100)}% Complete
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-2">
          <button
            onClick={onExportSchedule}
            className="w-full p-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export Schedule
          </button>
          <button
            onClick={onTogglePomodoro}
            className="w-full p-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Toggle Pomodoro Mode
          </button>
        </div>
      </div>
    </div>
  );
} 