
'use client'; // This page now fetches data on the client side

import { useState, useEffect } from 'react';
import { type Subtopic } from '@/lib/types';
import SubtopicNotesClient from '@/components/topics/SubtopicNotesClient';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

async function getData(subTopicId: string): Promise<Subtopic | null> {
    const res = await fetch(`/api/sub-topics/${subTopicId}`);
    if (!res.ok) return null;
    return res.json();
}

export default function SubtopicNotesPage({ params }: { params: { subTopicId: string } }) {
    const [subtopic, setSubtopic] = useState<Subtopic | null | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      getData(params.subTopicId)
        .then(setSubtopic)
        .catch(err => setError(err.message))
        .finally(() => setIsLoading(false));
    }, [params.subTopicId]);


    if (isLoading) {
      return <NotesSkeleton />;
    }
    
    if (error) {
        return <div className="text-destructive">Error: {error}</div>;
    }

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
