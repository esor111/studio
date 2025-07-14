
'use client';

import { useState } from 'react';
import { type Subtopic } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

const formSchema = z.object({
  notes: z.string().optional(),
});

type NotesFormValues = z.infer<typeof formSchema>;

interface SubtopicNotesClientProps {
  subtopic: Subtopic;
}

export default function SubtopicNotesClient({ subtopic }: SubtopicNotesClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<NotesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: subtopic.notes || '',
    },
  });

  async function onSubmit(data: NotesFormValues) {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/sub-topics/${subtopic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: data.notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to save notes. Please try again.');
      }

      toast({
        title: 'Notes Saved!',
        description: 'Your notes have been updated successfully.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
        <CardHeader>
            <CardTitle className="text-3xl font-bold font-headline">Notes for "{subtopic.title}"</CardTitle>
            <CardDescription>
                This is your dedicated space for notes. Add your thoughts, research, and any other details here. The content will be saved automatically.
            </CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent>
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder="Start typing your notes here..."
                                        className="min-h-[60vh] text-base"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Notes'}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}
