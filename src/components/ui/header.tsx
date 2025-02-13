"use client";

import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ isDarkMode, toggleDarkMode }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Personal Task Management System</h1>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Button
                variant="outline"
                size="sm"
                className="bg-background text-foreground border-border hover:bg-muted"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </li>
            {session ? (
              <li>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background text-foreground border-border hover:bg-muted"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign Out
                </Button>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/auth/signup" className="hover:underline">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-background text-foreground border-border hover:bg-muted"
                    onClick={() => signIn()}
                  >
                    Sign In
                  </Button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
