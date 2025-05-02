"use client";

import { useState } from "react";
import { Course } from "@/types/course";

type CourseFormProps = {
  onAddCourse: (course: Course) => void;
  totalAllocatedHours: number;
  availableHours: number;
};

export default function CourseForm({ onAddCourse }: CourseFormProps) {
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<Course["difficulty"]>("Medium");
  const [priority, setPriority] = useState<Course["priority"]>("Medium");
  const [hoursNeeded, setHoursNeeded] = useState(5);
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCourse: Course = {
      id: Date.now().toString(), // Generate a temporary ID
      name,
      difficulty,
      priority,
      hoursNeeded,
      completedHours: 0,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
    };

    onAddCourse(newCourse);

    // Reset form
    setName("");
    setDifficulty("Medium");
    setPriority("Medium");
    setHoursNeeded(5);
    setDeadline("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Course Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as Course["difficulty"])
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Course["priority"])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Hours Needed
          </label>
          <input
            type="number"
            value={hoursNeeded}
            onChange={(e) => setHoursNeeded(parseInt(e.target.value))}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Deadline (Optional)
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Add Course
        </button>
      </div>
    </form>
  );
}
