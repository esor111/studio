'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Timer, Target, Quote, TrendingUp, Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Challenge {
  id: string;
  challenge_name: string;
  start_date: string;
  end_date: string;
  ultimate_focus_goal_hours: number;
  is_active: boolean;
}

interface ChallengeProgress {
  countdown_seconds_remaining: number;
  daily_focus_minutes: number;
  is_active_period: boolean;
  daily_quote?: {
    quote_text: string;
    author: string;
    category: string;
  };
}

interface ChallengeStats {
  total_focus_hours: number;
  total_focus_minutes: number;
  ultimate_goal_hours: number;
  progress_percentage: number;
  days_active: number;
  days_remaining: number;
  current_countdown_seconds: number;
  average_daily_minutes: number;
}

const API_BASE_URL = 'http://localhost:7001/api';

export default function ChallengePage() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [progress, setProgress] = useState<ChallengeProgress | null>(null);
  const [stats, setStats] = useState<ChallengeStats | null>(null);
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newGoalHours, setNewGoalHours] = useState<number>(500);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [countdownDisplay, setCountdownDisplay] = useState('');
  const [timeBreakdown, setTimeBreakdown] = useState({ hours: 0, minutes: 0, seconds: 0, milliseconds: '000', totalSeconds: '0', display: '0h 0m 0.000s' });
  const [totalCountdownDisplay, setTotalCountdownDisplay] = useState('');
  const [totalTimeBreakdown, setTotalTimeBreakdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: '000', totalSeconds: '0', display: '0d 0h 0m 0.000s' });
  const [isActiveHours, setIsActiveHours] = useState(false);
  const [dailySecondsRemaining, setDailySecondsRemaining] = useState(0);
  const [totalSecondsRemaining, setTotalSecondsRemaining] = useState(0);
  const [serverTimeOffset, setServerTimeOffset] = useState(0);

  // Format countdown display - show hours, minutes, and seconds with milliseconds
  const formatCountdown = (totalSeconds: number, milliseconds: number = 0) => {
    const seconds = Math.max(0, totalSeconds);
    const ms = Math.max(0, Math.floor(milliseconds));
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const msString = ms.toString().padStart(3, '0');
    
    return {
      hours,
      minutes,
      seconds: remainingSeconds,
      milliseconds: msString,
      totalSeconds: seconds.toLocaleString(),
      display: `${hours}h ${minutes}m ${remainingSeconds}.${msString}s`
    };
  };

  // Format total challenge countdown - show days, hours, minutes, and seconds
  const formatTotalCountdown = (totalSeconds: number, milliseconds: number = 0) => {
    const seconds = Math.max(0, totalSeconds);
    const ms = Math.max(0, Math.floor(milliseconds));
    
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const msString = ms.toString().padStart(3, '0');
    
    return {
      days,
      hours,
      minutes,
      seconds: remainingSeconds,
      milliseconds: msString,
      totalSeconds: seconds.toLocaleString(),
      display: `${days}d ${hours}h ${minutes}m ${remainingSeconds}.${msString}s`
    };
  };

  // Sync with server time
  const syncWithServer = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/challenge/timer/status`);
      if (response.ok) {
        const data = await response.json();
        const serverTime = new Date(data.server_time).getTime();
        const clientTime = Date.now();
        setServerTimeOffset(serverTime - clientTime);
        setDailySecondsRemaining(data.daily_seconds_remaining);
        setTotalSecondsRemaining(data.total_seconds_remaining || 0);
        setIsActiveHours(data.is_active_hours);
        return data;
      }
    } catch (error) {
      console.error('Failed to sync with server:', error);
    }
    return null;
  };

  // Fetch current challenge data
  const fetchChallengeData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/challenge/current`);
      
      if (response.status === 404) {
        setShowCreateForm(true);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch challenge data');
      }

      const data = await response.json();
      setChallenge(data.challenge);
      setProgress(data.progress);
      setIsActiveHours(data.is_active_period);
      
      // Fetch stats
      const statsResponse = await fetch(`${API_BASE_URL}/challenge/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      // Fetch daily quote
      const quoteResponse = await fetch(`${API_BASE_URL}/challenge/quote`);
      if (quoteResponse.ok) {
        const quoteData = await quoteResponse.json();
        setQuote(quoteData);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Create new challenge
  const createChallenge = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/challenge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ultimate_focus_goal_hours: newGoalHours,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create challenge');
      }

      setShowCreateForm(false);
      await fetchChallengeData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create challenge');
    } finally {
      setLoading(false);
    }
  };

  // Robust countdown timer with server sync
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let syncInterval: NodeJS.Timeout;

    const startTimer = async () => {
      // Initial sync with server
      await syncWithServer();

      // Update display every 10ms for smooth countdown
      interval = setInterval(() => {
        const now = Date.now() + serverTimeOffset;
        const currentDate = new Date(now);
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();
        const currentSecond = currentDate.getSeconds();
        const currentMs = currentDate.getMilliseconds();

        // Check if in active hours
        const activeHours = currentHour >= 7 && currentHour < 21;
        setIsActiveHours(activeHours);

        if (activeHours) {
          // Calculate precise time remaining until 9 PM
          const endOfDay = new Date(now);
          endOfDay.setHours(21, 0, 0, 0);
          const msRemaining = endOfDay.getTime() - now;
          const secondsRemaining = Math.floor(msRemaining / 1000);
          const msRemainingDisplay = msRemaining % 1000;

          const timeData = formatCountdown(secondsRemaining, msRemainingDisplay);
          setCountdownDisplay(timeData.display);
          setTimeBreakdown(timeData);
          setDailySecondsRemaining(secondsRemaining);
        } else if (currentHour < 7) {
          // Before active hours - show full 16 hours
          const fullDaySeconds = 16 * 3600;
          const timeData = formatCountdown(fullDaySeconds, 0);
          setCountdownDisplay(timeData.display);
          setTimeBreakdown(timeData);
          setDailySecondsRemaining(fullDaySeconds);
        } else {
          // After active hours - day is over
          const timeData = formatCountdown(0, 0);
          setCountdownDisplay(timeData.display);
          setTimeBreakdown(timeData);
          setDailySecondsRemaining(0);
        }

        // Calculate total challenge time remaining
        if (challenge) {
          const challengeEndDate = new Date(challenge.end_date);
          challengeEndDate.setHours(21, 0, 0, 0); // End at 9 PM on the last day
          const totalMsRemaining = challengeEndDate.getTime() - now;
          const totalSecondsRemainingCalc = Math.max(0, Math.floor(totalMsRemaining / 1000));
          
          setTotalSecondsRemaining(totalSecondsRemainingCalc);
          const totalTimeData = formatTotalCountdown(totalSecondsRemainingCalc, totalMsRemaining % 1000);
          setTotalCountdownDisplay(totalTimeData.display);
          setTotalTimeBreakdown(totalTimeData);
        }
      }, 10); // Update every 10ms for ultra-smooth display

      // Sync with server every 30 seconds to prevent drift
      syncInterval = setInterval(syncWithServer, 30000);
    };

    startTimer();

    return () => {
      if (interval) clearInterval(interval);
      if (syncInterval) clearInterval(syncInterval);
    };
  }, [challenge]); // Add challenge dependency to recalculate when loaded

  // Initial server sync on mount
  useEffect(() => {
    syncWithServer();
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchChallengeData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading challenge data...</div>
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6" />
              Start Your 64-Day Productivity Challenge
            </CardTitle>
            <CardDescription>
              Set your ultimate focus goal and begin your journey to peak productivity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal-hours">Ultimate Focus Goal (Hours)</Label>
              <Input
                id="goal-hours"
                type="number"
                value={newGoalHours}
                onChange={(e) => setNewGoalHours(Number(e.target.value))}
                placeholder="e.g., 500"
                min="1"
                max="1000"
              />
              <p className="text-sm text-muted-foreground">
                This is your total focus hours goal for the entire 64-day period
              </p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Challenge Overview:</h4>
              <ul className="text-sm space-y-1">
                <li>• 64 days of productive time tracking</li>
                <li>• 16 hours per day (7 AM - 9 PM) countdown timer</li>
                <li>• Daily motivational quotes</li>
                <li>• Focus hour tracking with existing timer</li>
                <li>• Real-time progress monitoring</li>
              </ul>
            </div>

            <Button onClick={createChallenge} className="w-full" disabled={loading}>
              {loading ? 'Creating Challenge...' : 'Start 64-Day Challenge'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchChallengeData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">64-Day Productivity Challenge</h1>
        <p className="text-muted-foreground">
          Transform your productivity with focused time tracking and daily motivation
        </p>
        {isActiveHours && progress && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-3 mt-4">
            <p className="text-red-800 font-semibold text-sm animate-pulse">
              ⚠️ URGENT: Every second counts! Your productive time is slipping away...
            </p>
          </div>
        )}
      </div>

      {/* Daily Quote */}
      {quote && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Quote className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <blockquote className="text-lg font-medium text-blue-900 mb-2">
                  "{quote.quote_text}"
                </blockquote>
                <cite className="text-blue-700">— {quote.author}</cite>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {quote.category}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Countdown Timers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* URGENT Daily Countdown Timer */}
        <Card className={`${isActiveHours ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-xl ring-4 ring-red-200 animate-pulse' : 'border-orange-500 bg-orange-50'} transition-all duration-300 overflow-hidden`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium flex items-center gap-2 truncate">
              <Timer className={`h-4 w-4 flex-shrink-0 ${isActiveHours ? 'text-red-600 animate-spin' : 'text-orange-600'}`} />
              <span className={`${isActiveHours ? 'animate-pulse text-red-700' : 'text-orange-700'} font-bold truncate`}>
                ⚡ TODAY'S TIME LEFT
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {/* Main Time Display */}
            <div className={`text-2xl sm:text-3xl font-mono font-black tracking-tight transition-all duration-200 ${
              isActiveHours 
                ? dailySecondsRemaining < 3600 
                  ? 'text-red-800 animate-bounce' 
                  : 'text-red-600'
                : 'text-orange-600'
            }`}>
              {timeBreakdown.hours}h {timeBreakdown.minutes}m {timeBreakdown.seconds}.{timeBreakdown.milliseconds}s
            </div>
            
            {/* Urgent Seconds Display */}
            <div className={`text-lg font-mono font-bold opacity-75 ${
              isActiveHours ? 'text-red-700' : 'text-orange-700'
            }`}>
              ({timeBreakdown.totalSeconds} seconds)
            </div>
            
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wide font-bold">
              TIME LEFT TODAY
            </div>
            
            <p className={`text-xs font-black uppercase tracking-wide ${isActiveHours ? 'text-red-800 animate-pulse' : 'text-orange-700'}`}>
              {isActiveHours ? '🔴 TICKING AWAY!' : '🟡 Paused'}
            </p>
            
            <div className={`h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner ${isActiveHours ? 'animate-pulse' : ''}`}>
              <div 
                className={`h-full transition-all duration-300 ${
                  isActiveHours 
                    ? dailySecondsRemaining < 3600
                      ? 'bg-gradient-to-r from-red-700 to-red-900 animate-pulse shadow-lg'
                      : 'bg-gradient-to-r from-red-500 to-red-700'
                    : 'bg-orange-500'
                }`}
                style={{ 
                  width: `${isActiveHours ? (dailySecondsRemaining / (16 * 3600)) * 100 : 100}%` 
                }}
              />
            </div>
            
            {/* Time-based Alerts */}
            {isActiveHours && timeBreakdown.hours === 0 && timeBreakdown.minutes < 60 && (
              <div className="text-xs text-red-900 font-black animate-bounce bg-red-200 p-1 rounded border border-red-400">
                🚨 Less than {timeBreakdown.minutes + 1} minutes left!
              </div>
            )}
            {isActiveHours && timeBreakdown.hours === 0 && timeBreakdown.minutes === 0 && (
              <div className="text-xs text-red-900 font-black animate-ping bg-red-300 p-1 rounded border-2 border-red-600">
                🚨🚨 FINAL MINUTE! 🚨🚨
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total 64-Day Challenge Countdown */}
        <Card className="border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-100 shadow-lg overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium flex items-center gap-2 truncate">
              <Target className="h-4 w-4 flex-shrink-0 text-purple-600" />
              <span className="text-purple-700 font-bold truncate">
                🎯 TOTAL CHALLENGE TIME
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {/* Main Time Display */}
            <div className="text-2xl sm:text-3xl font-mono font-black tracking-tight text-purple-600">
              {totalTimeBreakdown.days}d {totalTimeBreakdown.hours}h {totalTimeBreakdown.minutes}m {totalTimeBreakdown.seconds}.{totalTimeBreakdown.milliseconds}s
            </div>
            
            {/* Total Seconds Display */}
            <div className="text-lg font-mono font-bold opacity-75 text-purple-700">
              ({totalTimeBreakdown.totalSeconds} seconds)
            </div>
            
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wide font-bold">
              TOTAL TIME LEFT IN CHALLENGE
            </div>
            
            <p className="text-xs font-black uppercase tracking-wide text-purple-800">
              🎯 64-DAY CHALLENGE COUNTDOWN
            </p>
            
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-600"
                style={{ 
                  width: `${totalSecondsRemaining > 0 ? (totalSecondsRemaining / (64 * 16 * 3600)) * 100 : 0}%` 
                }}
              />
            </div>
            
            {/* Challenge Progress Alerts */}
            {totalTimeBreakdown.days < 7 && totalTimeBreakdown.days > 0 && (
              <div className="text-xs text-purple-900 font-black bg-purple-200 p-1 rounded border border-purple-400">
                🎯 Final week of challenge!
              </div>
            )}
            {totalTimeBreakdown.days === 0 && totalTimeBreakdown.hours > 0 && (
              <div className="text-xs text-purple-900 font-black animate-pulse bg-purple-300 p-1 rounded border-2 border-purple-500">
                🎯 FINAL DAY OF CHALLENGE!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Focus Goal Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Focus Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_focus_hours || 0}h / {challenge?.ultimate_focus_goal_hours || 0}h
            </div>
            <Progress 
              value={stats?.progress_percentage || 0} 
              className="mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.progress_percentage?.toFixed(1) || 0}% Complete
            </p>
          </CardContent>
        </Card>

        {/* Today's Focus */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Today's Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor((progress?.daily_focus_minutes || 0) / 60)}h {(progress?.daily_focus_minutes || 0) % 60}m
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: {Math.floor((stats?.average_daily_minutes || 0) / 60)}h {(stats?.average_daily_minutes || 0) % 60}m/day
            </p>
          </CardContent>
        </Card>

        {/* Days Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Challenge Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Day {stats?.days_active || 0} / 64
            </div>
            <Progress 
              value={((stats?.days_active || 0) / 64) * 100} 
              className="mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.days_remaining || 64} days remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Focus Timer Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Focus Timer Integration</CardTitle>
          <CardDescription>
            Use your existing Focus Hour timer to contribute to the 64-day challenge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Focus Hour Activity</p>
              <p className="text-sm text-muted-foreground">
                Timer sessions automatically count toward your daily focus goal
              </p>
            </div>
            <Button asChild>
              <a href="/activities" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Go to Activities
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Challenge Details */}
      {challenge && (
        <Card>
          <CardHeader>
            <CardTitle>Challenge Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Start Date</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(challenge.start_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">End Date</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(challenge.end_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Active Hours</Label>
                <p className="text-sm text-muted-foreground">7:00 AM - 9:00 PM (16 hours/day)</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Total Productive Time</Label>
                <p className="text-sm text-muted-foreground">1,024 hours (64 days × 16 hours)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Control Buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={fetchChallengeData} variant="outline" className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Refresh Data
        </Button>
        <Button onClick={syncWithServer} variant="outline" className="flex items-center gap-2">
          <Timer className="h-4 w-4" />
          Sync Timer
        </Button>
      </div>
      
      {/* Detailed Timer Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Timer Status Info */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Timer Status</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs font-medium">Status</Label>
                <p className={`font-mono font-bold ${isActiveHours ? 'text-green-600' : 'text-orange-600'}`}>
                  {isActiveHours ? 'ACTIVE' : 'PAUSED'}
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium">Daily Progress</Label>
                <p className="font-mono">
                  {isActiveHours ? `${Math.round(((16 * 3600 - dailySecondsRemaining) / (16 * 3600)) * 100)}%` : '0%'}
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium">Hours Used</Label>
                <p className="font-mono">
                  {Math.round((16 * 3600 - dailySecondsRemaining) / 3600 * 10) / 10}h / 16h
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium">Server Sync</Label>
                <p className="font-mono text-green-600">
                  {serverTimeOffset !== 0 ? 'SYNCED' : 'SYNCING...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Time Breakdown */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Today's Time Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs font-medium">Hours Left Today</Label>
                <p className="font-mono text-2xl font-bold text-blue-600">
                  {timeBreakdown.hours}
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium">Minutes Left Today</Label>
                <p className="font-mono text-2xl font-bold text-green-600">
                  {timeBreakdown.minutes}
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium">Seconds Left Today</Label>
                <p className="font-mono text-lg font-bold text-orange-600">
                  {timeBreakdown.seconds}.{timeBreakdown.milliseconds}
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium">Total Seconds Today</Label>
                <p className="font-mono text-sm text-red-600">
                  {timeBreakdown.totalSeconds}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total Challenge Breakdown */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-600" />
            64-Day Challenge Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <Label className="text-xs font-medium">Days Left</Label>
              <p className="font-mono text-3xl font-bold text-purple-600">
                {totalTimeBreakdown.days}
              </p>
            </div>
            <div>
              <Label className="text-xs font-medium">Hours Left</Label>
              <p className="font-mono text-2xl font-bold text-blue-600">
                {totalTimeBreakdown.hours}
              </p>
            </div>
            <div>
              <Label className="text-xs font-medium">Minutes Left</Label>
              <p className="font-mono text-xl font-bold text-green-600">
                {totalTimeBreakdown.minutes}
              </p>
            </div>
            <div>
              <Label className="text-xs font-medium">Total Seconds Left</Label>
              <p className="font-mono text-sm text-red-600 break-all">
                {totalTimeBreakdown.totalSeconds}
              </p>
            </div>
          </div>
          
          {/* Challenge Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Challenge Progress</span>
              <span>{totalSecondsRemaining > 0 ? Math.round(((64 * 16 * 3600 - totalSecondsRemaining) / (64 * 16 * 3600)) * 100) : 100}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 transition-all duration-500"
                style={{ 
                  width: `${totalSecondsRemaining > 0 ? ((64 * 16 * 3600 - totalSecondsRemaining) / (64 * 16 * 3600)) * 100 : 100}%` 
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}