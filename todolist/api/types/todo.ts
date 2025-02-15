export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface CreateTodoParams {
  title: string;
  completed: boolean;
  userId: number;
}