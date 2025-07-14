
'use client';

import { useState, useEffect } from 'react';
import { type Topic, type Subtopic } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenText, Edit, Plus, ArrowUpDown } from 'lucide-react';
import SubtopicItem from './SubtopicItem';
import { useToast } from '@/hooks/use-toast';
import TopicForm from './TopicForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
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
  const [categories, setCategories] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch categories for the edit form
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  const handleTopicFormSuccess = (updatedTopic: Topic) => {
    setTopic(updatedTopic);
    setIsEditing(false);
    toast({
      title: "Topic Updated!",
      description: "Your topic details have been saved.",
    });
  }

  const handleSubtopicFormSuccess = async (newSubtopic: Subtopic) => {
    // We need to fetch the full updated topic to get correct earnings/progress
    const res = await fetch(`/api/topics/${topic.id}`);
    const updatedTopic = await res.json();
    setTopic(updatedTopic);

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
    <div className="space-y-8">
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
                categories={categories}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSubtopics.map(subtopic => (
                <SubtopicItem key={subtopic.id} subtopic={subtopic} />
            ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
