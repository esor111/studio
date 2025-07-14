
import SubTopicDetailClient from '@/components/topics/SubTopicDetailClient';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { type Subtopic, type Topic } from '@/lib/types';
import Link from 'next/link';

async function getData(subTopicId: string): Promise<{subtopic: Subtopic, topic: Topic} | null> {
    const subtopicRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sub-topics/${subTopicId}`, { cache: 'no-store' });
    if (!subtopicRes.ok) return null;
    const subtopic: Subtopic = await subtopicRes.json();

    let topic: Topic | null = null;
    // We need to find the parent topic. This is a bit inefficient without a dedicated endpoint.
    // In a real app, you might have /api/sub-topics/[id]/details which returns both.
    const dashboardRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, { cache: 'no-store' });
    if (dashboardRes.ok) {
      const dashboard: { topics: { id: string }[] } = await dashboardRes.json();
      for (const topicSummary of dashboard.topics) {
          const topicRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/topics/${topicSummary.id}`, { cache: 'no-store' });
          if (topicRes.ok) {
              const fullTopic: Topic = await topicRes.json();
              if (fullTopic.subtopics.some(st => st.id === subTopicId)) {
                  topic = fullTopic;
                  break;
              }
          }
      }
    }
    
    if (!topic) return null;
    
    return { subtopic, topic };
}

export default async function SubTopicDetailPage({ params: { subTopicId } }: { params: { subTopicId: string } }) {
  const data = await getData(subTopicId);

  if (!data) {
    return (
       <div className="text-center">
            <h1 className="text-2xl font-bold">Sub-Topic not found</h1>
            <Button asChild className="mt-4">
                <Link href="/">Back to Dashboard</Link>
            </Button>
        </div>
    );
  }

  const { subtopic, topic } = data;

  return (
    <div className="-m-4 md:-m-8">
      <SubTopicDetailClient initialSubtopic={subtopic} topic={topic} />
    </div>
  );
}

export function SubTopicDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <div className="flex justify-between items-center">
             <Skeleton className="h-9 w-36" />
             <Skeleton className="h-10 w-48" />
             <Skeleton className="h-9 w-32" />
          </div>
           <Skeleton className="h-28 w-full mt-4 rounded-lg" />
        </header>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    </div>
  )
}
