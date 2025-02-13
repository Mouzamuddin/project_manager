import { db } from './index';
import { users, projects, categories, tasks } from './schema';

async function seed() {
  try {
    // Clear existing data (optional, for clean seeding)
    await db.delete(tasks);
    await db.delete(projects);
    await db.delete(categories);
    await db.delete(users);

    // Insert Users
    const insertedUsers = await db.insert(users).values([
      { name: 'Alice Johnson', email: 'alice@example.com', password: 'password123' },
      { name: 'Bob Smith', email: 'bob@example.com', password: 'password456' },
    ]).returning();

    // Insert Categories
    const insertedCategories = await db.insert(categories).values([
      { name: 'Work' },
      { name: 'Personal' },
      { name: 'Urgent' },
    ]).returning();

    // Insert Projects
    const insertedProjects = await db.insert(projects).values([
      { userId: insertedUsers[0].id, name: 'Project Alpha' },
      { userId: insertedUsers[1].id, name: 'Project Beta' },
    ]).returning();

    // Insert Tasks
    await db.insert(tasks).values([
      {
        projectId: insertedProjects[0].id,
        categoryId: insertedCategories[0].id,
        title: 'Design Wireframes',
        description: 'Create initial wireframes for the app UI.',
        priority: 'high',
        dueDate: new Date('2025-02-15'),
      },
      {
        projectId: insertedProjects[0].id,
        categoryId: insertedCategories[1].id,
        title: 'Write Documentation',
        description: 'Draft the first version of the user manual.',
        priority: 'medium',
        dueDate: new Date('2025-02-20'),
      },
      {
        projectId: insertedProjects[1].id,
        categoryId: insertedCategories[2].id,
        title: 'Fix Critical Bugs',
        description: 'Resolve urgent bugs before the release.',
        priority: 'urgent',
        dueDate: new Date('2025-02-10'),
        completed: false,
      },
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seed();