import Link from 'next/link';
import { type DashboardData } from '@/lib/types';
import TopicCard from './TopicCard';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface TopicListProps {
  topics: DashboardData['topics'];
}

export default function TopicList({ topics }: TopicListProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold font-headline">Your Topics</h2>
        <Button asChild>
          <Link href="/topics/new">
            <Plus className="mr-2" />
            New Topic
          </Link>
        </Button>
      </div>
      {topics.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {topics.map(topic => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <h3 className="font-semibold">No Topics Yet</h3>
            <p className="text-muted-foreground text-sm mt-1">Create a new topic to start tracking your goals.</p>
             <Button asChild className="mt-4">
              <Link href="/topics/new">
                <Plus className="mr-2" />
                Create Topic
              </Link>
            </Button>
        </div>
      )}
    </div>
  );
}
