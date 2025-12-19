import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import TaskListPage from './components/tasks/TaskListPage';
import TaskFormPage from './components/tasks/TaskFormPage';
import StateListPage from './components/states/StateListPage';
import StateFormPage from './components/states/StateFormPage';

const App: React.FC = () => {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<TaskListPage />} />
        <Route path="/tasks/new" element={<TaskFormPage />} />
        <Route path="/tasks/:id/edit" element={<TaskFormPage />} />
        <Route path="/states" element={<StateListPage />} />
        <Route path="/states/new" element={<StateFormPage />} />
        <Route path="/states/:id/edit" element={<StateFormPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
};

export default App;