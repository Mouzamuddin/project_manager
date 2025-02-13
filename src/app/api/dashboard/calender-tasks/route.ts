import { db } from "@/app/db";
import { tasks, projects } from "@/app/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sql, eq } from "drizzle-orm";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = parseInt(session.user.id); 

    const calendarTasks = await db
      .select({
        dueDate: tasks.dueDate,
        tasks: sql`json_agg(json_build_object(
          'id', ${tasks.id},
          'title', ${tasks.title},
          'priority', ${tasks.priority},
          'completed', ${tasks.completed}
        ))`,
      })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id)) 
      .where(eq(projects.userId, userId)) 
      .groupBy(tasks.dueDate);

    return Response.json(calendarTasks);
  } catch (error) {
    return Response.json({ error: "Failed to fetch calendar tasks" }, { status: 500 });
  }
}
