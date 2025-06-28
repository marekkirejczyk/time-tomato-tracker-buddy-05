
import { useState, useEffect } from 'react';
import { ListTodo, Archive, EyeOff, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useSupabaseTodos } from '@/hooks/useSupabaseTodos';
import TodoSection from './TodoSection';

interface TodoListProps {
  hideBacklog?: boolean;
}

const TodoList = ({ hideBacklog = false }: TodoListProps) => {
  const [isBacklogVisible, setIsBacklogVisible] = useState(true);
  const {
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
  } = useSupabaseTodos();

  // Hide backlog when hideBacklog prop changes
  useEffect(() => {
    if (hideBacklog) {
      setIsBacklogVisible(false);
    }
  }, [hideBacklog]);

  const toggleBacklogVisibility = () => {
    setIsBacklogVisible(!isBacklogVisible);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={`${isBacklogVisible ? 'space-y-4' : 'h-full flex flex-col'}`}>
        {/* Pomodoro Tasks */}
        <TodoSection
          title="Pomodoro Tasks"
          icon={<ListTodo className="w-5 h-5" />}
          todos={pomodoroTodos}
          onAdd={addPomodoroTodo}
          onToggle={togglePomodoroTodo}
          onDelete={deletePomodoroTodo}
          placeholder="Add a task for this session..."
          droppableId="pomodoro"
          emptyMessage="Add tasks to focus on during your Pomodoro session"
          className={!isBacklogVisible ? 'flex-1' : ''}
        />

        {/* Task Backlog - conditionally rendered */}
        {isBacklogVisible && (
          <TodoSection
            title="Task Backlog"
            icon={<Archive className="w-5 h-5" />}
            todos={backlogTodos}
            onAdd={addBacklogTodo}
            onToggle={toggleBacklogTodo}
            onDelete={deleteBacklogTodo}
            placeholder="Add a task to your backlog..."
            droppableId="backlog"
            emptyMessage="Add tasks to your backlog for future sessions"
            headerAction={
              <Button
                onClick={toggleBacklogVisibility}
                size="sm"
                variant="ghost"
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
              >
                <EyeOff className="w-4 h-4" />
                Hide
              </Button>
            }
          />
        )}
        {/* Show backlog button when hidden */}
        {!isBacklogVisible && (
          <div className="flex justify-center mt-4">
            <Button
              onClick={toggleBacklogVisibility}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Show Backlog
            </Button>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default TodoList;
