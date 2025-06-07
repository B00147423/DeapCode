import { ThemeProvider } from "./components/theme-provider";
import { Zap, Users, Trophy, PlayCircle } from "lucide-react";
import { ModeToggle } from "./components/ui/mode-toggle";
import Link from "next/link";
export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background text-foreground">
        <main>
          {/* Hero Section */}
          <section className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/20">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="container px-4 md:px-6 relative z-10">
              <div className="flex flex-col items-center text-center space-y-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                  Code. Compete. Conquer.
                </h1>
                <p className="max-w-[700px] text-muted-foreground text-lg md:text-xl">
                  Solve interactive puzzles, face off in real-time, and become a coding champion. The playground for passionate programmers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                <Link 
          href="/play/test-session" // or any ID
          className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-10 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 cursor-pointer relative z-10"
        >
          <PlayCircle className="mr-2 h-5 w-5" />
          Start Playing
        </Link>

                  <Link 
                    href="/how-it-works"
                    className="inline-flex h-12 items-center justify-center rounded-md border border-input px-10 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground cursor-pointer relative z-10"
                  >
                    Learn How It Works
                  </Link>
                </div>
                {/* Modes / Features Section */}
                <div className="flex flex-wrap justify-center gap-8 text-base text-muted-foreground mt-6">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>Code Puzzles, Challenges & Competitive Matches</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <span>1v1 Duels, Team Battles & Collaborative Mode</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span>Global Leaderboards & Live Tournaments</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Placeholder: Game Preview / Animation */}
          <section className="bg-background py-16 px-4 md:px-8">
            <div className="container mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Preview a Puzzle Challenge</h2>
              <div className="w-full max-w-4xl mx-auto aspect-video bg-muted rounded-xl shadow-lg border border-border overflow-hidden">
                {/* Replace with an image, video, or canvas animation */}
                <img
                  src="/demo-challenge-preview.png"
                  alt="Challenge preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
}
