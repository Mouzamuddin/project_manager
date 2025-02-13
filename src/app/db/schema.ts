import { pgTable, serial, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description'), // Added description field
  category: varchar('category', { length: 100 }), // Added category field
  priority: varchar('priority', { length: 50 }).default('medium'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  categoryId: integer('category_id').references(() => categories.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }),
  priority: varchar('priority', { length: 50 }).default('medium'),
  dueDate: timestamp('due_date'),
  completed: boolean('completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});