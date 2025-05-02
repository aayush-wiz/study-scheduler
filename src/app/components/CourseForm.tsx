"use client";

import { useState } from "react";
import { Course } from "./StudyScheduler";

type CourseFormProps = {
  onAddCourse: (course: Course) => void;
  totalAllocatedHours?: number;
  availableHours?: number;
};

const MAX_COURSE_HOURS = 168; // Maximum hours in a week
const MIN_COURSE_HOURS = 1; // Minimum hours per course

export default function CourseForm({
  onAddCourse,
}: CourseFormProps) {
  const [courseName, setCourseName] = useState("");
  const [difficulty, setDifficulty] = useState<Course["difficulty"]>("Medium");
  const [priority, setPriority] = useState<Course["priority"]>("Medium");
  const [hoursNeeded, setHoursNeeded] = useState("1");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  const validateHours = (value: string): boolean => {
    // Check if it's a valid number
    if (!/^\d*\.?\d*$/.test(value)) return false;

    const numValue = Number(value);
    // Check if it's within valid range
    if (numValue < MIN_COURSE_HOURS || numValue > MAX_COURSE_HOURS)
      return false;
    // Check if it has more than 1 decimal place
    if (value.includes(".") && value.split(".")[1].length > 1) return false;

    return true;
  };

  const validateForm = () => {
    if (!courseName.trim()) {
      setError("Course name is required");
      return false;
    }

    const numHours = Number(hoursNeeded);
    if (!validateHours(hoursNeeded)) {
      if (numHours > MAX_COURSE_HOURS) {
        setError(
          `Hours cannot exceed ${MAX_COURSE_HOURS} (total hours in a week)`
        );
      } else {
        setError(
          `Hours must be between ${MIN_COURSE_HOURS} and ${MAX_COURSE_HOURS}, with max 1 decimal place`
        );
      }
      return false;
    }

    if (deadline && new Date(deadline) < new Date()) {
      setError("Deadline cannot be in the past");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    const newCourse: Course = {
      id: Date.now().toString(),
      name: courseName.trim(),
      difficulty,
      priority,
      hoursNeeded: Number(hoursNeeded),
      deadline: deadline || undefined,
      completedHours: 0,
    };

    onAddCourse(newCourse);
    setCourseName("");
    setDifficulty("Medium");
    setPriority("Medium");
    setHoursNeeded("1");
    setDeadline("");
  };

  // Get minimum date for deadline (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleHoursChange = (value: string) => {
    // Only allow numbers and one decimal point
    if (value === "" || validateHours(value)) {
      setHoursNeeded(value);
      setError("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Course Name */}
      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Course Name
        </label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => {
            setCourseName(e.target.value);
            setError("");
          }}
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
          placeholder="Enter course name..."
        />
      </div>

      {/* Difficulty and Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Difficulty
          </label>
          <div className="relative">
            <select
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value as Course["difficulty"]);
                setError("");
              }}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 appearance-none text-sm"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Priority
          </label>
          <div className="relative">
            <select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value as Course["priority"]);
                setError("");
              }}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 appearance-none text-sm"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Hours and Deadline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Hours Needed
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              pattern="^\d*\.?\d{0,1}$"
              value={hoursNeeded}
              onChange={(e) => handleHoursChange(e.target.value)}
              placeholder="Enter hours..."
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 pr-12 text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-400 text-xs">hours</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Deadline (Optional)
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => {
              setDeadline(e.target.value);
              setError("");
            }}
            min={getMinDate()}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-md text-xs">
          {error}
        </div>
      )}

      <div className="text-right">
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Add Course
        </button>
      </div>
    </form>
  );
}
