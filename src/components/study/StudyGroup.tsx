"use client";

import { useState } from "react";
import { Course, User, StudySession } from "@/types";
import Image from "next/image";

type StudyGroupProps = {
  courses: Course[];
  currentUser: User;
};

export default function StudyGroup({ courses, currentUser }: StudyGroupProps) {
  const [activeTab, setActiveTab] = useState<"sessions" | "groups" | "find">(
    "sessions"
  );
  const [upcomingSessions, setUpcomingSessions] = useState<StudySession[]>([
    {
      id: "1",
      courseId: "1",
      courseName: "Calculus II",
      creator: {
        id: "101",
        name: "Alex Johnson",
        avatar:
          "https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff",
        status: "online",
      },
      participants: [
        {
          id: "101",
          name: "Alex Johnson",
          avatar:
            "https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff",
          status: "online",
        },
        {
          id: "102",
          name: "Maria Garcia",
          avatar:
            "https://ui-avatars.com/api/?name=Maria+Garcia&background=8b5cf6&color=fff",
          status: "offline",
        },
      ],
      startTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
      endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
      notes: "Focus on integration techniques and applications",
      isPublic: true,
    },
    {
      id: "2",
      courseId: "3",
      courseName: "Data Structures",
      creator: {
        id: "103",
        name: "Jamal Wilson",
        avatar:
          "https://ui-avatars.com/api/?name=Jamal+Wilson&background=9333ea&color=fff",
        status: "studying",
      },
      participants: [
        {
          id: "103",
          name: "Jamal Wilson",
          avatar:
            "https://ui-avatars.com/api/?name=Jamal+Wilson&background=9333ea&color=fff",
          status: "studying",
        },
        currentUser,
      ],
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      endTime: new Date(Date.now() + 26 * 60 * 60 * 1000), // 1 day + 2 hours from now
      notes: "Review binary trees and heap implementations",
      isPublic: false,
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSessionForm, setNewSessionForm] = useState({
    courseId: courses[0]?.id || "",
    startTime: "",
    endTime: "",
    notes: "",
    isPublic: true,
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const handleCreateSession = () => {
    // In a real app, this would make an API call to create a session
    const newSession: StudySession = {
      id: Math.random().toString(36).substring(7),
      courseId: newSessionForm.courseId,
      courseName:
        courses.find((c) => c.id === newSessionForm.courseId)?.name ||
        "Unknown Course",
      creator: currentUser,
      participants: [currentUser],
      startTime: new Date(newSessionForm.startTime),
      endTime: new Date(newSessionForm.endTime),
      notes: newSessionForm.notes,
      isPublic: newSessionForm.isPublic,
    };

    setUpcomingSessions([...upcomingSessions, newSession]);
    setShowCreateModal(false);
    // Reset form
    setNewSessionForm({
      courseId: courses[0]?.id || "",
      startTime: "",
      endTime: "",
      notes: "",
      isPublic: true,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("sessions")}
          className={`px-4 py-3 text-sm font-medium flex-1 text-center ${
            activeTab === "sessions"
              ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          My Sessions
        </button>
        <button
          onClick={() => setActiveTab("groups")}
          className={`px-4 py-3 text-sm font-medium flex-1 text-center ${
            activeTab === "groups"
              ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          My Groups
        </button>
        <button
          onClick={() => setActiveTab("find")}
          className={`px-4 py-3 text-sm font-medium flex-1 text-center ${
            activeTab === "find"
              ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Find Sessions
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "sessions" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upcoming Study Sessions
              </h3>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Session
              </button>
            </div>

            {upcomingSessions.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Upcoming Sessions
                </h4>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Create a new study session to get started.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg"
                >
                  Create Study Session
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                          {session.courseName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {formatDate(session.startTime)} -{" "}
                          {formatDate(session.endTime).split(",")[1]}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex -space-x-2 mr-4">
                          {session.participants
                            .slice(0, 3)
                            .map((participant) => (
                              <div
                                key={participant.id}
                                className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden"
                              >
                                <Image
                                  src={participant.avatar}
                                  alt={participant.name}
                                  className="w-full h-full object-cover"
                                  width={28}
                                  height={28}
                                />
                              </div>
                            ))}
                          {session.participants.length > 3 && (
                            <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                              +{session.participants.length - 3}
                            </div>
                          )}
                        </div>
                        {session.isPublic ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                            Public
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                            Private
                          </span>
                        )}
                      </div>
                    </div>

                    {session.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {session.notes}
                      </p>
                    )}

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                          <Image
                            src={session.creator.avatar}
                            alt={session.creator.name}
                            className="w-full h-full object-cover"
                            width={40}
                            height={40}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Created by {session.creator.name}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Join Now
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "groups" && (
          <div className="text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Study Groups Coming Soon
            </h4>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              We&apos;re working on permanent study groups where you can
              collaborate on courses throughout the semester.
            </p>
          </div>
        )}

        {activeTab === "find" && (
          <div className="text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Find Study Sessions
            </h4>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Discover public study sessions hosted by students in your courses.
            </p>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg">
              Browse Sessions
            </button>
          </div>
        )}
      </div>

      {/* Create Study Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Create Study Session
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course
                </label>
                <select
                  value={newSessionForm.courseId}
                  onChange={(e) =>
                    setNewSessionForm({
                      ...newSessionForm,
                      courseId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={newSessionForm.startTime}
                  onChange={(e) =>
                    setNewSessionForm({
                      ...newSessionForm,
                      startTime: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={newSessionForm.endTime}
                  onChange={(e) =>
                    setNewSessionForm({
                      ...newSessionForm,
                      endTime: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={newSessionForm.notes}
                  onChange={(e) =>
                    setNewSessionForm({
                      ...newSessionForm,
                      notes: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="What will you be studying? Add any details for participants."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newSessionForm.isPublic}
                  onChange={(e) =>
                    setNewSessionForm({
                      ...newSessionForm,
                      isPublic: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isPublic"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Make this session public (others can discover and join)
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSession}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
