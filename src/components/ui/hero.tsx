import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section id="hero" className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Manage Your Tasks Effortlessly</h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-8">
        Stay organized and productive with our Personal Task Management System.
      </p>
      <Button size="lg" variant="default" onClick={() => router.push("/auth/signup")}>
        Get Started
      </Button>
    </section>
  );
}
