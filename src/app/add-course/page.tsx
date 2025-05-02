"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CourseForm from '@/components/course/CourseForm';
import { Course } from '@/types';

export default function AddCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCourse = async (courseData: Omit<Course, 'id'>) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate adding a course and redirect
      console.log('Adding course:', courseData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to courses page after successful submission
      router.push('/courses');
    } catch (error) {
      console.error('Error adding course:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Add New Course</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Fill out the form below to add a new course to your study schedule.
          </p>
        </header>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {isSubmitting ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Adding your course...</p>
            </div>
          ) : (
            <CourseForm 
              onSubmit={handleAddCourse} 
              onCancel={() => router.push('/courses')}
            />
          )}
        </div>
      </div>
    </div>
  );
} 