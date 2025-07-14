import { getSubtopicById, getTopicBySubtopicId } from '@/lib/mock-data';
import { type Subtopic, type Topic } from '@/lib/types';
import SubTopicDetailClient from '@/components/topics/SubTopicDetailClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

async function getData(subTopicId: string, topicId: string): Promise<{subtopic: Subtopic, topic: Topic} | null> {
  const subtopic = getSubtopicById(subTopicId);
  // Ensure the topic is fetched to get parent context like money per rep
  const topic = getTopicBySubtopicId(subTopicId) || getTopicById(topicId);

  if (!subtopic || !topic) {
    return null;
  }
  return { subtopic, topic };
}

export const dynamic = 'force-dynamic';

export default async function SubTopicDetailPage({ params, searchParams }: { params: { subTopicId: string }, searchParams: { topicId: string } }) {
  const data = await getData(params.subTopicId, searchParams.topicId);

  if (!data) {
    notFound();
  }

  const { subtopic, topic } = data;

  return (
    <div className="space-y-6">
       <div>
        <Button asChild variant="ghost" className="pl-0">
          <Link href={`/topics/${topic.id}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Topic: {topic.title}
          </Link>
        </Button>
      </div>
      <SubTopicDetailClient initialSubtopic={subtopic} topic={topic} />
    </div>
  );
}
