import type { Todo } from '../types/todo';


export const fetchTodos = async (page: number, rowsPerPage: number, token: string) => {
  const skip = page * rowsPerPage;
  const res = await fetch(`https://dummyjson.com/auth/todos?limit=${rowsPerPage}&skip=${skip}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to load todos');
  }

  return res.json();
};

export const fetchTodoById = async (id: number, token: string) => {
  const res = await fetch(`https://dummyjson.com/auth/todos/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to load todo');
  }

  return res.json();
};

export const updateTodoById = async (
  id: number,
  updatedTodo: Partial<Todo>,
  token: string
): Promise<Todo> => {
  const res = await fetch(`https://dummyjson.com/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedTodo),
  });

  if (!res.ok) {
    throw new Error(`Failed to update todo with id ${id}`);
  }

  return res.json();
};