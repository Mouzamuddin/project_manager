import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const features = [
  { title: "Task Management", description: "Create, read, update, and delete tasks easily." },
  { title: "Upcoming Deadlines", description: "Stay on top of your deadlines with our dashboard." },
  { title: "Task Categorization", description: "Organize your tasks into categories for better management." },
  { title: "Priority Levels", description: "Assign priority levels to your tasks for better focus." },
  { title: "Responsive Design", description: "Access your tasks on any device with our responsive design." },
];

export default function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
