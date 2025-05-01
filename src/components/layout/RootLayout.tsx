"use client";

import { useState, useEffect, createContext } from "react";
import { Course } from "@/types/course";
import AuthProvider from "@/components/auth/AuthProvider";

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
    const savedCourses = localStorage.getItem("studySchedulerCourses");
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }

    const savedHours = localStorage.getItem("studySchedulerHours");
    if (savedHours) {
      setAvailableHours(Number(savedHours));
    }
  }, []);

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("studySchedulerCourses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("studySchedulerHours", String(availableHours));
  }, [availableHours]);

  return (
    <AuthProvider>
      <CourseContext.Provider
        value={{ courses, setCourses, availableHours, setAvailableHours }}
      >
        <main className="min-h-screen bg-[#FFFFFF]">
          <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
        </main>
      </CourseContext.Provider>
    </AuthProvider>
  );
}
