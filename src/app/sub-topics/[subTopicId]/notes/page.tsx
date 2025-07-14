
import { getSubtopicById, getTopicBySubtopicId } from '@/lib/mock-data';
import { type Subtopic, type Topic } from '@/lib/types';
import SubtopicNotesClient from '@/components/topics/SubtopicNotesClient';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

async function getData(subTopicId: string): Promise<{subtopic: Subtopic, topic: Topic} | null> {
  const subtopic = getSubtopicById(subTopicId);
  const topic = getTopicBySubtopicId(subTopicId);

  if (!subtopic || !topic) {
    return null;
  }
  return { subtopic, topic };
}

export default async function SubtopicNotesPage({ params }: { params: { subTopicId: string } }) {
    const data = await getData(params.subTopicId);

    if (!data) {
        notFound();
    }

    const { subtopic, topic } = data;

    return (
        <div className="space-y-6">
            <div>
                <Button asChild variant="ghost" className="pl-0">
                    <Link href={`/sub-topics/${params.subTopicId}`}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Sub-Topic
                    </Link>
                </Button>
            </div>
            <SubtopicNotesClient subtopic={subtopic} />
        </div>
    );
}
