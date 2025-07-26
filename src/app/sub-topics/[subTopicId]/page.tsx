
import SubTopicDetailClient from '@/components/topics/SubTopicDetailClient';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { type Subtopic, type Topic } from '@/lib/types';
import Link from 'next/link';

async function getData(subTopicId: string): Promise<{subtopic: Subtopic, topic: Topic} | null> {
    try {
        // OPTIMIZATION 1: Fetch subtopic and dashboard data in parallel
        const [subtopicRes, dashboardRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sub-topics/${subTopicId}`, { cache: 'no-store' }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, { cache: 'no-store' })
        ]);

        if (!subtopicRes.ok || !dashboardRes.ok) return null;
        
        const [subtopic, dashboard] = await Promise.all([
            subtopicRes.json(),
            dashboardRes.json()
        ]);

        // OPTIMIZATION 2: Fetch all topics in parallel instead of sequentially
        const topicPromises = dashboard.topics.map((topicSummary: { id: string }) => 
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/topics/${topicSummary.id}`, { cache: 'no-store' })
                .then(res => res.ok ? res.json() : null)
                .catch(() => null)
        );
        
        const allTopics = await Promise.all(topicPromises);
        
        // OPTIMIZATION 3: Find the topic that contains this subtopic (early exit)
        const topic = allTopics.find((fullTopic: Topic | null) => 
            fullTopic && fullTopic.subtopics.some(st => st.id === subTopicId)
        );
        
        if (!topic) return null;
        
        return { subtopic, topic };
    } catch (error) {
        console.error('Error fetching subtopic data:', error);
        return null;
    }
}

export default async function SubTopicDetailPage({ params }: { params: Promise<{ subTopicId: string }> }) {
  const { subTopicId } = await params;
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

function SubTopicDetailSkeleton() {
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
