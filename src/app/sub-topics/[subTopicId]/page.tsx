

import { getSubtopicById, getTopicBySubtopicId } from '@/lib/mock-data';
import { type Subtopic, type Topic } from '@/lib/types';
import SubTopicDetailClient from '@/components/topics/SubTopicDetailClient';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';

async function getData(subTopicId: string): Promise<{subtopic: Subtopic, topic: Topic} | null> {
  const subtopic = getSubtopicById(subTopicId);
  const topic = getTopicBySubtopicId(subTopicId);

  if (!subtopic || !topic) {
    return null;
  }
  return { subtopic, topic };
}

export const dynamic = 'force-dynamic';

export default async function SubTopicDetailPage({ params }: { params: { subTopicId: string } }) {
  const data = await getData(params.subTopicId);

  if (!data) {
    notFound();
  }

  const { subtopic, topic } = data;

  return (
    <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 -m-4 md:-m-8">
      <SubTopicDetailClient initialSubtopic={subtopic} topic={topic} />
    </div>
  );
}
