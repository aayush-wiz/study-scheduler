"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { Course } from "@/types/course";

interface CourseContextType {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  availableHours: number;
  setAvailableHours: (hours: number) => void;
}

const CourseContext = createContext<CourseContextType>({
  courses: [],
  setCourses: () => {},
  availableHours: 0,
  setAvailableHours: () => {},
});

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [availableHours, setAvailableHours] = useState<number>(0);

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

  useEffect(() => {
    localStorage.setItem("studySchedulerCourses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("studySchedulerHours", String(availableHours));
  }, [availableHours]);

  return (
    <CourseContext.Provider
      value={{ courses, setCourses, availableHours, setAvailableHours }}
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
