import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import React from "react";
  
interface Task {
    id: string;
    title: string;
    dueDate: string;
    priority: "high" | "medium" | "low";
  }
  
  interface CalendarTaskGroup {
    dueDate: string;
    tasks: Task[];
  }
  

interface Project {
  projectId: string;
  projectName: string;
  completedTasks: number;
  totalTasks: number;
}

interface APIProjectProgress {
  projectId: string;
  projectName: string;
  completedTasks: number;
  totalTasks: number;
}

interface APITask {
  id: string;
  title: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
}

interface APICalendarTaskGroup {
  dueDate: string;
  tasks: APITask[];
}

interface TaskStats {
  completed: number;
  pending: number;
}
interface APIDashboardResponse {
  taskStats: TaskStats;
  upcomingTasks: APITask[];
  projectProgress: APIProjectProgress[];
  calendarTasks: APICalendarTaskGroup[];
}

interface TaskState {
    taskStats: TaskStats;
    upcomingTasks: Task[];
    projectProgress: Project[];
    calendarTasks: CalendarTaskGroup[]; 
    error: string | null;
  }
  

export const useTaskStore = create<TaskState>(() => ({
    taskStats: { completed: 0, pending: 0 },
    upcomingTasks: [],
    projectProgress: [],
    calendarTasks: [], 
    error: null,
  }));
export const useFetchDashboardData = () => {
  const setTasks = useTaskStore.setState;

  const query = useQuery<APIDashboardResponse>({
    queryKey: ["dashboardData"],
    queryFn: async (): Promise<APIDashboardResponse> => {
      const [taskStats, upcomingTasks, projectProgress, calendarTasks] = await Promise.all([
        fetch("/api/dashboard/task-stats").then((res) => res.json() as Promise<TaskStats>),
        fetch("/api/dashboard/upcoming-tasks").then((res) => res.json() as Promise<APITask[]>),
        fetch("/api/dashboard/progress").then((res) => res.json() as Promise<APIProjectProgress[]>),
        fetch("/api/dashboard/calender-tasks").then((res) => res.json() as Promise<APICalendarTaskGroup[]>),
      ]);

      return { taskStats, upcomingTasks, projectProgress, calendarTasks };
    },
    staleTime: 1000 * 60 * 5,
  });

  React.useEffect(() => {
    if (query.data) {
      setTasks({
        taskStats: query.data.taskStats,
        upcomingTasks: query.data.upcomingTasks,
        projectProgress: query.data.projectProgress,
        calendarTasks: query.data.calendarTasks,
      });
    }
  }, [query.data, setTasks]);

  return query;
};
