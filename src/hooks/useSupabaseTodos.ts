
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Todo } from '@/types/todo'
import { useToast } from '@/hooks/use-toast'

export const useSupabaseTodos = () => {
  const [pomodoroTodos, setPomodoroTodos] = useState<Todo[]>([])
  const [backlogTodos, setBacklogTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  // Load todos from Supabase
  const loadTodos = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error

      const pomodoro = data?.filter(todo => todo.type === 'pomodoro').map(todo => ({
        id: todo.id,
        text: todo.text,
        completed: todo.completed
      })) || []

      const backlog = data?.filter(todo => todo.type === 'backlog').map(todo => ({
        id: todo.id,
        text: todo.text,
        completed: todo.completed
      })) || []

      setPomodoroTodos(pomodoro)
      setBacklogTodos(backlog)
    } catch (error) {
      console.error('Error loading todos:', error)
      toast({
        title: "Error",
        description: "Failed to load todos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadTodos()
    } else {
      setPomodoroTodos([])
      setBacklogTodos([])
      setLoading(false)
    }
  }, [user])

  const addPomodoroTodo = async (text: string) => {
    if (!text.trim() || !user) return

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert({
          text: text.trim(),
          type: 'pomodoro',
          user_id: user.id,
          completed: false
        })
        .select()
        .single()

      if (error) throw error

      const newTodo: Todo = {
        id: data.id,
        text: data.text,
        completed: data.completed
      }

      setPomodoroTodos(prev => [...prev, newTodo])
    } catch (error) {
      console.error('Error adding pomodoro todo:', error)
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive",
      })
    }
  }

  const addBacklogTodo = async (text: string) => {
    if (!text.trim() || !user) return

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert({
          text: text.trim(),
          type: 'backlog',
          user_id: user.id,
          completed: false
        })
        .select()
        .single()

      if (error) throw error

      const newTodo: Todo = {
        id: data.id,
        text: data.text,
        completed: data.completed
      }

      setBacklogTodos(prev => [...prev, newTodo])
    } catch (error) {
      console.error('Error adding backlog todo:', error)
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive",
      })
    }
  }

  const togglePomodoroTodo = async (id: string) => {
    const todo = pomodoroTodos.find(t => t.id === id)
    if (!todo || !user) return

    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setPomodoroTodos(prev => 
        prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      )
    } catch (error) {
      console.error('Error toggling pomodoro todo:', error)
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      })
    }
  }

  const toggleBacklogTodo = async (id: string) => {
    const todo = backlogTodos.find(t => t.id === id)
    if (!todo || !user) return

    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setBacklogTodos(prev => 
        prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      )
    } catch (error) {
      console.error('Error toggling backlog todo:', error)
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      })
    }
  }

  const deletePomodoroTodo = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setPomodoroTodos(prev => prev.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting pomodoro todo:', error)
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      })
    }
  }

  const deleteBacklogTodo = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setBacklogTodos(prev => prev.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting backlog todo:', error)
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      })
    }
  }

  const moveTodo = async (todoId: string, fromType: 'pomodoro' | 'backlog', toType: 'pomodoro' | 'backlog') => {
    if (!user || fromType === toType) return

    try {
      const { error } = await supabase
        .from('todos')
        .update({ type: toType })
        .eq('id', todoId)
        .eq('user_id', user.id)

      if (error) throw error

      // Update local state
      const sourceTodos = fromType === 'pomodoro' ? pomodoroTodos : backlogTodos
      const todo = sourceTodos.find(t => t.id === todoId)
      
      if (todo) {
        if (fromType === 'pomodoro') {
          setPomodoroTodos(prev => prev.filter(t => t.id !== todoId))
          setBacklogTodos(prev => [...prev, todo])
        } else {
          setBacklogTodos(prev => prev.filter(t => t.id !== todoId))
          setPomodoroTodos(prev => [...prev, todo])
        }
      }
    } catch (error) {
      console.error('Error moving todo:', error)
      toast({
        title: "Error",
        description: "Failed to move todo",
        variant: "destructive",
      })
    }
  }

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
    moveTodo,
    loading
  }
}
