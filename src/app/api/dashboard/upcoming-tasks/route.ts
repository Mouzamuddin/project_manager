import { db } from "@/app/db";
import { tasks, projects } from "@/app/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { eq, and, isNotNull, asc } from "drizzle-orm";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = Number(session.user.id); 

    const upcomingTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        dueDate: tasks.dueDate,
        priority: tasks.priority,
        completed: tasks.completed,
      })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id)) 
      .where(and(isNotNull(tasks.dueDate), eq(projects.userId, userId))) 
      .orderBy(asc(tasks.dueDate))
      .limit(5); 

    return Response.json(upcomingTasks);
  } catch (error) {
    console.error("Error fetching upcoming tasks:", error);
    return Response.json({ error: "Failed to fetch upcoming deadlines" }, { status: 500 });
  }
}
