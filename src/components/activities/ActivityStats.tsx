'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Activity as ActivityIcon,
  Timer
} from 'lucide-react';
import { DashboardStats } from '@/lib/types';

interface ActivityStatsProps {
  stats: DashboardStats;
}

export default function ActivityStats({ stats }: ActivityStatsProps) {
  const completionColor = stats.completion_rate >= 80 ? 'text-green-600' : 
                         stats.completion_rate >= 50 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Activities */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
          <ActivityIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_activities}</div>
          <p className="text-xs text-muted-foreground">
            Tracking your progress
          </p>
        </CardContent>
      </Card>

      {/* Today's Reps */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reps Today</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_reps_today}</div>
          <p className="text-xs text-muted-foreground">
            Keep up the momentum!
          </p>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          <Timer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.active_sessions}</div>
          <div className="flex items-center gap-1 mt-1">
            {stats.active_sessions > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                Running
              </Badge>
            )}
            <p className="text-xs text-muted-foreground">
              {stats.active_sessions > 0 ? 'In progress' : 'Ready to start'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Completion Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${completionColor}`}>
            {Math.round(stats.completion_rate)}%
          </div>
          <div className="mt-2 space-y-1">
            <Progress value={stats.completion_rate} className="h-1" />
            <p className="text-xs text-muted-foreground">
              Daily goals progress
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}