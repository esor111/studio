'use client';

import { useState } from 'react';
import { type Subtopic } from '@/lib/types';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Plus, Trash2 } from 'lucide-react';

const formSchema = z.object({
  notes: z.string().optional(),
  urls: z.array(z.object({ value: z.string().url('Please enter a valid URL.') })).optional(),
});

type NotesFormValues = z.infer<typeof formSchema>;

interface SubtopicNotesClientProps {
  subtopic: Subtopic;
}

export default function SubtopicNotesClient({ subtopic }: SubtopicNotesClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [newUrl, setNewUrl] = useState('');

  const form = useForm<NotesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: subtopic.notes || '',
      urls: subtopic.urls?.map(u => ({ value: u })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'urls',
    control: form.control,
  });

  async function onSubmit(data: NotesFormValues) {
    setIsSaving(true);
    try {
        const payload = {
            ...data,
            urls: data.urls?.map(u => u.value) || [],
          };

      const response = await fetch(`/api/sub-topics/${subtopic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save. Please try again.');
      }
      
      const result = await response.json();
      // Reset form with new data to ensure consistency
      form.reset({
          notes: result.subTopic.notes,
          urls: result.subTopic.urls.map((u: string) => ({value: u}))
      });

      toast({
        title: 'Saved!',
        description: 'Your notes and URLs have been updated successfully.',
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
    <Card className="max-w-4xl mx-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold font-headline">Notes & Resources for "{subtopic.title}"</CardTitle>
                    <CardDescription>
                        This is your dedicated space. Add thoughts, research, and resource links. The content will be saved automatically when you hit the save button.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xl font-semibold font-headline">Notes</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Start typing your notes here..."
                                        className="min-h-[50vh] text-base"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <div>
                        <FormLabel className="text-xl font-semibold font-headline">Resource URLs</FormLabel>
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
                            <Plus className="h-4 w-4" /> Add URL
                            </Button>
                        </div>
                        <FormMessage>{form.formState.errors.urls?.message}</FormMessage>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                        {fields.map((field, index) => (
                            <Badge key={field.id} variant="secondary" className="flex items-center gap-2 pl-3 py-1 text-sm">
                            {field.value}
                            <button type="button" onClick={() => remove(index)} className="rounded-full hover:bg-muted p-0.5">
                                <Trash2 className="h-3 w-3" />
                            </button>
                            </Badge>
                        ))}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Notes & URLs'}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}