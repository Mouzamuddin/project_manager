


import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { tasks, projects } from "@/app/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const { projectId, categoryId, title, description, priority, dueDate } = await req.json();

  if (!projectId || !title) {
    return NextResponse.json({ error: "Project ID and Title are required" }, { status: 400 });
  }

  const projectExists = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  if (projectExists.length === 0) {
    return NextResponse.json({ error: `Project with ID ${projectId} does not exist` }, { status: 400 });
  }

  const taskData = {
    projectId,
    categoryId,
    title,
    description,
    priority,
    dueDate: dueDate ? new Date(dueDate) : null,
  };

  const newTask = await db.insert(tasks).values(taskData).returning();
  return NextResponse.json(newTask, { status: 201 });
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const categoryId = searchParams.get("categoryId");

  let conditions = [eq(projects.userId, userId)]; 
  if (projectId) conditions.push(eq(tasks.projectId, parseInt(projectId)));
  if (categoryId) conditions.push(eq(tasks.categoryId, parseInt(categoryId)));

  try {
    const userTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description, 
        dueDate: tasks.dueDate,
        priority: tasks.priority,
        completed: tasks.completed,
        projectId: tasks.projectId,
      })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(and(...conditions))
      .orderBy(asc(tasks.dueDate));

    return NextResponse.json(userTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  const { id, dueDate, ...updates } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }

  if (dueDate) {
    updates.dueDate = new Date(dueDate);
  }

  const updatedTask = await db.update(tasks).set(updates).where(eq(tasks.id, id)).returning();
  return NextResponse.json(updatedTask);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }

  await db.delete(tasks).where(eq(tasks.id, id));
  return NextResponse.json({ message: "Task deleted successfully" });
}
