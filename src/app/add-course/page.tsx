"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCourses } from "@/components/courses/CourseProvider";
import { v4 as uuidv4 } from "uuid";
import type { Course } from "@/types/course";

export default function AddCoursePage() {
  const router = useRouter();
  const { courses, setCourses } = useCourses();
  
  const [formData, setFormData] = useState({
    name: "",
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
    hoursNeeded: 10,
    priority: "Medium" as "Low" | "Medium" | "High",
    deadline: "",
  });
  
  const [error, setError] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.name.trim()) {
      setError("Course name is required");
      return;
    }
    
    if (isNaN(Number(formData.hoursNeeded)) || Number(formData.hoursNeeded) <= 0) {
      setError("Hours needed must be greater than 0");
      return;
    }
    
    // Create new course
    const newCourse = {
      id: uuidv4(),
      name: formData.name.trim(),
      difficulty: formData.difficulty,
      hoursNeeded: Number(formData.hoursNeeded),
      priority: formData.priority,
      deadline: formData.deadline || undefined,
      completedHours: 0,
    };
    
    // Add to courses
    setCourses([...courses, newCourse]);
    
    // Redirect back to dashboard
    router.push("/");
  };
  
  return (
    <div className="min-h-screen bg-[#f8f8f8] text-gray-800 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-gray-500 hover:text-gray-700 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-xl font-medium text-gray-800">Add New Course</h1>
          </div>
          
          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Course Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter course name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="hoursNeeded" className="block text-sm font-medium text-gray-700 mb-1">
                  Hours Needed*
                </label>
                <input
                  type="number"
                  id="hoursNeeded"
                  name="hoursNeeded"
                  value={formData.hoursNeeded}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline (Optional)
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Add Course
              </button>
              <Link 
                href="/"
                className="flex-1 text-center bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 