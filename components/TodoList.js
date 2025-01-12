'use client';

import TodoItem from './TodoItem';
import { useSelector } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useGetTodosQuery } from '@/redux/services/todosApi';

export default function TodoList() {
  const { data: todos = [], isLoading, error } = useGetTodosQuery();
  const filter = useSelector((state) => state.todos.filter);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading todos: {error.message}
      </div>
    );
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'incomplete') return !todo.completed;
    return true;
  });

  const onDragEnd = (result) => {
    // Implement drag and drop logic here
    // This is a placeholder for the bonus feature
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {filteredTodos.map((todo, index) => (
              <TodoItem key={todo.id} todo={todo} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}