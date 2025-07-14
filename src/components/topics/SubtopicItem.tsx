
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { type Subtopic, type Topic } from '@/lib/types';
import { Minus, Plus, PartyPopper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SubtopicItemProps {
  subtopic: Subtopic;
  topicId: string;
  onRepLogSuccess: (updatedTopic: Topic) => void;
}

export default function SubtopicItem({ subtopic, topicId, onRepLogSuccess }: SubtopicItemProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { toast } = useToast();

  const repsCompleted = subtopic.repsCompleted;
  const repsGoal = subtopic.repsGoal;
  const progress = repsGoal > 0 ? (repsCompleted / repsGoal) * 100 : 0;
  
  const handleLogRep = async (reps: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
        const response = await fetch(`/api/sub-topics/${subtopic.id}/reps`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reps: reps }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to log reps');
        }

        onRepLogSuccess(result.updatedTopic);
        
        const oldSetsOf5 = Math.floor(repsCompleted / 5);
        const newSetsOf5 = Math.floor(result.updatedSubtopic.repsCompleted / 5);

        if (reps > 0 && newSetsOf5 > oldSetsOf5) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 2000);
        }

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error logging reps',
            description: error.message,
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-card-foreground/5 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-grow">
          <p className="font-semibold">{subtopic.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <Progress value={progress} className="h-2 w-full" aria-label={`Progress for ${subtopic.title}`} />
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{repsCompleted} / {repsGoal}</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleLogRep(-1)} disabled={isSubmitting || repsCompleted <= 0}>
                <Minus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleLogRep(1)} disabled={isSubmitting || repsCompleted >= repsGoal}>
                <Plus className="h-4 w-4" />
            </Button>
        </div>
      </div>
       {showCelebration && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <PartyPopper className={cn(
             "h-16 w-16 text-accent",
             "animate-in fade-in zoom-in-50 slide-in-from-bottom-10",
             "animate-out fade-out zoom-out-50 slide-out-to-top-10"
           )} style={{ animationDuration: '2000ms', animationFillMode: 'forwards' }} />
         </div>
       )}
    </div>
  );
}
