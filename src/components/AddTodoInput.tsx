
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddTodoInputProps {
  onAdd: (text: string) => void;
  placeholder: string;
}

const AddTodoInput = ({ onAdd, placeholder }: AddTodoInputProps) => {
  const [value, setValue] = useState('');

  const handleAdd = () => {
    onAdd(value);
    setValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button onClick={handleAdd} size="sm" className="px-3">
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default AddTodoInput;
