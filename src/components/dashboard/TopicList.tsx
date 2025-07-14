import { type DashboardData } from '@/lib/types';
import TopicCard from './TopicCard';

interface TopicListProps {
  topics: DashboardData['topics'];
}

export default function TopicList({ topics }: TopicListProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold font-headline mb-4">Your Topics</h2>
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
        </div>
      )}
    </div>
  );
}
