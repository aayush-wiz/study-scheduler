export interface Course {
  id: string;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  hoursNeeded: number;
  priority: "Low" | "Medium" | "High";
  deadline?: string;
  completedHours: number;
}
