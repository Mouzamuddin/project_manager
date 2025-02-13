import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { projects } from '@/app/db/schema';
import { eq } from 'drizzle-orm';


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, name, description, category, priority } = body;

    if (!userId || !name) {
      console.error("Missing required fields:", { userId, name });  
      return NextResponse.json({ error: 'User ID and Project Name are required' }, { status: 400 });
    }

    const newProject = await db.insert(projects).values({
      userId,
      name,
      description,
      category,
      priority,
    }).returning();

    return NextResponse.json(newProject, { status: 201 });

  } catch (error) {
    console.error("Error processing request:", error);  
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const userProjects = await db.select().from(projects).where(eq(projects.userId, parseInt(userId)));
  return NextResponse.json(userProjects);
}

export async function PUT(req: Request) {
  const { id, name, description, category, priority } = await req.json();

  if (!id || !name) {
    return NextResponse.json({ error: 'Project ID and new name are required' }, { status: 400 });
  }

  const updatedProject = await db.update(projects).set({ name, description, category, priority }).where(eq(projects.id, id)).returning();
  return NextResponse.json(updatedProject);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  await db.delete(projects).where(eq(projects.id, id));
  return NextResponse.json({ message: 'Project deleted successfully' });
}
