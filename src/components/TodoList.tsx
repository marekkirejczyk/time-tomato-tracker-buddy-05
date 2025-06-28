
import { useState, useEffect } from 'react';
import { Plus, Check, X, ListTodo, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const TodoList = () => {
  const [pomodoroTodos, setPomodoroTodos] = useState<Todo[]>([]);
  const [backlogTodos, setBacklogTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newBacklogTodo, setNewBacklogTodo] = useState('');

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

  const addPomodoroTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
      };
      setPomodoroTodos([...pomodoroTodos, todo]);
      setNewTodo('');
    }
  };

  const addBacklogTodo = () => {
    if (newBacklogTodo.trim()) {
      const todo: Todo = {
        id: (Date.now() + 1).toString(), // +1 to avoid ID collision
        text: newBacklogTodo.trim(),
        completed: false,
      };
      setBacklogTodos([...backlogTodos, todo]);
      setNewBacklogTodo('');
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

  const handleKeyPress = (e: React.KeyboardEvent, isBacklog = false) => {
    if (e.key === 'Enter') {
      if (isBacklog) {
        addBacklogTodo();
      } else {
        addPomodoroTodo();
      }
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;

    const sourceList = source.droppableId === 'pomodoro' ? pomodoroTodos : backlogTodos;
    const destList = destination.droppableId === 'pomodoro' ? pomodoroTodos : backlogTodos;

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same list
      const items = Array.from(sourceList);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      if (source.droppableId === 'pomodoro') {
        setPomodoroTodos(items);
      } else {
        setBacklogTodos(items);
      }
    } else {
      // Moving between lists
      const sourceItems = Array.from(sourceList);
      const destItems = Array.from(destList);
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      if (source.droppableId === 'pomodoro') {
        setPomodoroTodos(sourceItems);
        setBacklogTodos(destItems);
      } else {
        setBacklogTodos(sourceItems);
        setPomodoroTodos(destItems);
      }
    }
  };

  const completedPomodoroCount = pomodoroTodos.filter(todo => todo.completed).length;
  const totalPomodoroCount = pomodoroTodos.length;
  const completedBacklogCount = backlogTodos.filter(todo => todo.completed).length;
  const totalBacklogCount = backlogTodos.length;

  const renderTodoItem = (todo: Todo, index: number, isPomodoro: boolean) => (
    <Draggable key={todo.id} draggableId={todo.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
            todo.completed 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-gray-50 border-gray-200'
          } ${snapshot.isDragging ? 'shadow-lg rotate-2' : ''}`}
        >
          <Button
            onClick={() => isPomodoro ? togglePomodoroTodo(todo.id) : toggleBacklogTodo(todo.id)}
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
            onClick={() => isPomodoro ? deletePomodoroTodo(todo.id) : deleteBacklogTodo(todo.id)}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
    </Draggable>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        {/* Pomodoro Tasks */}
        <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListTodo className="w-5 h-5" />
              Pomodoro Tasks
              {totalPomodoroCount > 0 && (
                <span className="text-sm font-normal text-gray-500">
                  ({completedPomodoroCount}/{totalPomodoroCount})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, false)}
                placeholder="Add a task for this session..."
                className="flex-1"
              />
              <Button onClick={addPomodoroTodo} size="sm" className="px-3">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <Droppable droppableId="pomodoro">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-2 max-h-48 overflow-y-auto min-h-[100px] p-2 rounded-lg border-2 border-dashed transition-colors ${
                    snapshot.isDraggingOver ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  {pomodoroTodos.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 text-sm">
                      Add tasks to focus on during your Pomodoro session
                    </p>
                  ) : (
                    pomodoroTodos.map((todo, index) => renderTodoItem(todo, index, true))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>

        {/* Task Backlog */}
        <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Archive className="w-5 h-5" />
              Task Backlog
              {totalBacklogCount > 0 && (
                <span className="text-sm font-normal text-gray-500">
                  ({completedBacklogCount}/{totalBacklogCount})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                value={newBacklogTodo}
                onChange={(e) => setNewBacklogTodo(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, true)}
                placeholder="Add a task to your backlog..."
                className="flex-1"
              />
              <Button onClick={addBacklogTodo} size="sm" className="px-3">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <Droppable droppableId="backlog">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-2 max-h-48 overflow-y-auto min-h-[100px] p-2 rounded-lg border-2 border-dashed transition-colors ${
                    snapshot.isDraggingOver ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  {backlogTodos.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 text-sm">
                      Add tasks to your backlog for future sessions
                    </p>
                  ) : (
                    backlogTodos.map((todo, index) => renderTodoItem(todo, index, false))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>
      </div>
    </DragDropContext>
  );
};

export default TodoList;
