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

interface TaskStats {
  completed: number;
  pending: number;
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
  
    const query = useQuery({
      queryKey: ["dashboardData"],
      queryFn: async () => {
        const [taskStats, upcomingTasks, projectProgress, calendarTasksRaw] = await Promise.all([
          fetch("/api/dashboard/task-stats").then((res) => res.json()),
          fetch("/api/dashboard/upcoming-tasks").then((res) => res.json()),
          fetch("/api/dashboard/progress").then((res) => res.json()),
          fetch("/api/dashboard/calender-tasks").then((res) => res.json()),
        ]);
  
        const calendarTasks: CalendarTaskGroup[] = calendarTasksRaw.map((group: any) => ({
          dueDate: group.dueDate,
          tasks: group.tasks.map((task: any) => ({
            id: task.id,
            title: task.title,
            dueDate: task.dueDate,
            priority: task.priority,
          })),
        }));
  
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
  
  
