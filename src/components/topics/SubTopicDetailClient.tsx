'use client'

import { useState } from 'react';
import { type Subtopic, type Topic } from '@/lib/types';
import SubtopicForm from './SubtopicForm';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Link2 } from 'lucide-react';

interface SubTopicDetailClientProps {
    initialSubtopic: Subtopic;
    topic: Topic;
}

export default function SubTopicDetailClient({ initialSubtopic, topic }: SubTopicDetailClientProps) {
    const [subtopic, setSubtopic] = useState<Subtopic>(initialSubtopic);
    const { toast } = useToast();

    const handleFormSubmit = (updatedSubtopic: Subtopic) => {
        setSubtopic(updatedSubtopic);
        toast({
            title: "Subtopic Updated",
            description: "Your changes have been saved."
        });
    }

    return (
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl">{subtopic.title}</CardTitle>
                        <CardDescription>Part of topic: {topic.title}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SubtopicForm topicId={topic.id} subtopicToEdit={subtopic} onFormSubmit={handleFormSubmit} />
                    </CardContent>
                </Card>
            </div>
             <div className="space-y-6">
                 {subtopic.urls && subtopic.urls.length > 0 && (
                    <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                        {subtopic.urls.map((url, index) => (
                            <li key={index}>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline break-all">
                                <Link2 className="h-4 w-4 shrink-0" />
                                <span>{url}</span>
                            </a>
                            </li>
                        ))}
                        </ul>
                    </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
