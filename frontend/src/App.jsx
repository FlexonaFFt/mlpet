import { Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Chat from './components/Chat';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthForm />} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat onLogout={() => localStorage.removeItem('token')} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;