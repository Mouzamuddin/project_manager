'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'react-hot-toast';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import { useThemeStore } from '@/app/store/themeStore';
import { useSession } from 'next-auth/react';

type Project = {
  id: number;
  userId: number;
  name: string;
  description: string;
  category: string;
  priority: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Development');

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { isDarkMode, toggleDarkMode } = useThemeStore();

  useEffect(() => {
    if (!userId) return;

    const fetchProjects = async () => {
      try {
        const res = await fetch(`/api/projects?userId=${userId}`);
        const data = await res.json();
        if (res.ok) {
          setProjects(data);
        } else {
          toast.error(data.error || 'Failed to fetch projects');
        }
      } catch (error) {
        toast.error('Failed to fetch projects');
      }
    };

    fetchProjects();
  }, [userId]);

  const handleAddProject = async () => {
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name, description, category, priority }),
      });

      const newProject = await res.json();
      if (res.ok) {
        setProjects([...projects, newProject[0]]);
        toast.success('Project added successfully');
        resetForm();
      } else {
        toast.error(newProject.error || 'Failed to add project');
      }
    } catch (error) {
      toast.error('Failed to add project');
    }
  };

  const handleUpdateProject = async () => {
    if (!currentProject) return;

    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentProject.id, name, description, category, priority }),
      });

      const updatedProject = await res.json();
      if (res.ok) {
        setProjects(projects.map(project => project.id === currentProject.id ? updatedProject[0] : project));
        toast.success('Project updated successfully');
        resetForm();
      } else {
        toast.error(updatedProject.error || 'Failed to update project');
      }
    } catch (error) {
      toast.error('Failed to update project');
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setProjects(projects.filter(project => project.id !== id));
        toast.success('Project deleted successfully');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete project');
      }
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleEditClick = (project: Project) => {
    setCurrentProject(project);
    setName(project.name);
    setDescription(project.description);
    setPriority(project.priority);
    setCategory(project.category);
  };

  const resetForm = () => {
    setCurrentProject(null);
    setName('');
    setDescription('');
    setPriority('medium');
    setCategory('Development');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
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

        <main className="flex-grow container mx-auto p-4 space-y-6">
          <h1 className="text-3xl font-bold">Projects</h1>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{currentProject ? 'Edit Project' : 'Add Project'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full" />
              </div>
              <div>
                <Label>Priority</Label>
                <RadioGroup value={priority} onValueChange={setPriority} className="flex flex-col space-y-2">
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
              </div>
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={currentProject ? handleUpdateProject : handleAddProject}>
                {currentProject ? 'Update Project' : 'Add Project'}
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {projects.map((project) => (
              <Card key={project.id} className="shadow-md">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
        <p>{project.description || "No description available"}</p>
      </CardContent>

      <CardContent>
        <p className="font-semibold">Priority: {project.priority}</p>
      </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(project)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteProject(project.id)}>Delete</Button>
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
