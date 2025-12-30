import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import BlogPreview from './components/BlogPreview';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="container">
        <h1 className="logo">Blog Admin Panel</h1>
        {isAuthenticated && (
          <div className="header-actions">
            <span className="user-email">{user?.email}</span>
            <button onClick={logout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

function AppContent() {
  return (
    <div className="App">
      <Header />
      <main className="app-main">
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <BlogList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <BlogForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <BlogForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/preview/:id"
              element={
                <ProtectedRoute>
                  <BlogPreview />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
