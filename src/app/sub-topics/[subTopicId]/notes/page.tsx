
import SubtopicNotesClient from '@/components/topics/SubtopicNotesClient';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { type Subtopic } from '@/lib/types';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

async function getData(subTopicId: string): Promise<Subtopic | null> {
    const res = await fetch(`http://localhost:3001/api/sub-topics/${subTopicId}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
}

export default async function SubtopicNotesPage({ params }: { params: { subTopicId: string } }) {
    const subtopic = await getData(params.subTopicId);

    if (!subtopic) {
        return (
            <div className="text-center">
                 <h1 className="text-2xl font-bold">Sub-Topic not found</h1>
                 <Button asChild className="mt-4">
                     <Link href="/">Back to Dashboard</Link>
                 </Button>
             </div>
         );
    }

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

function NotesSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-9 w-40" />
            <div className="max-w-4xl mx-auto space-y-8">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-80 w-full" />
            </div>
        </div>
    )
}
