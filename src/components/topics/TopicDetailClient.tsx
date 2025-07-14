'use client';

import { useState } from 'react';
import { type Topic, type Subtopic } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2, BookOpenText, Edit, Plus, ArrowUpDown } from 'lucide-react';
import SubtopicItem from './SubtopicItem';
import { useToast } from '@/hooks/use-toast';
import TopicForm from './TopicForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { getCategories } from '@/lib/mock-data';
import SubtopicForm from './SubtopicForm';

interface TopicDetailClientProps {
  initialTopic: Topic;
}

type SortKey = 'title' | 'status';

export default function TopicDetailClient({ initialTopic }: TopicDetailClientProps) {
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSubtopic, setIsAddingSubtopic] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('title');
  const [sortAsc, setSortAsc] = useState(true);
  const { toast } = useToast();

  const handleRepLogSuccess = (updatedTopic: Topic) => {
    setTopic(updatedTopic);
    toast({
      title: "Reps Logged!",
      description: "Your progress and earnings have been updated.",
    });
  }

  const handleTopicFormSuccess = (updatedTopic: Topic) => {
    setTopic(updatedTopic);
    setIsEditing(false);
    toast({
      title: "Topic Updated!",
      description: "Your topic details have been saved.",
    });
  }

  const handleSubtopicFormSuccess = (newSubtopic: Subtopic) => {
    setTopic(prev => ({
        ...prev,
        subtopics: [...prev.subtopics, newSubtopic]
    }));
    setIsAddingSubtopic(false);
    toast({
      title: "Subtopic Added!",
      description: `"${newSubtopic.title}" has been added to your topic.`,
    });
  }
  
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedSubtopics = [...topic.subtopics].sort((a, b) => {
    let comparison = 0;
    if (sortKey === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortKey === 'status') {
      const progressA = a.repsGoal > 0 ? a.repsCompleted / a.repsGoal : 0;
      const progressB = b.repsGoal > 0 ? b.repsCompleted / b.repsGoal : 0;
      comparison = progressA - progressB;
    }
    return sortAsc ? comparison : -comparison;
  });

  return (
    <>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <div>
            <Badge variant="secondary" className="mb-2">{topic.category}</Badge>
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-bold font-headline">{topic.title}</h1>
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Topic
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Edit Topic</DialogTitle>
                  </DialogHeader>
                  <TopicForm
                    topicToEdit={topic}
                    onFormSubmit={handleTopicFormSuccess}
                    categories={getCategories()}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Card>
            <CardHeader>
               <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 font-headline">
                    <BookOpenText className="h-5 w-5" />
                    <span>Subtopics</span>
                </CardTitle>
                 <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('title')}>
                        Name
                        {sortKey === 'title' && <ArrowUpDown className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleSort('status')}>
                        Status
                        {sortKey === 'status' && <ArrowUpDown className="h-4 w-4" />}
                    </Button>
                     <Dialog open={isAddingSubtopic} onOpenChange={setIsAddingSubtopic}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Subtopic
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                                <DialogTitle>Add New Subtopic</DialogTitle>
                            </DialogHeader>
                            <SubtopicForm topicId={topic.id} onFormSubmit={handleSubtopicFormSuccess} />
                        </DialogContent>
                    </Dialog>
                </div>
              </div>
              <CardDescription>
                Complete reps for subtopics to make progress and earn money towards your goal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedSubtopics.map(subtopic => (
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
    </>
  );
}
