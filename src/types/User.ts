export type User = { 
  id?: number; 
  FirstName: string; 
  LastName: string; 
  Username: string; 
  Email: string; 
  Password: string; 
  Age: number; 
}; 

export interface UserItem { 
  id?: number; 
  Firstname: string; 
  Lastname: string; 
  Username: string; 
  Email: string; 
  Password: string; 
  Age: number; 
} 

export type UserResponse = { 
  data: UserItem[]; 
  meta: { 
    pagination: { 
      total: number; 
      page: number; 
      pageSize: number; 
      pageCount: number; 
    }; 
  }; 
}; 