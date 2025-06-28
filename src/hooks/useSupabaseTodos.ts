
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Todo } from '@/types/todo';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useSupabaseTodos = () => {
  const [pomodoroTodos, setPomodoroTodos] = useState<Todo[]>([]);
  const [backlogTodos, setBacklogTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch todos from Supabase
  const fetchTodos = async () => {
    if (!user) return;

    try {
      const { data: pomodoroData, error: pomodoroError } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'pomodoro')
        .order('created_at', { ascending: true });

      const { data: backlogData, error: backlogError } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'backlog')
        .order('created_at', { ascending: true });

      if (pomodoroError) throw pomodoroError;
      if (backlogError) throw backlogError;

      setPomodoroTodos(pomodoroData || []);
      setBacklogTodos(backlogData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch todos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTodos();
    } else {
      setPomodoroTodos([]);
      setBacklogTodos([]);
      setLoading(false);
    }
  }, [user]);

  const addPomodoroTodo = async (text: string) => {
    if (!user || !text.trim()) return;

    const newTodo = {
      text: text.trim(),
      completed: false,
      user_id: user.id,
      type: 'pomodoro'
    };

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([newTodo])
        .select()
        .single();

      if (error) throw error;

      setPomodoroTodos(prev => [...prev, data]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive",
      });
    }
  };

  const addBacklogTodo = async (text: string) => {
    if (!user || !text.trim()) return;

    const newTodo = {
      text: text.trim(),
      completed: false,
      user_id: user.id,
      type: 'backlog'
    };

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([newTodo])
        .select()
        .single();

      if (error) throw error;

      setBacklogTodos(prev => [...prev, data]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive",
      });
    }
  };

  const togglePomodoroTodo = async (id: string) => {
    const todo = pomodoroTodos.find(t => t.id === id);
    if (!todo) return;

    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);

      if (error) throw error;

      setPomodoroTodos(prev =>
        prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const toggleBacklogTodo = async (id: string) => {
    const todo = backlogTodos.find(t => t.id === id);
    if (!todo) return;

    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);

      if (error) throw error;

      setBacklogTodos(prev =>
        prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const deletePomodoroTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPomodoroTodos(prev => prev.filter(t => t.id !== id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    }
  };

  const deleteBacklogTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBacklogTodos(prev => prev.filter(t => t.id !== id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    }
  };

  return {
    pomodoroTodos,
    backlogTodos,
    setPomodoroTodos,
    setBacklogTodos,
    addPomodoroTodo,
    addBacklogTodo,
    togglePomodoroTodo,
    toggleBacklogTodo,
    deletePomodoroTodo,
    deleteBacklogTodo,
    loading,
  };
};
