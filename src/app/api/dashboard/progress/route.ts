import { db } from "@/app/db";
import { tasks, projects } from "@/app/db/schema";
import { eq, count, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = Number(session.user.id); 

    const projectProgress = await db
      .select({
        projectId: projects.id,
        projectName: projects.name,
        totalTasks: count(tasks.id).as("total"),
        completedTasks: sql<number>`SUM(CASE WHEN ${tasks.completed} = true THEN 1 ELSE 0 END)`,
      })
      .from(projects)
      .leftJoin(tasks, eq(projects.id, tasks.projectId))
      .where(eq(projects.userId, userId))
      .groupBy(projects.id);

    return Response.json(projectProgress);
  } catch (error) {
    console.error("Error fetching task progress:", error);
    return Response.json({ error: "Failed to fetch task progress" }, { status: 500 });
  }
}
