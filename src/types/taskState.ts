export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  stateId: number;
  stateName?: string;
}

export interface TaskListResult {
  pagedTasks: Task[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface QueryFilter {
  search?: string;
  stateId?: number;
  orderBy?: 'dueDateAsc' | 'dueDateDesc';
  pageNumber?: number;
  pageSize?: number;
}

export interface State {
  id: number;
  name: string;
  isActive?: boolean;
  [key: string]: any;
}

export interface ApiOperationResponse<T> {
  stateOperation: boolean;
  message?: string;
  result: T;
}