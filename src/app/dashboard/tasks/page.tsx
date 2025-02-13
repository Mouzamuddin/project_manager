"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-hot-toast";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { useThemeStore } from "@/app/store/themeStore";
import { Sidebar } from "@/components/ui/Sidebar";

type Task = {
  id: number;
  projectId: number;
  categoryId: number | null;
  title: string;
  description?: string;
  priority: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
};

type Project = {
  id: number;
  name: string;
};

export default function TasksPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [completed, setCompleted] = useState(false);
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  const resetForm = () => {
    setCurrentTask(null);
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setCompleted(false);
  };

  const fetchTasks = async () => {
    if (!selectedProjectId) return;
    
    try {
      const res = await fetch(`/api/tasks?projectId=${selectedProjectId}`);
      const data = await res.json();
      if (res.ok) {
        setTasks(data);
      } else {
        throw new Error(data.error || "Failed to fetch tasks");
      }
    } catch (error) {
      toast.error("Failed to fetch tasks");
      setTasks([]);
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchProjects = async () => {
      try {
        const res = await fetch(`/api/projects?userId=${session.user.id}`);
        const data = await res.json();
        if (res.ok) {
          setProjects(data);
          if (data.length > 0) {
            setSelectedProjectId(data[0].id);
          }
        } else {
          throw new Error("Failed to fetch projects");
        }
      } catch (error) {
        toast.error("Failed to fetch projects");
        setProjects([]);
      }
    };

    fetchProjects();
  }, [session]);

  useEffect(() => {
    fetchTasks();
  }, [selectedProjectId]);

  const handleEditClick = (task: Task) => {
    setCurrentTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority);
    setDueDate(task.dueDate || "");
    setCompleted(task.completed);
  };

  const handleDeleteTask = async (id: number) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
        toast.success('Task deleted successfully');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete task');
      }
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleSubmit = async () => {
    if (!selectedProjectId || !title.trim()) {
      toast.error("Project and title are required!");
      return;
    }

    try {
      const method = currentTask ? "PUT" : "POST";
      const body = {
        ...(currentTask && { id: currentTask.id }),
        projectId: selectedProjectId,
        title,
        description,
        priority,
        dueDate: dueDate || null,
        completed,
      };

      const res = await fetch("/api/tasks", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Failed to ${currentTask ? 'update' : 'add'} task`);
      }

      toast.success(`Task ${currentTask ? 'updated' : 'added'} successfully!`);
      
      await fetchTasks();
      resetForm();
    } catch (error) {
      toast.error(`An error occurred while ${currentTask ? 'updating' : 'adding'} the task`);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <div className="flex flex-1">
        <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-4">
          <nav className="space-y-4">
            <a href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              Dashboard
            </a>
            <a href="/dashboard/tasks" className="block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              Tasks
            </a>
            <a href="/dashboard/projects" className="block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              Projects
            </a>
          </nav>
        </aside>

        <main className="flex-grow container mx-auto p-4 space-y-6">
          <h1 className="text-3xl font-bold">Tasks</h1>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{currentTask ? "Edit Task" : "Add Task"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Select Project</Label>
              <Select
                onValueChange={(value) => setSelectedProjectId(Number(value))}
                value={selectedProjectId?.toString() || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />

              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />

              <Label>Due Date</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />

              <Label>Priority</Label>
              <RadioGroup value={priority} onValueChange={setPriority} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">High</Label>
                </div>
              </RadioGroup>

              <div className="flex items-center gap-2">
                <Checkbox checked={completed} onCheckedChange={(checked) => setCompleted(checked === true)} />
                <Label>Completed</Label>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {currentTask ? "Update Task" : "Add Task"}
              </Button>
            </CardFooter>
          </Card>

          <h2 className="text-2xl font-bold">Task List</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {tasks.map((task) => (
              <Card key={task.id} className="shadow-md">
                <CardHeader>
                  <CardTitle>{task.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <p>{task.description || "No description available"}</p>
                </CardContent>

                <CardContent>
                  <p className="font-semibold">Priority: {task.priority}</p>
                  {task.dueDate && (
                    <p className="font-semibold mt-2">
                      Due Date: {formatDate(task.dueDate)}
                    </p>
                  )}
                </CardContent>

                <CardContent>
                  <p className={`font-semibold ${task.completed ? "text-green-500" : "text-red-500"}`}>
                    {task.completed ? "Completed" : "Pending"}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(task)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteTask(task.id)}>
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}