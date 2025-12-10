import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import TaskListPage from './components/tasks/TaskListPage';
import TaskFormPage from './components/tasks/TaskFormPage';
import StateListPage from './components/states/StateListPage';
import StateFormPage from './components/states/StateFormPage';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<TaskListPage />} />
        <Route path="/tasks/new" element={<TaskFormPage />} />
        <Route path="/tasks/:id/edit" element={<TaskFormPage />} />
        <Route path="/states" element={<StateListPage />} />
        <Route path="/states/new" element={<StateFormPage />} />
        <Route path="/states/:id/edit" element={<StateFormPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;