"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Course } from "@/types/course";

interface CourseContextType {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
}

const CourseContext = createContext<CourseContextType>({
  courses: [],
  setCourses: () => {},
});

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user?.id || "guest";
  const [courses, setCourses] = useState<Course[]>([]);

  // Load user-specific data from localStorage
  useEffect(() => {
    if (userId) {
      const savedCourses = localStorage.getItem(
        `studySchedulerCourses_${userId}`
      );
      if (savedCourses) {
        setCourses(JSON.parse(savedCourses));
      }
    }
  }, [userId]);

  // Save user-specific data to localStorage
  useEffect(() => {
    if (userId) {
      localStorage.setItem(
        `studySchedulerCourses_${userId}`,
        JSON.stringify(courses)
      );
    }
  }, [courses, userId]);

  return (
    <CourseContext.Provider
      value={{ courses, setCourses }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return context;
};
