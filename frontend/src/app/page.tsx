import { ThemeProvider } from "./components/theme-provider";
import { Code2, Zap, Users, Trophy } from "lucide-react";
import { ModeToggle } from "./components/ui/mode-toggle";

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background text-foreground">
        <main>
          <section className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center text-center space-y-8">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Master Coding Challenges.<br />Land Your Dream Job.
                </h1>
                <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl">
                  Join over 3 million developers practicing coding skills, preparing for interviews, and solving challenges.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/register"
                    className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                  >
                    Start Coding
                  </a>
                  <a
                    href="/problems"
                    className="inline-flex h-11 items-center justify-center rounded-md border border-input px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    Explore Problems
                  </a>
                </div>
                <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>2,500+ Problems</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>3M+ Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    <span>Weekly Contests</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
}