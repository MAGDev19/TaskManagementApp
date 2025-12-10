import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskListResult, QueryFilter, State } from '../../types/taskState';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStates,
  TaskCreateDto,
  TaskUpdateDto,
} from '../../api/taskApi';

export interface TasksState {
  items: Task[];
  selected?: Task;
  loading: boolean;
  error?: string | null;
  filters: {
    search: string;
    stateId: number | null;
    orderBy: 'dueDateAsc' | 'dueDateDesc';
  };
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
  };
  availableStates: State[];
  loadingStates: boolean;
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    stateId: null,
    orderBy: 'dueDateAsc',
  },
  pagination: {
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
  },
  availableStates: [],
  loadingStates: false,
};

export const fetchTasks = createAsyncThunk<
  TaskListResult,
  void,
  { state: { tasks: TasksState } }
>('tasks/fetchTasks', async (_, thunkApi) => {
  const state = thunkApi.getState().tasks;
  const filter: QueryFilter = {
    search: state.filters.search || undefined,
    stateId: state.filters.stateId ?? undefined,
    orderBy: state.filters.orderBy,
    pageNumber: state.pagination.pageNumber,
    pageSize: state.pagination.pageSize,
  };
  return await getTasks(filter);
});

export const fetchTaskById = createAsyncThunk<Task, number>(
  'tasks/fetchTaskById',
  async (id: number) => {
    return await getTaskById(id);
  }
);

export const fetchTaskStatesThunk = createAsyncThunk<State[]>(
  'tasks/fetchTaskStates',
  async () => {
    return await getTaskStates();
  }
);

export const createTaskThunk = createAsyncThunk<
  boolean,
  TaskCreateDto
>('tasks/createTask', async (dto, thunkApi) => {
  const response = await createTask(dto);
  if (!response.stateOperation || !response.result) {
    return thunkApi.rejectWithValue(response.message ?? 'No se pudo crear la tarea');
  }
  await thunkApi.dispatch(fetchTasks() as any);
  return true;
});

export const updateTaskThunk = createAsyncThunk<
  boolean,
  TaskUpdateDto
>('tasks/updateTask', async (dto, thunkApi) => {
  const response = await updateTask(dto);
  if (!response.stateOperation || !response.result) {
    return thunkApi.rejectWithValue(response.message ?? 'No se pudo actualizar la tarea');
  }
  await thunkApi.dispatch(fetchTasks() as any);
  return true;
});

export const deleteTaskThunk = createAsyncThunk<boolean, number>(
  'tasks/deleteTask',
  async (id: number, thunkApi) => {
    const response = await deleteTask(id);
    if (!response.stateOperation || !response.result) {
      return thunkApi.rejectWithValue(response.message ?? 'No se pudo eliminar la tarea');
    }
    await thunkApi.dispatch(fetchTasks() as any);
    return true;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
      state.pagination.pageNumber = 1;
    },
    setStateFilter(state, action: PayloadAction<number | null>) {
      state.filters.stateId = action.payload;
      state.pagination.pageNumber = 1;
    },
    setOrderBy(state, action: PayloadAction<'dueDateAsc' | 'dueDateDesc'>) {
      state.filters.orderBy = action.payload;
    },
    setPageNumber(state, action: PayloadAction<number>) {
      state.pagination.pageNumber = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.pagedTasks;
        state.pagination.totalCount = action.payload.totalCount;
        state.pagination.pageNumber = action.payload.pageNumber;
        state.pagination.pageSize = action.payload.pageSize;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.error.message as string) ?? 'Error al cargar tareas';
      })
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selected = undefined;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.error.message as string) ?? 'Error al cargar la tarea';
      })
      .addCase(fetchTaskStatesThunk.pending, (state) => {
        state.loadingStates = true;
      })
      .addCase(fetchTaskStatesThunk.fulfilled, (state, action) => {
        state.loadingStates = false;
        state.availableStates = action.payload;
      })
      .addCase(fetchTaskStatesThunk.rejected, (state) => {
        state.loadingStates = false;
      })
      .addCase(createTaskThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(createTaskThunk.rejected, (state, action) => {
        state.error =
          (action.payload as string) ||
          (action.error.message as string) ||
          'Error al crear la tarea';
      })
      .addCase(updateTaskThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTaskThunk.rejected, (state, action) => {
        state.error =
          (action.payload as string) ||
          (action.error.message as string) ||
          'Error al actualizar la tarea';
      })
      .addCase(deleteTaskThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTaskThunk.rejected, (state, action) => {
        state.error =
          (action.payload as string) ||
          (action.error.message as string) ||
          'Error al eliminar la tarea';
      });
  },
});

export const { setSearch, setStateFilter, setOrderBy, setPageNumber, clearError } =
  tasksSlice.actions;

export default tasksSlice.reducer;