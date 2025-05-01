"use client";

import { PropsWithChildren } from "react";
import AuthProvider from "@/components/auth/AuthProvider";
import { CourseProvider } from "./courses/CourseProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <CourseProvider>{children}</CourseProvider>
    </AuthProvider>
  );
}
