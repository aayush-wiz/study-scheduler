'use client';

import { Course } from './StudyScheduler';

type ScheduleProps = {
  courses: (Course & { allocatedHours: number })[];
  totalHours: number;
  showBreakTime: boolean;
  breakTimeRatio: number;
};

export default function Schedule({ courses, totalHours, showBreakTime, breakTimeRatio }: ScheduleProps) {
  const totalAllocatedHours = courses.reduce((sum, course) => sum + course.allocatedHours, 0);
  const breakTimeHours = showBreakTime ? totalHours * breakTimeRatio : 0;
  const effectiveStudyHours = totalHours - breakTimeHours;
  
  // Calculate daily recommendations (assuming 7 days a week)
  const getDailyRecommendation = (hours: number) => {
    const dailyHours = Math.round((hours / 7) * 10) / 10;
    return dailyHours < 0.1 ? '< 0.1' : dailyHours;
  };

  // Get deadline status
  const getDeadlineStatus = (deadline?: string) => {
    if (!deadline) return null;
    
    const daysUntil = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    );
    
    if (daysUntil < 0) return { text: 'Overdue', color: 'text-red-600' };
    if (daysUntil === 0) return { text: 'Due today', color: 'text-orange-600' };
    if (daysUntil <= 7) return { text: `${daysUntil}d left`, color: 'text-yellow-600' };
    return { text: `${Math.floor(daysUntil / 7)}w ${daysUntil % 7}d left`, color: 'text-green-600' };
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Weekly Study Schedule</h2>
      <div className="space-y-4">
        {courses.map(course => {
          const deadlineStatus = getDeadlineStatus(course.deadline);
          const progressPercentage = Math.round((course.completedHours / course.hoursNeeded) * 100);
          
          return (
            <div key={course.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium">{course.name}</h3>
                  <div className="text-sm text-gray-500 mt-1">
                    {course.allocatedHours > 0 ? (
                      <>
                        <span>{course.allocatedHours}h/week • </span>
                        <span>{getDailyRecommendation(course.allocatedHours)}h/day</span>
                      </>
                    ) : (
                      <span className="text-green-600">Completed!</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      course.difficulty === 'Hard' ? 'bg-red-100 text-red-800' :
                      course.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {course.difficulty}
                    </span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      course.priority === 'High' ? 'bg-red-100 text-red-800' :
                      course.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {course.priority} Priority
                    </span>
                  </div>
                  {deadlineStatus && (
                    <div className={`text-sm mt-1 ${deadlineStatus.color}`}>
                      {deadlineStatus.text}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress:</span>
                  <span>{progressPercentage}% ({course.completedHours}/{course.hoursNeeded}h)</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {course.allocatedHours > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Time allocation</span>
                    <span>{Math.round((course.allocatedHours / effectiveStudyHours) * 100)}% of study time</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        course.difficulty === 'Hard' ? 'bg-red-500' :
                        course.difficulty === 'Medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${(course.allocatedHours / effectiveStudyHours) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span>Total Weekly Hours:</span>
              <span>{totalHours} hours</span>
            </div>
            
            {showBreakTime && (
              <>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Study Time:</span>
                  <span>{effectiveStudyHours} hours ({Math.round((effectiveStudyHours / totalHours) * 100)}%)</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Break Time:</span>
                  <span>{breakTimeHours} hours ({Math.round(breakTimeRatio * 100)}%)</span>
                </div>
              </>
            )}
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>Daily Average:</span>
              <span>{getDailyRecommendation(totalHours)} hours/day</span>
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>Allocated Study Hours:</span>
              <span>
                {totalAllocatedHours} hours 
                ({Math.round((totalAllocatedHours / effectiveStudyHours) * 100)}% of study time)
              </span>
            </div>

            {showBreakTime && (
              <div className="mt-2">
                <div className="text-xs text-gray-500 mb-1">Time Distribution</div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(effectiveStudyHours / totalHours) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Study Time</span>
                  <span>Break Time</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 