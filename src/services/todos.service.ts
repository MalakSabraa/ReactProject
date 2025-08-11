import type { Todo } from '../types/todo';

export const fetchTodos = async (
  page: number,
  rowsPerPage: number,
  search: string,
  property: string
) => {
  const baseUrl = `http://localhost:1337/api/todos?pagination[page]=${page}&pagination[pageSize]=${rowsPerPage}`;
  
  const filterParam = search && property
    ? `&filters[${property}][$contains]=${search}`
    : '';

  const url = baseUrl + filterParam;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }

  return response.json();
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
  id:number,
 todo:Todo,
  token: string
): Promise<Todo> => {
  const res = await fetch(`http://localhost:1337/api/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: {todo:todo.todo,
      completed:todo.completed,
      userId:todo.userId
    } }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update todo with id ${id}`);
  }

  const result = await res.json();
  return {
    id: result.data.id,
    ...result.data.attributes,
  };
};



export const addTodo = async (
  todo:Todo
): Promise<Todo> => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const res = await fetch('http://localhost:1337/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: todo }),
  });

  if (!res.ok) {
    throw new Error('Failed to add todo');
  }

  const result = await res.json();
  return {
    id: result.data.id,
    ...result.data.attributes,
  };
};
