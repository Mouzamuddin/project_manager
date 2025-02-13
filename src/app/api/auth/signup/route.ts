import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";


export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))  
    .then(res => res[0]);

  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await hash(password, 10);

  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return NextResponse.json({ message: "User created successfully" }, { status: 201 });
}
