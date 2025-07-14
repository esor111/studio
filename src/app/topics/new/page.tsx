import TopicForm from "@/components/topics/TopicForm";
import { getCategories as getCategoriesServer } from "@/lib/mock-data";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getCategories(): Promise<string[]> {
    const categories = getCategoriesServer();
    return categories;
}


export default async function NewTopicPage() {
  const categories = await getCategories();

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
        <TopicForm categories={categories} />
      </div>
    </div>
  );
}
