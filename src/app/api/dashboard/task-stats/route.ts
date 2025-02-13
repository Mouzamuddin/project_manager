import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { tasks, projects } from "@/app/db/schema";
import { eq, and, count } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = Number(session.user.id);

    const completedTasks = await db
      .select({ count: count() }) 
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id)) 
      .where(and(eq(tasks.completed, true), eq(projects.userId, userId))); 

    const pendingTasks = await db
      .select({ count: count() }) 
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(and(eq(tasks.completed, false), eq(projects.userId, userId)));

    return NextResponse.json({
      completed: completedTasks[0]?.count || 0,
      pending: pendingTasks[0]?.count || 0,
    });
  } catch (error) {
    console.error("Error fetching task statistics:", error);
    return NextResponse.json({ error: "Failed to fetch task statistics" }, { status: 500 });
  }
}
