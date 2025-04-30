'use client';

import { useState, useEffect, createContext } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { Course } from './components/StudyScheduler';

const inter = Inter({ subsets: ['latin'] });

export const CourseContext = createContext<{
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  availableHours: number;
  setAvailableHours: (hours: number) => void;
}>({
  courses: [],
  setCourses: () => {},
  availableHours: 0,
  setAvailableHours: () => {},
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [availableHours, setAvailableHours] = useState<number>(0);

  // Initialize data from localStorage only once on mount
  useEffect(() => {
    const savedCourses = localStorage.getItem('studySchedulerCourses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }

    const savedHours = localStorage.getItem('studySchedulerHours');
    if (savedHours) {
      setAvailableHours(Number(savedHours));
    }
  }, []);

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studySchedulerCourses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('studySchedulerHours', String(availableHours));
  }, [availableHours]);

  return (
    <html lang="en">
      <head>
        <title>Study Scheduler</title>
        <meta name="description" content="A smart study schedule planner" />
      </head>
      <body className={`${inter.className} bg-[#FFFFFF]`}>
        <CourseContext.Provider value={{ courses, setCourses, availableHours, setAvailableHours }}>
          <main className="min-h-screen bg-[#FFFFFF]">
            <div className="max-w-5xl mx-auto px-4 py-8">
              {children}
            </div>
          </main>
        </CourseContext.Provider>
      </body>
    </html>
  );
}
