import type { User } from "../types/User";
import type { Todo } from "../types/todo";
import { gql } from "@apollo/client";
import { client } from "./apolloClient";

const FETCH_EMPLOYEES = gql`
  query GetEmployees($page: Int, $pageSize: Int, $filters: EmployeeFiltersInput) {
    employees_connection(
      pagination: { page: $page, pageSize: $pageSize }
      filters: $filters
      sort: "FirstName"
    ) {
      nodes {
        documentId
        FirstName
        LastName
        Username
        Email
        Age
        # ✅ fetch related todos
        todos {
          documentId
          todo
          completed
        }
      }
      pageInfo {
        pageSize
        page
        pageCount
        total
      }
    }
  }
`;

const FETCH_EMPLOYEE = gql`
  query GetEmployee($documentId: ID!) {
    employee(documentId: $documentId) {
      documentId
      FirstName
      LastName
      Username
      Email
      Age
      # ✅ fetch related todos
      todos {
        documentId
        todo
        completed
      }
    }
  }
`;

const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($data: EmployeeInput!) {
    createEmployee(data: $data) {
      documentId
      FirstName
      LastName
      Username
      Email
      Age
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($documentId: ID!, $data: EmployeeInput!) {
    updateEmployee(documentId: $documentId, data: $data) {
      documentId
      FirstName
      LastName
      Username
      Email
      Age
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($documentId: ID!) {
    deleteEmployee(documentId: $documentId) {
      documentId
    }
  }
`;

interface PageInfo {
  pageSize: number;
  page: number;
  pageCount: number;
  total: number;
}

interface FetchEmployeesResponse {
  employees_connection: {
    nodes: (User & { todos?: Todo[] })[];
    pageInfo: PageInfo;
  };
}

interface FetchEmployeeResponse {
  employee: User & { todos?: Todo[] };
}

interface CreateEmployeeResponse {
  createEmployee: User;
}

interface UpdateEmployeeResponse {
  updateEmployee: User;
}

interface DeleteEmployeeResponse {
  deleteEmployee: { documentId: string };
}

export const fetchUsers = async (
  page: number,
  pageSize: number,
  search: string,
  property: string
): Promise<{ users: (User & { todos?: Todo[] })[]; pageInfo: PageInfo }> => {
  let filters: Record<string, unknown> | undefined = undefined;

  if (search && property) {
    if (property === "name") {
      filters = { FirstName: { contains: search } };
    } else if (property === "email") {
      filters = { Email: { contains: search } };
    } else if (property === "id") {
      filters = { documentId: { eq: search } };
    }
  }

  const { data } = await client.query<FetchEmployeesResponse>({
    query: FETCH_EMPLOYEES,
    variables: { page, pageSize, filters },
    fetchPolicy: "network-only",
  });

  return {
    users: data.employees_connection.nodes,
    pageInfo: data.employees_connection.pageInfo,
  };
};

export const fetchUser = async (
  documentId: string
): Promise<User & { todos?: Todo[] }> => {
  const { data } = await client.query<FetchEmployeeResponse>({
    query: FETCH_EMPLOYEE,
    variables: { documentId },
  });
  return data.employee;
};

export const addUser = async (user: User): Promise<User> => {
  const { data } = await client.mutate<CreateEmployeeResponse>({
    mutation: CREATE_EMPLOYEE,
    variables: { data: user },
    update: (cache, { data }) => {
      if (!data?.createEmployee) return;

      const newUser = data.createEmployee;

      // ✅ Read existing employees from cache
      const existing = cache.readQuery<FetchEmployeesResponse>({
        query: FETCH_EMPLOYEES,
        variables: { page: 1, pageSize: 5 }, // adjust to your defaults
      });

      if (existing?.employees_connection) {
        cache.writeQuery({
          query: FETCH_EMPLOYEES,
          variables: { page: 1, pageSize: 5 },
          data: {
            employees_connection: {
              ...existing.employees_connection,
              nodes: [newUser, ...existing.employees_connection.nodes], // ⬅️ put new user on top
              pageInfo: {
                ...existing.employees_connection.pageInfo,
                total: existing.employees_connection.pageInfo.total + 1,
              },
            },
          },
        });
      }
    },
  });
  return data!.createEmployee;
};

export const updateUser = async (
  documentId: string,
  user: User
): Promise<User> => {
  const { data } = await client.mutate<UpdateEmployeeResponse>({
    mutation: UPDATE_EMPLOYEE,
    variables: { documentId, data: user },
  });
  return data!.updateEmployee;
};

export const deleteUser = async (
  documentId: string
): Promise<{ documentId: string }> => {
  const { data } = await client.mutate<DeleteEmployeeResponse>({
    mutation: DELETE_EMPLOYEE,
    variables: { documentId },
    update: (cache) => {
      const existing = cache.readQuery<FetchEmployeesResponse>({
        query: FETCH_EMPLOYEES,
        variables: { page: 1, pageSize: 5 },
      });

      if (existing?.employees_connection) {
        cache.writeQuery({
          query: FETCH_EMPLOYEES,
          variables: { page: 1, pageSize: 5 },
          data: {
            employees_connection: {
              ...existing.employees_connection,
              nodes: existing.employees_connection.nodes.filter(
                (u) => u.documentId !== documentId
              ),
              pageInfo: {
                ...existing.employees_connection.pageInfo,
                total: existing.employees_connection.pageInfo.total - 1,
              },
            },
          },
        });
      }
    },
  });
  return data!.deleteEmployee;
};
