'use client';

import { useState, useContext, useEffect } from 'react';
import CourseForm from './CourseForm';
import Schedule from './Schedule';
import { CourseContext } from '../layout';

export type Course = {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  hoursNeeded: number;
  priority: 'Low' | 'Medium' | 'High';
  deadline?: string; // Optional deadline
  completedHours: number; // Track progress
};

const DIFFICULTY_WEIGHTS = {
  Hard: 1.5,
  Medium: 1,
  Easy: 0.7
};

const PRIORITY_WEIGHTS = {
  High: 1.3,
  Medium: 1,
  Low: 0.7
};

const MIN_HOURS_PER_COURSE = 1;
const MAX_HOURS_PERCENTAGE = 0.4; // Maximum 40% of total hours for any single course
const BREAK_TIME_RATIO = 0.2; // 20% of study time for breaks

export default function StudyScheduler({
  isPomodoroMode = false
}: {
  isPomodoroMode?: boolean;
}) {
  const { courses, setCourses, availableHours, setAvailableHours } = useContext(CourseContext);
  const [error, setError] = useState<string>('');
  const [showBreakTime, setShowBreakTime] = useState<boolean>(true);
  const [hoursInput, setHoursInput] = useState(availableHours.toString());

  const MAX_WEEKLY_HOURS = 168; // Maximum hours in a week

  useEffect(() => {
    setHoursInput(availableHours.toString());
  }, [availableHours]);

  const validateHours = (value: string): boolean => {
    // Check if it's a valid number
    if (!/^\d*\.?\d*$/.test(value)) return false;
    
    const numValue = Number(value);
    // Check if it's greater than 0 and less than max weekly hours
    if (numValue <= 0 || numValue > MAX_WEEKLY_HOURS) return false;
    // Check if it has more than 1 decimal place
    if (value.includes('.') && value.split('.')[1].length > 1) return false;
    
    return true;
  };

  const handleHoursChange = (value: string) => {
    // Only allow numbers and one decimal point
    if (value === '' || validateHours(value)) {
      setHoursInput(value);
      if (value !== '') {
        const numValue = Number(value);
        if (numValue > MAX_WEEKLY_HOURS) {
          setError(`Maximum available hours per week cannot exceed ${MAX_WEEKLY_HOURS}`);
          return;
        }
        setAvailableHours(numValue);
        setError(numValue < courses.length ? 'Not enough hours for all courses' : '');
      }
    }
  };

  const addCourse = (course: Course) => {
    // Validate course hours
    if (course.hoursNeeded < 1) {
      setError('Course must require at least 1 hour per week');
      return;
    }

    setCourses([...courses, { ...course, completedHours: 0 }]);
    setError('');
  };

  const updateProgress = (courseId: string, completedHours: number) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, completedHours: Math.min(completedHours, course.hoursNeeded) }
        : course
    ));
  };

  const removeCourse = (courseId: string) => {
    setCourses(courses.filter(c => c.id !== courseId));
  };

  const getEffectiveWeight = (course: Course) => {
    const difficultyWeight = DIFFICULTY_WEIGHTS[course.difficulty];
    const priorityWeight = PRIORITY_WEIGHTS[course.priority];
    
    // Calculate deadline urgency (if deadline exists)
    let deadlineWeight = 1;
    if (course.deadline) {
      const daysUntilDeadline = Math.max(
        1,
        Math.ceil((new Date(course.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
      );
      deadlineWeight = Math.min(2, 14 / daysUntilDeadline); // More weight for closer deadlines
    }
    
    return difficultyWeight * priorityWeight * deadlineWeight;
  };

  const generateSchedule = () => {
    if (availableHours < courses.length) {
      setError('Not enough available hours for all courses');
      return [];
    }

    // Calculate effective study hours (accounting for breaks if enabled)
    const effectiveHours = showBreakTime 
      ? availableHours * (1 - BREAK_TIME_RATIO)
      : availableHours;

    // Step 1: Calculate initial weighted hours with priority and deadline consideration
    let totalWeightedHours = 0;
    const initialAllocations = courses.map(course => {
      const effectiveWeight = getEffectiveWeight(course);
      const remainingHours = course.hoursNeeded - course.completedHours;
      const weightedHours = remainingHours * effectiveWeight;
      totalWeightedHours += weightedHours;
      return { ...course, weightedHours, remainingHours };
    });

    // Step 2: Scale hours to fit available time while respecting minimums
    const scaleFactor = effectiveHours / totalWeightedHours;
    let remainingHours = effectiveHours;
    
    const allocatedCourses = initialAllocations.map(course => {
      if (course.remainingHours <= 0) {
        return { ...course, allocatedHours: 0 };
      }

      // Calculate scaled hours
      let allocatedHours = Math.round(course.weightedHours * scaleFactor * 10) / 10;
      
      // Ensure minimum hours
      allocatedHours = Math.max(allocatedHours, MIN_HOURS_PER_COURSE);
      
      // Ensure no course takes too much time
      const maxHours = effectiveHours * MAX_HOURS_PERCENTAGE;
      allocatedHours = Math.min(allocatedHours, maxHours, course.remainingHours);
      
      remainingHours -= allocatedHours;
      
      return { ...course, allocatedHours };
    });

    // Step 3: Distribute any remaining hours proportionally
    if (remainingHours > 0) {
      const unfinishedCourses = allocatedCourses.filter(c => c.remainingHours > c.allocatedHours);
      const totalWeight = unfinishedCourses.reduce((sum, course) => 
        sum + getEffectiveWeight(course), 0);
      
      if (totalWeight > 0) {
        return allocatedCourses.map(course => {
          if (course.remainingHours <= course.allocatedHours) {
            return course;
          }
          const extraHours = (remainingHours * getEffectiveWeight(course)) / totalWeight;
          const newAllocatedHours = Math.min(
            course.remainingHours,
            Math.round((course.allocatedHours + extraHours) * 10) / 10
          );
          return { ...course, allocatedHours: newAllocatedHours };
        });
      }
    }

    return allocatedCourses;
  };

  const totalAllocatedHours = courses.reduce((sum, course) => sum + course.hoursNeeded, 0);

  return (
    <div className="space-y-8">
      <CourseForm 
        onAddCourse={addCourse} 
        totalAllocatedHours={totalAllocatedHours}
        availableHours={availableHours}
      />
      
      {/* Display added courses */}
      {courses.length > 0 && (
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg text-gray-800">Added Courses</h3>
            <div className="text-sm text-gray-500">
              Total Hours: {totalAllocatedHours}/{availableHours || '∞'}
            </div>
          </div>
          <div className="space-y-4">
            {courses.map(course => (
              <div key={course.id} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-800">{course.name}</span>
                    <div className="flex items-center space-x-3">
                      <span className={`text-sm px-2 py-1 rounded-md ${
                        course.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-100' :
                        course.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                        'bg-green-50 text-green-600 border border-green-100'
                      }`}>
                        {course.priority} Priority
                      </span>
                      {course.deadline && (
                        <span className="text-sm text-gray-500">
                          Due: {new Date(course.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-sm text-gray-600">
                      <span>{course.hoursNeeded} hours needed • </span>
                      <span className={`${
                        course.difficulty === 'Hard' ? 'text-red-600' :
                        course.difficulty === 'Medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {course.difficulty}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1.5">
                        <span>Progress: {Math.round((course.completedHours / course.hoursNeeded) * 100)}%</span>
                        <span>{course.completedHours}/{course.hoursNeeded}h</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${(course.completedHours / course.hoursNeeded) * 100}%` }}
                        />
                      </div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max={course.hoursNeeded}
                      value={course.completedHours}
                      onChange={(e) => updateProgress(course.id, Number(e.target.value))}
                      className="w-20 px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      aria-label="Remove course"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="p-6 bg-white rounded-lg border border-gray-200 space-y-4">
        <label className="block text-sm text-gray-800">
          Available Study Hours per Week
          <div className="mt-2 relative rounded-md">
            <input
              type="text"
              inputMode="decimal"
              pattern="^\d*\.?\d{0,1}$"
              value={hoursInput}
              onChange={(e) => handleHoursChange(e.target.value)}
              placeholder="Enter hours..."
              className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors pr-12"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-400 text-sm">hrs</span>
            </div>
          </div>
          <div className="mt-1.5 flex justify-between">
            <span className="text-xs text-gray-500">Min: 1</span>
            <span className="text-xs text-gray-500">Max: {MAX_WEEKLY_HOURS}</span>
          </div>
          <p className="mt-1.5 text-xs text-gray-500">Enter total available study hours per week</p>
        </label>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="breakTime"
            checked={showBreakTime}
            onChange={(e) => setShowBreakTime(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="breakTime" className="ml-2 block text-sm text-gray-900">
            Include break time in calculations ({Math.round(BREAK_TIME_RATIO * 100)}% of study time)
          </label>
        </div>

        {isPomodoroMode && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Pomodoro Mode Active</span>
            </div>
            <p className="mt-1 text-sm text-blue-600">
              Your schedule is optimized for 25-minute focus sessions with 5-minute breaks.
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
      </div>

      {courses.length > 0 && availableHours > 0 && !error && (
        <Schedule 
          courses={generateSchedule()} 
          totalHours={availableHours}
          showBreakTime={showBreakTime}
          breakTimeRatio={BREAK_TIME_RATIO}
        />
      )}
    </div>
  );
} 