import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import TimerSettings from '@/components/TimerSettings';
import TodoList from '@/components/TodoList';

const Index = () => {
  const [workDuration, setWorkDuration] = useState(25 * 60); // 25 minutes in seconds
  const [breakDuration, setBreakDuration] = useState(5 * 60); // 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Session completed
      if (isBreak) {
        toast({
          title: "Break Over!",
          description: "Ready to get back to work?",
        });
        setIsBreak(false);
        setTimeLeft(workDuration);
      } else {
        setSessionsCompleted(prev => prev + 1);
        toast({
          title: "Pomodoro Complete!",
          description: "Time for a well-deserved break!",
        });
        setIsBreak(true);
        setTimeLeft(breakDuration);
      }
      setIsActive(false);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, isBreak, toast, workDuration, breakDuration]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(workDuration);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleWorkDurationChange = (duration: number) => {
    setWorkDuration(duration);
    if (!isBreak && !isActive) {
      setTimeLeft(duration);
    }
  };

  const handleBreakDurationChange = (duration: number) => {
    setBreakDuration(duration);
    if (isBreak && !isActive) {
      setTimeLeft(duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((breakDuration - timeLeft) / breakDuration) * 100
    : ((workDuration - timeLeft) / workDuration) * 100;

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-800">Pomodoro Timer</h1>
            <TimerSettings
              workDuration={workDuration}
              breakDuration={breakDuration}
              onWorkDurationChange={handleWorkDurationChange}
              onBreakDurationChange={handleBreakDurationChange}
            />
          </div>
          <p className="text-gray-600">Stay focused, stay productive</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Timer Section */}
          <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0">
            <CardContent className="p-8">
              {/* Circular Progress */}
              <div className="relative flex items-center justify-center mb-8">
                <svg width="280" height="280" className="transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="140"
                    cy="140"
                    r="120"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="140"
                    cy="140"
                    r="120"
                    fill="none"
                    stroke={isBreak ? "#10b981" : "#ef4444"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                
                {/* Timer content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-mono font-bold text-gray-800 mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <div className={`text-lg font-medium ${isBreak ? 'text-green-600' : 'text-red-600'}`}>
                    {isBreak ? 'Break Time' : 'Focus Time'}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Sessions: {sessionsCompleted}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={toggleTimer}
                  size="lg"
                  className={`px-8 py-3 rounded-full font-semibold transition-all duration-200 ${
                    isBreak 
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-green-500/25' 
                      : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/25'
                  } hover:scale-105`}
                >
                  {isActive ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={resetTimer}
                  size="lg"
                  variant="outline"
                  className="px-6 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105 border-2"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Status indicator */}
              <div className="mt-6 text-center">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  isActive 
                    ? isBreak 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    isActive 
                      ? isBreak 
                        ? 'bg-green-500 animate-pulse' 
                        : 'bg-red-500 animate-pulse'
                      : 'bg-gray-400'
                  }`} />
                  {isActive 
                    ? isBreak 
                      ? 'Taking a break' 
                      : 'Focusing'
                    : 'Paused'
                  }
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Todo List Section */}
          <TodoList />
        </div>

        {/* Tips */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="mb-1">💡 <strong>Tip:</strong> Add tasks to your todo list and check them off during your focus sessions</p>
          <p>🎯 Complete 4 sessions, then take a longer 15-30 minute break</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
