'use client';

import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { type Topic } from '@/lib/types';
import { Lock, Plus, Trash2, Unlock } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  category: z.string().min(1, 'Please select a category.'),
  moneyPer5Reps: z.coerce.number().min(0, 'This value cannot be negative.'),
  notes: z.string().optional(),
  urls: z.array(z.object({ value: z.string().url('Please enter a valid URL.') })).optional(),
});

type TopicFormValues = z.infer<typeof formSchema>;

interface TopicFormProps {
  topicToEdit?: Topic;
  categories: string[];
  onFormSubmit?: (topic: Topic) => void;
}

export default function TopicForm({ topicToEdit, categories, onFormSubmit }: TopicFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLocked, setIsLocked] = useState(topicToEdit?.isMoneyPer5RepsLocked ?? false);
  const [newUrl, setNewUrl] = useState('');

  const defaultValues: Partial<TopicFormValues> = {
    title: topicToEdit?.title || '',
    category: topicToEdit?.category || '',
    moneyPer5Reps: topicToEdit?.moneyPer5Reps || 0,
    notes: topicToEdit?.notes || '',
    urls: topicToEdit?.urls?.map(u => ({ value: u })) || [],
  };

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'urls',
    control: form.control,
  });

  async function onSubmit(data: TopicFormValues) {
    try {
      const payload = {
        ...data,
        urls: data.urls?.map(u => u.value) || [],
      };
      
      let response: Response;
      if (topicToEdit) {
        response = await fetch(`/api/topics/${topicToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/topics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error(`Failed to ${topicToEdit ? 'update' : 'create'} topic`);
      }

      const result: Topic = await response.json();

      if (onFormSubmit) {
        onFormSubmit(result);
      } else {
        toast({
          title: `Topic ${topicToEdit ? 'Updated' : 'Created'}!`,
          description: `Your topic "${result.title}" has been saved.`,
        });
        router.push(`/topics/${result.id}`);
        router.refresh();
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: `There was a problem saving your topic. Please try again.`,
      });
    }
  }
  
  const handleAddUrl = () => {
    if (newUrl && z.string().url().safeParse(newUrl).success) {
      append({ value: newUrl });
      setNewUrl('');
    } else {
       form.setError("urls", { type: "manual", message: "Please enter a valid URL." });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Topic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Learn Next.js" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="moneyPer5Reps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Money per 5 Reps</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50" {...field} disabled={isLocked} />
                    </FormControl>
                    <Button type="button" variant="outline" size="icon" onClick={() => setIsLocked(!isLocked)}>
                      {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any relevant notes here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <FormLabel>URLs</FormLabel>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  placeholder="https://example.com"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
                <Button type="button" onClick={handleAddUrl}>
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
              <FormMessage>{form.formState.errors.urls?.message}</FormMessage>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {fields.map((field, index) => (
                <Badge key={field.id} variant="secondary" className="flex items-center gap-2 pl-3">
                  {field.value}
                  <button type="button" onClick={() => remove(index)} className="rounded-full hover:bg-muted p-0.5">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save Topic'}
        </Button>
      </form>
    </Form>
  );
}
