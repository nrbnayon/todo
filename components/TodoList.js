"use client";

import { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import { useSelector } from "react-redux";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useGetTodosQuery,
  useUpdateTodoMutation,
} from "@/redux/services/todosApi";

export default function TodoList() {
  const { data: todos = [], isLoading, error } = useGetTodosQuery();
  // console.log("Todos data:", todos);
  const [updateTodo] = useUpdateTodoMutation();
  const filter = useSelector((state) => state.todos.filter);
  const [orderedTodos, setOrderedTodos] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (todos.length > 0) {
      setOrderedTodos(todos);
    }
  }, [todos]);

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

  const filteredTodos = orderedTodos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "incomplete") return !todo.completed;
    return true;
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });

      // Optional: Update the order in the backend
      // You can add order field to your todo schema and update it here
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={filteredTodos.map((todo) => todo.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No tasks found. Add a new task to get started!
            </div>
          ) : (
            filteredTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
