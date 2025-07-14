import { getTopicById as getTopicByIdServer } from '@/lib/mock-data';
import { type Topic } from '@/lib/types';
import TopicDetailClient from '@/components/topics/TopicDetailClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

async function getTopicData(topicId: string): Promise<Topic | undefined> {
  const data = getTopicByIdServer(topicId);
  return data;
}

export const dynamic = 'force-dynamic';

export default async function TopicDetailPage({ params }: { params: { topicId: string } }) {
  const topicData = await getTopicData(params.topicId);

  if (!topicData) {
    notFound();
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
