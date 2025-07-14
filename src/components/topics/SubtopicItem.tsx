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
  const [repsToAdd, setRepsToAdd] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { toast } = useToast();

  const repsCompleted = subtopic.repsCompleted;
  const repsGoal = subtopic.repsGoal;
  const progress = repsGoal > 0 ? (repsCompleted / repsGoal) * 100 : 0;
  
  const handleLogReps = async () => {
    if (repsToAdd === 0) return;
    setIsSubmitting(true);
    
    try {
        const response = await fetch(`/api/sub-topics/${subtopic.id}/reps`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reps: repsToAdd }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to log reps');
        }

        const resTopic = await fetch(`/api/topics/${topicId}`);
        const updatedTopic = await resTopic.json();
        onRepLogSuccess(updatedTopic);
        
        const oldSetsOf5 = Math.floor(repsCompleted / 5);
        const newSetsOf5 = Math.floor(result.updatedSubtopic.repsCompleted / 5);
        if (newSetsOf5 > oldSetsOf5) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 2000);
        }
        
        setRepsToAdd(1);

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
            <div className="flex items-center gap-1 rounded-md border bg-background p-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setRepsToAdd(v => Math.max(1, v - 1))} disabled={isSubmitting}>
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-bold">{repsToAdd}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setRepsToAdd(v => v + 1)} disabled={isSubmitting}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
          <Button onClick={handleLogReps} disabled={isSubmitting}>Log Reps</Button>
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
