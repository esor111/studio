
'use client'; // This page now fetches data on the client side

import { useState, useEffect } from 'react';
import { type Topic } from '@/lib/types';
import TopicDetailClient from '@/components/topics/TopicDetailClient';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

async function getTopicData(topicId: string): Promise<Topic | undefined> {
  const res = await fetch(`/api/topics/${topicId}`);
  if (!res.ok) {
    if (res.status === 404) return undefined;
    throw new Error('Failed to fetch topic data');
  }
  return res.json();
}

export default function TopicDetailPage({ params }: { params: { topicId: string } }) {
  const [topicData, setTopicData] = useState<Topic | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTopicData(params.topicId)
      .then(data => {
        setTopicData(data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.topicId]);

  if (isLoading) {
    return <TopicDetailSkeleton />;
  }

  if (error) {
    return <div className="text-destructive">Error: {error}</div>;
  }
  
  if (topicData === null || topicData === undefined) {
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
