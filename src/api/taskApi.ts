import axios from 'axios';
import { Task, TaskListResult, QueryFilter, State, ApiOperationResponse } from '../types/taskState';

const API_URL = (window.API_URL ?? import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7147').replace(/\/$/, '');
const USER = (window as any).USER;
const PASSWORD = (window as any).PASSWORD;

let mainToken: string = '';

setInterval(() => {
  mainToken = '';
}, 60 * 60 * 1000);

export const getValidToken = async () => {
    if (mainToken !== "") return mainToken;

    try {
        const response = await axios.post(
            `${API_URL}/api/Token/Authentication`,
            {
                User: USER, 
                Password: PASSWORD 
            },
            {
                headers: { 
                    "Content-Type": "application/json"
                }
            }
        );

        mainToken = response.data.token;
        return mainToken;

    } catch (error) {
        console.error("ERROR OBTENIENDO TOKEN:", error);
        return null;
    }
};

const mapTask = (raw: any): Task => ({
  id: raw.id ?? raw.Id,
  title: raw.title ?? raw.Title,
  description: raw.description ?? raw.Description,
  dueDate: raw.dueDate ?? raw.DueDate,
  createdAt: raw.createdAt ?? raw.CreatedAt,
  updatedAt: raw.updatedAt ?? raw.UpdatedAt,
  stateId: raw.stateId ?? raw.StateId,
  stateName: raw.stateName ?? raw.StateName,
});

export async function getTasks(filter: QueryFilter): Promise<TaskListResult> {
  const token = await getValidToken();

  const response = await axios.get(`${API_URL}/api/Task`, {
    params: {
      search: filter.search,
      stateId: filter.stateId,
      orderBy: filter.orderBy,
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize,
    },
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = response.data as any;
  return {
    pagedTasks: (data.pagedTasks ?? data.PagedTasks ?? []).map(mapTask),
    totalCount: data.totalCount ?? data.TotalCount ?? (data.pagedTasks?.length ?? 0),
    pageNumber: data.pageNumber ?? data.PageNumber ?? filter.pageNumber ?? 1,
    pageSize: data.pageSize ?? data.pageSize ?? filter.pageSize ?? 10,
  };
}

export async function getTaskById(id: number): Promise<Task> {
  const token = await getValidToken();

  const response = await axios.get(`${API_URL}/api/Task/${id}`, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${token}`,
    },
  });

  return mapTask(response.data);
}

export interface TaskCreateDto {
  title: string;
  description: string;
  dueDate: string;
  stateId: number;
}

export interface TaskUpdateDto extends TaskCreateDto {
  id: number;
}

const unwrapOperation = async (promise: Promise<any>): Promise<ApiOperationResponse<boolean>> => {
  try {
    const response = await promise;
    const data = response.data ?? {};

    return {
      stateOperation: data.stateOperation ?? data.StateOperation ?? true,
      result: data.result ?? data.Result ?? true,
      message: data.message ?? data.Message ?? "Operación exitosa",
    };
  } catch (e: any) {
    const data = e.response?.data ?? {};
    return {
      stateOperation: false,
      result: false,
      message: data.message ?? "Error",
    };
  }
};

export async function createTask(dto: TaskCreateDto): Promise<ApiOperationResponse<boolean>> {
  const token = await getValidToken();

  const dtoApi = {
    Title: dto.title,
    Description: dto.description,
    DueDate: new Date(dto.dueDate).toISOString(),
    StateId: dto.stateId,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  };

  return unwrapOperation(
    axios.post(`${API_URL}/api/Task/PostTask`, dtoApi, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      },
    })
  );
}


export async function updateTask(dto: TaskUpdateDto): Promise<ApiOperationResponse<boolean>> {
  const token = await getValidToken();

  const dtoApi = {
  Id: dto.id,
  Title: dto.title,
  Description: dto.description,
  DueDate: new Date(dto.dueDate).toISOString(),
  CreatedAt: new Date().toISOString(),
  UpdatedAt: new Date().toISOString(),
  StateId: dto.stateId,
};


  return unwrapOperation(
    axios.put(`${API_URL}/api/Task/UpdateTask`, dtoApi, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      },
    })
  );
}


export async function deleteTask(id: number): Promise<ApiOperationResponse<boolean>> {
  const token = await getValidToken();

  return unwrapOperation(
    axios.delete(`${API_URL}/api/Task/DeleteTask/${id}`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      },
    })
  );
}

export async function getTaskStates(): Promise<State[]> {
  const token = await getValidToken();

  const response = await axios.get(`${API_URL}/api/Task/states`, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${token}`,
    },
  });

  const arr = response.data as any[];
  return (arr ?? []).map((s) => ({
    id: s.id ?? s.Id,
    name: s.name ?? s.Name,
    isActive: s.isActive ?? s.IsActive,
    ...s,
  }));
}