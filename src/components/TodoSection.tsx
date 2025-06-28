
import { ReactNode } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Todo } from '@/types/todo';
import TodoItem from './TodoItem';
import AddTodoInput from './AddTodoInput';

interface TodoSectionProps {
  title: string;
  icon: ReactNode;
  todos: Todo[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  placeholder: string;
  droppableId: string;
  emptyMessage: string;
}

const TodoSection = ({ 
  title, 
  icon, 
  todos, 
  onAdd, 
  onToggle, 
  onDelete, 
  placeholder, 
  droppableId, 
  emptyMessage 
}: TodoSectionProps) => {
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
          {totalCount > 0 && (
            <span className="text-sm font-normal text-gray-500">
              ({completedCount}/{totalCount})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AddTodoInput onAdd={onAdd} placeholder={placeholder} />
        
        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-2 max-h-48 overflow-y-auto min-h-[100px] p-2 rounded-lg border-2 border-dashed transition-colors ${
                snapshot.isDraggingOver ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
              }`}
            >
              {todos.length === 0 ? (
                <p className="text-gray-500 text-center py-4 text-sm">
                  {emptyMessage}
                </p>
              ) : (
                todos.map((todo, index) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    index={index}
                    onToggle={onToggle}
                    onDelete={onDelete}
                  />
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
};

export default TodoSection;
