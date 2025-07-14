'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { type Subtopic } from '@/lib/types';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
});

type SubtopicFormValues = z.infer<typeof formSchema>;

interface SubtopicFormProps {
  topicId: string;
  onFormSubmit: (subtopic: Subtopic) => void;
}

export default function SubtopicForm({ topicId, onFormSubmit }: SubtopicFormProps) {
  const { toast } = useToast();

  const form = useForm<SubtopicFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
    mode: 'onChange',
  });

  async function onSubmit(data: SubtopicFormValues) {
    try {
      const response = await fetch(`/api/topics/${topicId}/sub-topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create subtopic');
      }

      const result = await response.json();
      onFormSubmit(result.subTopic);
      form.reset();
      
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: `There was a problem saving your subtopic. Please try again.`,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtopic Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Read chapter 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-sm text-muted-foreground">
            All subtopics have a fixed goal of 18 repetitions.
        </p>
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? 'Adding...' : 'Add Subtopic'}
        </Button>
      </form>
    </Form>
  );
}
