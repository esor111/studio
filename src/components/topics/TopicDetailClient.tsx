'use client';

import { useState } from 'react';
import { type Topic } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2, BookOpenText } from 'lucide-react';
import SubtopicItem from './SubtopicItem';
import { useToast } from '@/hooks/use-toast';

interface TopicDetailClientProps {
  initialTopic: Topic;
}

export default function TopicDetailClient({ initialTopic }: TopicDetailClientProps) {
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const { toast } = useToast();

  const handleRepLogSuccess = (updatedTopic: Topic) => {
    setTopic(updatedTopic);
    toast({
      title: "Reps Logged!",
      description: "Your progress and earnings have been updated.",
    });
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2 space-y-8">
        <div>
          <Badge variant="secondary" className="mb-2">{topic.category}</Badge>
          <h1 className="text-4xl font-bold font-headline">{topic.title}</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <BookOpenText className="h-5 w-5" />
              <span>Subtopics</span>
            </CardTitle>
            <CardDescription>
              Complete reps for subtopics to make progress and earn money towards your goal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topic.subtopics.map(subtopic => (
                <SubtopicItem key={subtopic.id} subtopic={subtopic} topicId={topic.id} onRepLogSuccess={handleRepLogSuccess} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p><strong className="text-muted-foreground">Earnings from topic:</strong> <span className="font-semibold text-primary">${topic.earnings.toLocaleString()}</span></p>
            <p><strong className="text-muted-foreground">Rate:</strong> ${topic.moneyPer5Reps} per 5 reps</p>
            {topic.notes && (
                <div>
                    <strong className="text-muted-foreground">Notes:</strong>
                    <p className="pt-1">{topic.notes}</p>
                </div>
            )}
          </CardContent>
        </Card>

        {topic.urls.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {topic.urls.map((url, index) => (
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
  );
}
