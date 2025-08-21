import type {User} from "../types/User";

export type Todo = {
  id: number;
  todo: string;
  completed: boolean;
  userId: {
    id: number;
    FirstName: string;
    LastName: string;
    Username: string;
  };
};



export interface TodoItem {
  id: number;
  Todo: string;
  Completed: boolean | null;
  userId: User | null;
}

export type TodoResponse = {
  todos: {
    data: {
      id: string;
      attributes: {
        todo: string;
        completed: boolean;
        user: {
          data: {
            id: string;
            attributes: {
              username: string;
              email: string;
            };
          } | null;
        };
      };
    }[];
    meta: {
      pagination: {
        total: number;
        page: number;
        pageSize: number;
        pageCount: number;
      };
    };
  };
};

