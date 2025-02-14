
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { useTaskStore, useFetchDashboardData } from "@/app/store/taskStore";
import { useThemeStore } from "@/app/store/themeStore";

interface Task {
  id: string; 
  title: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  completed: boolean; 
}

interface CalendarTaskGroup {
  dueDate: string;
  tasks: Task[];
}


const DashboardPage = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { taskStats, upcomingTasks, projectProgress, calendarTasks, error } = useTaskStore();
  const { isLoading } = useFetchDashboardData();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const getSelectedTasks = (): Task[] => {
    if (!selectedDate || !Array.isArray(calendarTasks)) {
      return [];
    }

    const matchingGroup = calendarTasks.find(
      (group): group is CalendarTaskGroup =>
        typeof group === "object" &&
        group !== null &&
        "dueDate" in group &&
        "tasks" in group &&
        Array.isArray(group.tasks) &&
        new Date(group.dueDate).toDateString() === selectedDate.toDateString()
    );

    return matchingGroup?.tasks ?? [];
  };

  const selectedTasks = getSelectedTasks();


  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-4">
          <nav className="space-y-4">
            <a href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Dashboard</a>
            <a href="/dashboard/tasks" className="block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Tasks</a>
            <a href="/dashboard/projects" className="block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Projects</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
              {taskStats && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{taskStats.completed + taskStats.pending}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Completed Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-600">{taskStats.pending}</div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
            <div className="grid md:grid-cols-1 gap-4">

{/* Upcoming Tasks Table */}
{upcomingTasks && upcomingTasks.length > 0 && (
  <Card>
    <CardHeader>
      <CardTitle>Upcoming Tasks</CardTitle>
    </CardHeader>
    <CardContent>
      <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800">
            <th className="border p-2 text-left">Task</th>
            <th className="border p-2 text-left">Due Date</th>
            <th className="border p-2 text-left">Priority</th>
          </tr>
        </thead>
        <tbody>
          {upcomingTasks.map((task) => (
            <tr key={task.id} className="border">
              <td className="p-2 border">{task.title}</td>
              <td className="p-2 border">{new Date(task.dueDate).toDateString()}</td>
              <td className="p-2 border">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    task.priority === "high" ? "bg-red-500" : task.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                  }`}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
)}
</div>

            <div className="grid md:grid-cols-2 gap-4">


            {projectProgress && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projectProgress.map((project) => (
                    <div key={project.projectId} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{project.projectName}</span>
                        <span>{Math.round((project.completedTasks / project.totalTasks) * 100)}%</span>
                      </div>
                      <Progress value={(project.completedTasks / project.totalTasks) * 100} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            {/* Calendar View & Selected Task Panel */}
            {calendarTasks && (
  <Card>
    <CardHeader>
      <CardTitle>Task Calendar</CardTitle>
    </CardHeader>
    <CardContent className="flex gap-4">
      {/* Calendar */}
      <Calendar
        mode="single"
        className="rounded-md border"
        selected={selectedDate}
        onSelect={handleDateSelect}
        disabled={(date) => date < new Date()}
        modifiers={{
          hasTasks: calendarTasks.map((group) => new Date(group.dueDate)), 
        }}
        modifiersClassNames={{
          hasTasks: "bg-red-500 text-white rounded-full", 
        }}
      />

      {/* Task List for Selected Date */}
      <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">
          Tasks for {selectedDate ? selectedDate.toDateString() : "Selected Date"}
        </h2>
        {selectedTasks.length > 0 ? (
          <ul className="space-y-2">
            {selectedTasks.map((task) => (
              <li key={task.id} className="p-2 rounded bg-gray-200 dark:bg-gray-700 flex justify-between">
                <span>{task.title}</span>
                <span className={`text-xs px-2 py-1 rounded bg-${task.priority === "high" ? "red" : "yellow"}-500`}>
                  {task.priority}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No tasks for this date.</p>
        )}
      </div>
    </CardContent>
  </Card>
)}

            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;
