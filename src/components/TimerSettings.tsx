
import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface TimerSettingsProps {
  workDuration: number;
  breakDuration: number;
  onWorkDurationChange: (duration: number) => void;
  onBreakDurationChange: (duration: number) => void;
}

const TimerSettings = ({
  workDuration,
  breakDuration,
  onWorkDurationChange,
  onBreakDurationChange,
}: TimerSettingsProps) => {
  const [tempWorkDuration, setTempWorkDuration] = useState(workDuration / 60);
  const [tempBreakDuration, setTempBreakDuration] = useState(breakDuration / 60);

  const handleSave = () => {
    onWorkDurationChange(tempWorkDuration * 60);
    onBreakDurationChange(tempBreakDuration * 60);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
          <DialogDescription>
            Adjust your work and break durations to fit your preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="work-duration">Work Duration</Label>
              <span className="text-sm text-muted-foreground">
                {tempWorkDuration} minutes
              </span>
            </div>
            <Slider
              id="work-duration"
              min={1}
              max={60}
              step={1}
              value={[tempWorkDuration]}
              onValueChange={(value) => setTempWorkDuration(value[0])}
              className="w-full"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="break-duration">Break Duration</Label>
              <span className="text-sm text-muted-foreground">
                {tempBreakDuration} minutes
              </span>
            </div>
            <Slider
              id="break-duration"
              min={1}
              max={30}
              step={1}
              value={[tempBreakDuration]}
              onValueChange={(value) => setTempBreakDuration(value[0])}
              className="w-full"
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimerSettings;
