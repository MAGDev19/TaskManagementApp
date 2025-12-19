import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { State } from '../../types/taskState';
import {
  getStates,
  getStateById,
  createState,
  updateState,
  deleteState,
  StateCreateDto,
  StateUpdateDto,
} from '../../api/stateApi';

export interface StatesState {
  items: State[];
  selected?: State;
  loading: boolean;
  error?: string | null;
}

const initialState: StatesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchStates = createAsyncThunk<State[]>(
  'states/fetchStates',
  async () => {
    return await getStates();
  }
);

export const fetchStateByIdThunk = createAsyncThunk<State, number>(
  'states/fetchStateById',
  async (id: number) => {
    return await getStateById(id);
  }
);

export const createStateThunk = createAsyncThunk<
  boolean,
  StateCreateDto
>('states/createState', async (dto, thunkApi) => {
  const response = await createState(dto);
  if (!response.stateOperation || !response.result) {
    return thunkApi.rejectWithValue(response.message ?? 'No se pudo crear el estado');
  }
  await thunkApi.dispatch(fetchStates() as any);
  return true;
});

export const updateStateThunk = createAsyncThunk<
  boolean,
  { id: number; dto: StateUpdateDto }
>('states/updateState', async ({ id, dto }, thunkApi) => {
  const response = await updateState(id, dto);
  if (!response.stateOperation || !response.result) {
    return thunkApi.rejectWithValue(response.message ?? 'No se pudo actualizar el estado');
  }
  await thunkApi.dispatch(fetchStates() as any);
  return true;
});

export const deleteStateThunk = createAsyncThunk<boolean, number>(
  'states/deleteState',
  async (id: number, thunkApi) => {
    const response = await deleteState(id);
    if (!response.stateOperation || !response.result) {
      return thunkApi.rejectWithValue(response.message ?? 'No se pudo eliminar el estado');
    }
    await thunkApi.dispatch(fetchStates() as any);
    return true;
  }
);

const statesSlice = createSlice({
  name: 'states',
  initialState,
  reducers: {
    clearStateError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.error.message as string) ?? 'Error al cargar estados';
      })
      .addCase(fetchStateByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selected = undefined;
      })
      .addCase(fetchStateByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchStateByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.error.message as string) ?? 'Error al cargar el estado';
      })
      .addCase(createStateThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(createStateThunk.rejected, (state, action) => {
        state.error =
          (action.payload as string) ||
          (action.error.message as string) ||
          'Error al crear el estado';
      })
      .addCase(updateStateThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(updateStateThunk.rejected, (state, action) => {
        state.error =
          (action.payload as string) ||
          (action.error.message as string) ||
          'Error al actualizar el estado';
      })
      .addCase(deleteStateThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteStateThunk.rejected, (state, action) => {
        state.error =
          (action.payload as string) ||
          (action.error.message as string) ||
          'Error al eliminar el estado';
      });
  },
});

export const { clearStateError } = statesSlice.actions;

export default statesSlice.reducer;