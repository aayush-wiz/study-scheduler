import mongoose from "mongoose";

export interface ICourse {
  name: string;
  totalHours: number;
  completedHours: number;
  userId?: string; // Will be used when we add authentication
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new mongoose.Schema<ICourse>(
  {
    name: {
      type: String,
      required: [true, "Please provide a course name"],
      trim: true,
    },
    totalHours: {
      type: Number,
      required: [true, "Please provide total hours"],
      min: [0, "Total hours cannot be negative"],
    },
    completedHours: {
      type: Number,
      default: 0,
      min: [0, "Completed hours cannot be negative"],
    },
    userId: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure completedHours doesn't exceed totalHours
courseSchema.pre("save", function (next) {
  if (this.completedHours > this.totalHours) {
    this.completedHours = this.totalHours;
  }
  next();
});

export const Course =
  mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);
