import { Target, Activity, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline mr-6">
          <Target className="h-6 w-6 text-primary" />
          <span>Goal Getter</span>
        </Link>
        
        <nav className="flex items-center gap-4 ml-auto">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Target className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/activities">
            <Button variant="ghost" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Activities
            </Button>
          </Link>
          <Link href="/activities/goals">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Goals
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
