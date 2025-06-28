
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Draggable } from 'react-beautiful-dnd';
import { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ todo, index, onToggle, onDelete }: TodoItemProps) => {
  return (
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
            onClick={() => onToggle(todo.id)}
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
            onClick={() => onDelete(todo.id)}
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
};

export default TodoItem;
