
'use client';

import { useState, useEffect } from 'react';
import TopicForm from "@/components/topics/TopicForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';

async function getCategories(): Promise<string[]> {
    const res = await fetch('/api/categories');
    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }
    return res.json();
}


export default function NewTopicPage() {
  const [categories, setCategories] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then(data => {
        setCategories(data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
        <div>
         <Button asChild variant="ghost" className="pl-0">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold font-headline mb-6">Create New Topic</h1>
        {isLoading && <TopicFormSkeleton />}
        {error && <div className="text-destructive">Error: {error}</div>}
        {categories && <TopicForm categories={categories} />}
      </div>
    </div>
  );
}

function TopicFormSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
