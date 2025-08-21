import type { Todo } from '../types/todo';
import { gql } from '@apollo/client';
import { client } from "./apolloClient";

export const FETCH_TODOS = gql`
  query GetTodos($page: Int, $pageSize: Int, $filters: TodoFiltersInput) {
    todos_connection(
      pagination: { page: $page, pageSize: $pageSize }
      filters: $filters
    ) {
      nodes {
        documentId
        todo
        completed
        userId {
          documentId
          FirstName
          LastName
          Username
        }
      }
      pageInfo {
        total
        page
        pageSize
        pageCount
      }
    }
  }
`;

const FETCH_TODO = gql`
  query GetTodo($documentId: ID!) {
    todo(documentId: $documentId) {
      documentId
      todo
      completed
      userId {
        documentId
        FirstName
        LastName
        Username
        Email
        Age
      }
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($data: TodoInput!) {
    createTodo(data: $data) {
      documentId
      todo
      completed
      userId {
        documentId
        FirstName
        LastName
        Username
        Email
        Age
      }
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($documentId: ID!, $data: TodoInput!) {
    updateTodo(documentId: $documentId, data: $data) {
      documentId
      todo
      completed
      userId {
        documentId
        FirstName
        LastName
       
      }
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($documentId: ID!) {
    deleteTodo(documentId: $documentId) {
      documentId
    }
  }
`;

// =====================
// TYPES
// =====================
interface PageInfo {
  pageSize: number;
  page: number;
  pageCount: number;
  total: number;
}

interface FetchTodosResponse {
  todos_connection: {
    nodes: Todo[];
    pageInfo: PageInfo;
  };
}

interface FetchTodoResponse {
  todo: Todo;
}

interface CreateTodoResponse {
  createTodo: Todo;
}

interface UpdateTodoResponse {
  updateTodo: Todo;
}

interface DeleteTodoResponse {
  deleteTodo: { documentId: string };
}


const mapFilterKey = (key: string) => {
  if (key === 'id') return 'documentId';
  if (key === 'user') return 'userId'; 
  return key;
};


export async function fetchTodos(
  page = 1,
  pageSize = 10,
  search?: string,
  property?: string
) {
  const filters: any = {};

  if (search && property) {
    if (property === "id") {
      filters.documentId = { containsi: search };
    } else if (property === "todo") {
      filters.todo = { containsi: search };
    } else if (property === "user") {
      filters.userId = {
        or: [
          { FirstName: { containsi: search } },
          { LastName: { containsi: search } },
        ],
      };
    }
  }

  if (property === "completed") {
    filters.completed = { eq: true };
  } else if (property === "not_completed") {
    filters.completed = { eq: false };
  }

  const { data } = await client.query<FetchTodosResponse>({
    query: FETCH_TODOS,
    variables: { page, pageSize, filters },
    fetchPolicy: "network-only",
  });

  return data.todos_connection;
}



export const fetchTodo = async (documentId: string): Promise<Todo> => {
  const { data } = await client.query<FetchTodoResponse>({
    query: FETCH_TODO,
    variables: { documentId },
  });
  return data.todo;
};

export const addTodo = async (todo: Todo): Promise<Todo> => {
  const { data } = await client.mutate<CreateTodoResponse>({
    mutation: CREATE_TODO,
    variables: {
      data: {
        todo: todo.todo,
        completed: todo.completed,
        userId: todo.userId ? todo.userId : null,
     
      },
    },
  });
  return data!.createTodo;
};

export const updateTodo = async (
  documentId: string,
  todo: Todo
): Promise<Todo> => {
  const { data } = await client.mutate<UpdateTodoResponse>({
    mutation: UPDATE_TODO,
    variables: {
      documentId,
      data: {
        todo: todo.todo,
        completed: todo.completed,
        userId: todo.userId.documentId
          
      },
    },
  });
  return data!.updateTodo;
};


export const deleteTodo = async (
  documentId: string
): Promise<{ documentId: string }> => {
  const { data } = await client.mutate<DeleteTodoResponse>({
    mutation: DELETE_TODO,
    variables: { documentId },
  });
  return data!.deleteTodo;
};
