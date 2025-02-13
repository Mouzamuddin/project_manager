import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CTA() {
  const router = useRouter();

  return (
    <section id="cta" className="container mx-auto px-4 py-16 bg-primary text-primary-foreground text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
      <p className="text-lg mb-8">Sign up now and start managing your tasks efficiently.</p>
      <Button size="lg" variant="default" onClick={() => router.push("/auth/signup")}>
        Sign Up
      </Button>
    </section>
  );
}
