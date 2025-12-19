import axios from 'axios';
import { State, ApiOperationResponse } from '../types/taskState';
import { getValidToken } from './taskApi';

const API_URL = (window.API_URL ?? import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7147').replace(/\/$/, '');

const mapState = (raw: any): State => ({
  id: raw.id ?? raw.Id,
  name: raw.name ?? raw.Name,
  isActive: raw.isActive ?? raw.IsActive,
  createdAt: raw.createdAt ?? raw.CreatedAt,
  updatedAt: raw.updatedAt ?? raw.UpdatedAt,
  ...raw,
});

export async function getStates(): Promise<State[]> {
  const token = await getValidToken();

  const response = await axios.get(`${API_URL}/api/State/GetStates`, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = response.data as any[];
  return (data ?? []).map(mapState);
}

export async function getStateById(id: number): Promise<State> {
  const token = await getValidToken();

  const response = await axios.get(`${API_URL}/api/State/GetState/${id}`, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${token}`,
    },
  });

  return mapState(response.data);
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
  console.log("STATUS:", e?.response?.status);
  console.log("DATA:", e?.response?.data);
  console.log("TEXT:", e?.response?.statusText);
  console.log("ERR:", e);

    const data = e.response?.data ?? {};
    return {
      stateOperation: false,
      result: false,
      message: data.message ?? data.Message ?? e.message ?? "Error",
    };
  }

};

export interface StateCreateDto {
  name: string;
  isActive?: boolean;
}

export type StateUpdateDto = StateCreateDto;

export async function createState(dto: StateCreateDto): Promise<ApiOperationResponse<boolean>> {
  const token = await getValidToken();

  return unwrapOperation(
    axios.post(`${API_URL}/api/State/PostState`, dto, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      },
    })
  );
}

export async function updateState(id: number, dto: StateUpdateDto): Promise<ApiOperationResponse<boolean>> {
  const token = await getValidToken();

  return unwrapOperation(
    axios.put(`${API_URL}/api/State/UpdateState/${id}`, dto, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      },
    })
  );
}

export async function deleteState(id: number): Promise<ApiOperationResponse<boolean>> {
  const token = await getValidToken();

  return unwrapOperation(
    axios.delete(`${API_URL}/api/State/DeleteState/${id}`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      },
    })
  );
}