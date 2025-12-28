'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Target } from 'lucide-react';
import { Activity } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { activityApi } from '@/lib/api';

interface AddActivityDialogProps {
  onActivityAdded: (newActivity: Activity) => void;
}

interface NewActivityForm {
  name: string;
  daily_goal: number;
  weekly_goal: number;
  monthly_goal: number;
  yearly_goal: number;
}

export default function AddActivityDialog({ onActivityAdded }: AddActivityDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<NewActivityForm>({
    name: '',
    daily_goal: 0,
    weekly_goal: 0,
    monthly_goal: 0,
    yearly_goal: 0,
  });
  const { toast } = useToast();

  const handleInputChange = (field: keyof NewActivityForm, value: string) => {
    if (field === 'name') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      const numValue = parseInt(value) || 0;
      setFormData(prev => ({ ...prev, [field]: numValue }));
    }
  };

  const handleAutoCalculate = () => {
    const daily = formData.daily_goal;
    if (daily > 0) {
      setFormData(prev => ({
        ...prev,
        weekly_goal: daily * 7,
        monthly_goal: daily * 30,
        yearly_goal: daily * 365,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Activity name is required.",
        variant: "destructive",
      });
      return;
    }

    if (formData.daily_goal <= 0) {
      toast({
        title: "Validation Error",
        description: "Daily goal must be greater than 0.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Use the real API to create the activity
      const activityData = {
        name: formData.name,
        goals: {
          daily: formData.daily_goal,
          weekly: formData.weekly_goal,
          monthly: formData.monthly_goal,
          yearly: formData.yearly_goal,
        }
      };
      
      const newActivity = await activityApi.create(activityData);
      
      onActivityAdded(newActivity);
      
      toast({
        title: "Activity Added",
        description: `${formData.name} has been added successfully!`,
      });
      
      // Reset form
      setFormData({
        name: '',
        daily_goal: 0,
        weekly_goal: 0,
        monthly_goal: 0,
        yearly_goal: 0,
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating activity:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add activity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      daily_goal: 0,
      weekly_goal: 0,
      monthly_goal: 0,
      yearly_goal: 0,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Activity
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Activity Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Activity Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Running, Writing, Guitar Practice"
              required
            />
          </div>

          {/* Goals Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Set Goals</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoCalculate}
                disabled={formData.daily_goal <= 0}
              >
                Auto Calculate
              </Button>
            </div>

            {/* Daily Goal */}
            <div className="space-y-2">
              <Label htmlFor="daily" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Daily Goal
              </Label>
              <Input
                id="daily"
                type="number"
                min="1"
                value={formData.daily_goal || ''}
                onChange={(e) => handleInputChange('daily_goal', e.target.value)}
                placeholder="Enter daily target"
                required
              />
            </div>

            {/* Weekly Goal */}
            <div className="space-y-2">
              <Label htmlFor="weekly" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Weekly Goal
              </Label>
              <Input
                id="weekly"
                type="number"
                min="0"
                value={formData.weekly_goal || ''}
                onChange={(e) => handleInputChange('weekly_goal', e.target.value)}
                placeholder="Enter weekly target"
              />
            </div>

            {/* Monthly Goal */}
            <div className="space-y-2">
              <Label htmlFor="monthly" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Monthly Goal
              </Label>
              <Input
                id="monthly"
                type="number"
                min="0"
                value={formData.monthly_goal || ''}
                onChange={(e) => handleInputChange('monthly_goal', e.target.value)}
                placeholder="Enter monthly target"
              />
            </div>

            {/* Yearly Goal */}
            <div className="space-y-2">
              <Label htmlFor="yearly" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Yearly Goal
              </Label>
              <Input
                id="yearly"
                type="number"
                min="0"
                value={formData.yearly_goal || ''}
                onChange={(e) => handleInputChange('yearly_goal', e.target.value)}
                placeholder="Enter yearly target"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Adding...' : 'Add Activity'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}