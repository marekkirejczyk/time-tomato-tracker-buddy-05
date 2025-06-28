
import { useState, useEffect } from 'react';
import { Todo } from '@/types/todo';

export const useTodos = () => {
  const [pomodoroTodos, setPomodoroTodos] = useState<Todo[]>([]);
  const [backlogTodos, setBacklogTodos] = useState<Todo[]>([]);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedPomodoroTodos = localStorage.getItem('pomodoro-todos');
    const savedBacklogTodos = localStorage.getItem('backlog-todos');
    
    if (savedPomodoroTodos) {
      try {
        setPomodoroTodos(JSON.parse(savedPomodoroTodos));
      } catch (error) {
        console.error('Failed to parse saved pomodoro todos:', error);
      }
    }
    
    if (savedBacklogTodos) {
      try {
        setBacklogTodos(JSON.parse(savedBacklogTodos));
      } catch (error) {
        console.error('Failed to parse saved backlog todos:', error);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('pomodoro-todos', JSON.stringify(pomodoroTodos));
  }, [pomodoroTodos]);

  useEffect(() => {
    localStorage.setItem('backlog-todos', JSON.stringify(backlogTodos));
  }, [backlogTodos]);

  const addPomodoroTodo = (text: string) => {
    if (text.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
      };
      setPomodoroTodos([...pomodoroTodos, todo]);
    }
  };

  const addBacklogTodo = (text: string) => {
    if (text.trim()) {
      const todo: Todo = {
        id: (Date.now() + 1).toString(), // +1 to avoid ID collision
        text: text.trim(),
        completed: false,
      };
      setBacklogTodos([...backlogTodos, todo]);
    }
  };

  const togglePomodoroTodo = (id: string) => {
    setPomodoroTodos(pomodoroTodos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const toggleBacklogTodo = (id: string) => {
    setBacklogTodos(backlogTodos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deletePomodoroTodo = (id: string) => {
    setPomodoroTodos(pomodoroTodos.filter(todo => todo.id !== id));
  };

  const deleteBacklogTodo = (id: string) => {
    setBacklogTodos(backlogTodos.filter(todo => todo.id !== id));
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
  };
};
