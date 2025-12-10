import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../features/tasks/taskSlice';
import statesReducer from '../features/states/stateSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    states: statesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;