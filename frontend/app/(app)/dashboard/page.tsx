import type { Metadata } from "next";
import { TaskDashboard } from "@/components/tasks/TaskDashboard";

export const metadata: Metadata = {
  title: "Your Tasks",
  description: "Add, view, update, complete, and delete your personal tasks.",
};

/** Task list screen (US1-US5). Logic lives in TaskDashboard. */
export default function TasksPage() {
  return <TaskDashboard />;
}
