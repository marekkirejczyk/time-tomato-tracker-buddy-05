
import { useState } from 'react';
import { Plus, Check, X, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ListTodo className="w-5 h-5" />
          Pomodoro Tasks
          {totalCount > 0 && (
            <span className="text-sm font-normal text-gray-500">
              ({completedCount}/{totalCount})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a task for this session..."
            className="flex-1"
          />
          <Button onClick={addTodo} size="sm" className="px-3">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center py-4 text-sm">
              Add tasks to focus on during your Pomodoro session
            </p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                  todo.completed 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Button
                  onClick={() => toggleTodo(todo.id)}
                  size="sm"
                  variant={todo.completed ? "default" : "outline"}
                  className={`h-6 w-6 p-0 rounded-full ${
                    todo.completed 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {todo.completed && <Check className="w-3 h-3" />}
                </Button>
                <span 
                  className={`flex-1 text-sm ${
                    todo.completed ? 'line-through opacity-75' : ''
                  }`}
                >
                  {todo.text}
                </span>
                <Button
                  onClick={() => deleteTodo(todo.id)}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoList;
