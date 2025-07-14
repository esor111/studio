'use client';

import { useState } from 'react';
import { type DashboardData } from '@/lib/types';
import GlobalGoalCard from './GlobalGoalCard';
import TopicList from './TopicList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign } from 'lucide-react';

interface DashboardClientProps {
  initialData: DashboardData;
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const [data, setData] = useState<DashboardData>(initialData);

  const handleGoalUpdate = (newGoal: number) => {
    setData(prevData => {
      const newProgress = newGoal > 0 ? (prevData.currentEarnings / newGoal) * 100 : 0;
      return {
        ...prevData,
        globalGoal: newGoal,
        progress: newProgress,
      };
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your progress overview.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <GlobalGoalCard goal={data.globalGoal} onGoalUpdate={handleGoalUpdate} />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">${data.currentEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Keep up the great work!</p>
          </CardContent>
        </Card>
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <span className="font-bold text-sm text-primary">{Math.round(data.progress)}%</span>
           </CardHeader>
          <CardContent>
            <Progress value={data.progress} className="h-2" aria-label={`${Math.round(data.progress)}% complete`} />
            <p className="text-xs text-muted-foreground mt-2">Towards your goal of ${data.globalGoal.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <TopicList topics={data.topics} />
    </div>
  );
}
