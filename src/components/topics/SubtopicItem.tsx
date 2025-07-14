'use client';

import { Progress } from '@/components/ui/progress';
import { type Subtopic } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface SubtopicItemProps {
  subtopic: Subtopic;
}

export default function SubtopicItem({ subtopic }: SubtopicItemProps) {
  const repsCompleted = subtopic.repsCompleted;
  const repsGoal = subtopic.repsGoal;
  const progress = repsGoal > 0 ? (repsCompleted / repsGoal) * 100 : 0;

  return (
    <Link href={`/sub-topics/${subtopic.id}`} className="block group">
      <motion.div
        whileHover={{ scale: 1.02, x: 5 }}
        whileTap={{ scale: 0.98 }}
        className="relative overflow-hidden rounded-lg border bg-card-foreground/5 p-4 transition-all hover:bg-card-foreground/10"
      >
        <div className="flex items-center gap-4">
          <div className="flex-grow">
            <p className="font-semibold group-hover:underline">{subtopic.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={progress} className="h-2 w-full" aria-label={`Progress for ${subtopic.title}`} />
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{repsCompleted} / {repsGoal}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
