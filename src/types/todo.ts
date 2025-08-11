export type Todo = {
  id: number; 
  todo: string;
  completed: boolean;
  userId: number;
};

export interface TodoItem {
  id: number;
  Todo: string;
  Completed: boolean | null;
  userId: number;
}


export type TodoResponse = {
  data: TodoItem[];
  meta: {
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      pageCount: number;
    };
  };
};
