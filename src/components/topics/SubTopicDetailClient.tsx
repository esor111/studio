'use client'

// ----- Milestone helpers -----
// Each sub-topic always has 18 reps. We want to know how much is *actually* earned
// after crossing whole ₹1000 blocks. These pure helpers keep the math in one
// place so the UI and side-effects can stay unchanged.
const perRepValue = (goal: number) => goal / 18;
const milestoneEarned = (reps: number, goal: number) => {
  if (goal <= 0) return 0;
  const total = perRepValue(goal) * reps;
  return Math.floor(total / 1000) * 1000; // 0,1000,2000,…
};

import { useState, useEffect } from 'react';
import { type Subtopic, type Topic, type DashboardData } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import CustomConfetti from './Confetti';
import FlyingNote from './FlyingNote';
import MoneyStack from './MoneyStack';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ChevronLeft, Edit, Link2, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import SubtopicForm from './SubtopicForm';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

// Custom Toast Component
const Toast = ({ message, type, isVisible, onClose }: { message: string, type: string, isVisible: boolean, onClose: () => void }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.5 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg font-bold text-white shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface SubTopicDetailClientProps {
    initialSubtopic: Subtopic;
    topic: Topic;
}

export default function SubTopicDetailClient({ initialSubtopic, topic: initialTopic }: SubTopicDetailClientProps) {
    const [subtopic, setSubtopic] = useState<Subtopic>(initialSubtopic);
    const [topic, setTopic] = useState<Topic>(initialTopic);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

    const [flyingNote, setFlyingNote] = useState({ isVisible: false, type: 'fly-in' });
    const [showConfetti, setShowConfetti] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
    const { toast: shadToast } = useToast();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const res = await fetch('/api/dashboard');
            const data = await res.json();
            setDashboardData(data);
        }
        fetchDashboardData();
    }, []); // Fetch only once on mount
    
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ isVisible: true, message, type });
    };

    const hideToast = () => {
        setToast({ ...toast, isVisible: false });
    };

    const playSound = (type: 'earn' | 'un-earn') => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            if (type === 'earn') {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } else if (type === 'un-earn') {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            }
        } catch (error) {
            console.log('Audio not supported in this environment');
        }
    };

    const handleRepAction = async (reps: 1 | -1) => {
        if (isLoading || !dashboardData) return;
        setIsLoading(true);
        
        try {
            const response = await fetch(`/api/sub-topics/${subtopic.id}/reps`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reps }),
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update rep count');
            }
            
            const updatedSubtopic: Subtopic = result.updatedSubtopic;
            const updatedTopic: Topic = result.updatedTopic;

            const oldEarnedAmount = milestoneEarned(subtopic.repsCompleted, updatedSubtopic.goalAmount);
            const newEarnedAmount = milestoneEarned(updatedSubtopic.repsCompleted, updatedSubtopic.goalAmount);
            const moneyDiff = newEarnedAmount - oldEarnedAmount;

            // Client-side state synchronization
            const updateState = () => {
                setSubtopic(updatedSubtopic);
                setTopic(updatedTopic);
                setDashboardData(prevData => {
                    if (!prevData) return null;
                    const newCurrentEarnings = prevData.currentEarnings + moneyDiff;
                    const newProgress = prevData.globalGoal > 0 ? (newCurrentEarnings / prevData.globalGoal) * 100 : 0;
                    return {
                        ...prevData,
                        currentEarnings: newCurrentEarnings,
                        progress: newProgress,
                    };
                });
            };

            if (reps > 0 && moneyDiff > 0) {
                setFlyingNote({ isVisible: true, type: 'fly-in' });
                playSound('earn');
                showToast(`+ ₹${moneyDiff.toFixed(2)} earned!`, 'success');
                setTimeout(updateState, 1500);
            } else if (reps < 0 && moneyDiff < 0) {
                updateState();
                setFlyingNote({ isVisible: true, type: 'fly-out' });
                playSound('un-earn');
                showToast(`- ₹${Math.abs(moneyDiff).toFixed(2)} removed!`, 'error');
            } else {
                 updateState();
            }

            if (updatedSubtopic.repsCompleted === 18 && subtopic.repsCompleted < 18) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
            }

        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnimationComplete = () => {
        setFlyingNote({ ...flyingNote, isVisible: false });
    };

    const handleSubtopicFormSuccess = (updatedSubtopic: Subtopic) => {
        const oldEarnedAmount = milestoneEarned(subtopic.repsCompleted, updatedSubtopic.goalAmount);
        setSubtopic(updatedSubtopic);

        // Recalculate everything after goal amount changes
        const newEarnedAmount = milestoneEarned(updatedSubtopic.repsCompleted, updatedSubtopic.goalAmount);
        const moneyDiff = newEarnedAmount - oldEarnedAmount;

        setDashboardData(prevData => {
            if (!prevData) return null;
            const newCurrentEarnings = prevData.currentEarnings + moneyDiff;
            const newProgress = prevData.globalGoal > 0 ? (newCurrentEarnings / prevData.globalGoal) * 100 : 0;
            return { ...prevData, currentEarnings: newCurrentEarnings, progress: newProgress };
        });

        // We also need to refetch the topic to get its recalculated earnings
         fetch(`/api/topics/${topic.id}`)
            .then(res => res.json())
            .then(updatedTopic => setTopic(updatedTopic));


        setIsEditOpen(false);
        shadToast({
          title: "Sub-topic Updated!",
          description: `"${updatedSubtopic.title}" has been saved.`,
        });
      }

    const progressPercentage = subtopic.repsGoal > 0 ? (subtopic.repsCompleted / subtopic.repsGoal) * 100 : 0;
    const earnedAmount = milestoneEarned(subtopic.repsCompleted, subtopic.goalAmount);
    const stackLayers = earnedAmount / 1000;
    const maxLayers = subtopic.goalAmount / 1000;


    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-8">
            <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
            <CustomConfetti isVisible={showConfetti} />
            <FlyingNote isVisible={flyingNote.isVisible} type={flyingNote.type} onComplete={handleAnimationComplete} />

            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                     <div className="flex justify-between items-center">
                        <Button asChild variant="ghost">
                            <Link href={`/topics/${topic.id}`}>
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Back to Topic
                            </Link>
                        </Button>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Sub-Topic Tracker
                        </h1>
                         <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Details
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Edit Sub-topic</DialogTitle>
                                </DialogHeader>
                                <SubtopicForm 
                                    topicId={topic.id} 
                                    subtopicToEdit={subtopic} 
                                    onFormSubmit={handleSubtopicFormSuccess} 
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                   {dashboardData && (
                     <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md mt-4 w-full">
                        <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
                            <div>
                                <div className="text-xl sm:text-2xl font-bold text-green-600">₹{dashboardData.currentEarnings.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                                <div className="text-xs sm:text-sm text-gray-500">Current Money</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-bold text-blue-600">₹{dashboardData.globalGoal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                                <div className="text-xs sm:text-sm text-gray-500">Global Goal</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-bold text-purple-600">{Math.round(dashboardData.progress)}%</div>
                                <div className="text-xs sm:text-sm text-gray-500">Progress</div>
                            </div>
                        </div>
                        <div className="mt-4 bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${dashboardData.progress}%` }}
                            />
                        </div>
                    </div>
                   )}
                </header>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 sm:p-8 mb-8 border">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{subtopic.title}</h2>
                            <div className="space-y-4">
                               <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        progressPercentage === 100 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {progressPercentage === 100 ? 'Completed' : 'In-progress'}
                                    </span>
                                </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Repetitions:</span>
                                    <span className="text-2xl font-bold text-gray-800">{subtopic.repsCompleted}/{subtopic.repsGoal}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Sub-Topic Goal:</span>
                                    <span className="text-lg font-semibold text-green-600">₹{subtopic.goalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Earned Amount:</span>
                                    <span className="text-lg font-semibold text-green-600">₹{earnedAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                </div>

                                <div className="bg-gray-200 rounded-full h-3 mt-2">
                                    <div
                                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleRepAction(1)}
                                    disabled={isLoading || subtopic.repsCompleted >= subtopic.repsGoal}
                                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed shadow-md"
                                >
                                    {isLoading ? '...' : '+ Rep'}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleRepAction(-1)}
                                    disabled={isLoading || subtopic.repsCompleted <= 0}
                                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed shadow-md"
                                >
                                    {isLoading ? '...' : '– Rep'}
                                </motion.button>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Money Stack</h3>
                            <div className="bg-gray-100 rounded-lg p-8 min-h-[200px] w-full flex items-center justify-center border-2 border-gray-200">
                                <MoneyStack stackLayers={stackLayers} />
                            </div>
                            <div className="mt-4 text-center">
                                <div className="text-sm text-gray-600">Stack Layers: {stackLayers}/{maxLayers}</div>
                                <div className="text-xs text-gray-500 mt-1">Each layer represents ₹1000</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-800">
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>Notes</CardTitle>
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/sub-topics/${subtopic.id}/notes`}>
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    View & Edit Notes
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="whitespace-pre-wrap text-gray-700 line-clamp-4">
                            {subtopic.notes || <span className="text-gray-500">No notes yet. Click to add some.</span>}
                        </CardContent>
                    </Card>

                    {(subtopic.urls && subtopic.urls.length > 0) && (
                        <Card>
                             <CardHeader>
                                <CardTitle>Resources</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                {subtopic.urls.map((url, index) => (
                                    <li key={index}>
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline break-all">
                                        <Link2 className="h-4 w-4 shrink-0" />
                                        <span>{url}</span>
                                    </a>
                                    </li>
                                ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

    