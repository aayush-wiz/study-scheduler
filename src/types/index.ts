// Common type definitions for the application

export type Course = {
  id: string;
  name: string;
  instructor: string;
  credits: number;
  hoursNeeded: number;
  completedHours: number;
  priority: "High" | "Medium" | "Low";
  deadline: string | undefined;
  description: string;
  color: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

export type User = {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "studying";
};

export type StudySession = {
  id: string;
  courseId: string;
  courseName: string;
  creator: User;
  participants: User[];
  startTime: Date;
  endTime: Date;
  notes: string;
  isPublic: boolean;
};
