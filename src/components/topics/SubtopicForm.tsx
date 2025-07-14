'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { type Subtopic } from '@/lib/types';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/badge';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  goalAmount: z.coerce.number().min(0, 'Goal amount cannot be negative.'),
  notes: z.string().optional(),
  urls: z.array(z.object({ value: z.string().url('Please enter a valid URL.') })).optional(),
});

type SubtopicFormValues = z.infer<typeof formSchema>;

interface SubtopicFormProps {
  topicId: string;
  subtopicToEdit?: Subtopic;
  onFormSubmit: (subtopic: Subtopic) => void;
}

export default function SubtopicForm({ topicId, subtopicToEdit, onFormSubmit }: SubtopicFormProps) {
  const { toast } = useToast();
  const [newUrl, setNewUrl] = useState('');

  const defaultValues: Partial<SubtopicFormValues> = {
    title: subtopicToEdit?.title || '',
    goalAmount: subtopicToEdit?.goalAmount || 0,
    notes: subtopicToEdit?.notes || '',
    urls: subtopicToEdit?.urls?.map(u => ({ value: u })) || [],
  };

  const form = useForm<SubtopicFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'urls',
    control: form.control,
  });

  async function onSubmit(data: SubtopicFormValues) {
    try {
      const payload = {
        ...data,
        urls: data.urls?.map(u => u.value) || [],
      };

      let response: Response;
      let result;

      if (subtopicToEdit) {
        response = await fetch(`/api/sub-topics/${subtopicToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        result = await response.json();
        onFormSubmit(result.subTopic);
      } else {
        response = await fetch(`/api/topics/${topicId}/sub-topics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        result = await response.json();
        onFormSubmit(result.subTopic);
        form.reset();
      }
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save subtopic');
      }

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || `There was a problem saving your subtopic. Please try again.`,
      });
    }
  }

  const handleAddUrl = () => {
    if (newUrl && z.string().url().safeParse(newUrl).success) {
      append({ value: newUrl });
      setNewUrl('');
      form.clearErrors('urls');
    } else {
       form.setError("urls", { type: "manual", message: "Please enter a valid URL." });
    }
  };

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
        <FormField
          control={form.control}
          name="goalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Amount (₹)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 180" {...field} />
              </FormControl>
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
        <div>
          <FormLabel>URLs</FormLabel>
          <div className="flex items-center gap-2 mt-2">
            <Input
              placeholder="https://example.com"
              value={newUrl}
              onChange={(e) => {
                setNewUrl(e.target.value);
                if (form.formState.errors.urls) {
                  form.clearErrors('urls');
                }
              }}
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
        <p className="text-sm text-muted-foreground">
            All subtopics have a fixed goal of 18 repetitions.
        </p>
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? 'Saving...' : 'Save Subtopic'}
        </Button>
      </form>
    </Form>
  );
}
