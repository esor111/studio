'use client';

import { Progress } from '@/components/ui/progress';
import { type Subtopic } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import { CheckCircle2, Target } from 'lucide-react';

interface SubtopicItemProps {
  subtopic: Subtopic;
}

export default function SubtopicItem({ subtopic }: SubtopicItemProps) {
  const repsCompleted = subtopic.repsCompleted;
  const repsGoal = subtopic.repsGoal;
  const progress = repsGoal > 0 ? (repsCompleted / repsGoal) * 100 : 0;
  const earnedAmount = subtopic.goalAmount > 0 ? (progress / 100) * subtopic.goalAmount : 0;
  const isCompleted = progress >= 100;

  return (
    <Link href={`/sub-topics/${subtopic.id}`} className="block group">
      <motion.div
        whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="relative overflow-hidden rounded-lg border bg-card text-card-foreground h-full flex flex-col"
      >
        <div className="p-5 flex-grow">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-lg group-hover:text-primary transition-colors pr-4">{subtopic.title}</p>
            {isCompleted && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Done
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Reps: {repsCompleted} / {repsGoal}
          </div>
        </div>

        <div className="bg-muted/40 p-5 mt-auto">
            <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-primary">{Math.round(progress)}%</span>
                 </div>
                <Progress value={progress} className="h-2" aria-label={`Progress for ${subtopic.title}`} />
                <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-green-600">₹{earnedAmount.toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                    <span className="text-muted-foreground text-xs flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        ₹{subtopic.goalAmount.toLocaleString('en-IN')}
                    </span>
                </div>
            </div>
        </div>
      </motion.div>
    </Link>
  );
}
