
import { type Topic } from '@/lib/types';
import TopicDetailClient from '@/components/topics/TopicDetailClient';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

async function getTopicData(topicId: string): Promise<Topic | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/topics/${topicId}`, { cache: 'no-store' });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export default async function TopicDetailPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  const topicData = await getTopicData(topicId);

  if (!topicData) {
    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">Topic not found</h1>
            <Button asChild className="mt-4">
                <Link href="/">Back to Dashboard</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="space-y-6">
       <div>
        <Button asChild variant="ghost" className="pl-0">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <TopicDetailClient initialTopic={topicData} />
    </div>
  );
}

function TopicDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-6 w-1/4 mb-2" />
        <Skeleton className="h-12 w-3/4" />
      </div>
      <Skeleton className="h-80 w-full rounded-lg" />
    </div>
  )
}
