import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { type DashboardData } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface TopicCardProps {
  topic: DashboardData['topics'][0];
}

export default function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link href={`/topics/${topic.id}`} className="block group">
      <Card className="h-full flex flex-col transition-all duration-200 ease-in-out group-hover:border-primary/80 group-hover:shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <Badge variant="secondary">{topic.category}</Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
          </div>
          <CardTitle className="font-headline pt-2">{topic.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(topic.completionPercentage)}%</span>
            </div>
            <Progress value={topic.completionPercentage} className="h-2" aria-label={`${Math.round(topic.completionPercentage)}% complete`} />
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-md font-semibold text-primary">${topic.earnings.toLocaleString()} earned from this topic</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
