'use client';

import { useState, useContext } from 'react';
import Link from 'next/link';
import StudyScheduler from './components/StudyScheduler';
import Sidebar from './components/Sidebar';
import { CourseContext } from './layout';

export default function Home() {
  const { courses } = useContext(CourseContext);
  const [isPomodoroMode, setIsPomodoroMode] = useState(false);

  const handleExportSchedule = () => {
    // Create a formatted text version of the schedule
    const scheduleText = courses.map(course => {
      const progress = Math.round((course.completedHours / course.hoursNeeded) * 100);
      const deadline = course.deadline ? `Deadline: ${new Date(course.deadline).toLocaleDateString()}` : 'No deadline';
      
      return `
Course: ${course.name}
Difficulty: ${course.difficulty}
Priority: ${course.priority}
Hours Needed: ${course.hoursNeeded}
Progress: ${progress}% (${course.completedHours}/${course.hoursNeeded} hours)
${deadline}
-------------------`;
    }).join('\n');

    const fullText = `Study Schedule Export
Generated: ${new Date().toLocaleString()}
===================
${scheduleText}
`;

    // Create a blob and download it
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-schedule-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        courses={courses}
        onExportSchedule={handleExportSchedule}
        onTogglePomodoro={() => setIsPomodoroMode(!isPomodoroMode)}
      />
      <div className={`transition-all duration-300 ${
        true ? 'ml-64' : 'ml-16'
      }`}>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Study Scheduler</h1>
              <p className="mt-2 text-gray-600">
                Plan your study schedule efficiently with smart time allocation
              </p>
            </div>
            <Link
              href="/progress"
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Track Progress
            </Link>
          </header>
          
          <StudyScheduler
            isPomodoroMode={isPomodoroMode}
          />
        </div>
      </div>
    </div>
  );
} 