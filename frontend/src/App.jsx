import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Campaigns from './pages/Campaigns';
import EmailGenerator from './pages/EmailGenerator';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Templates from './pages/Templates';
import EmailScheduling from './pages/EmailScheduling';
import DeliverabilityReports from './pages/DeliverabilityReports';
import Landing from './pages/Landing';
import Layout from './layouts/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';

const theme = createTheme({ 
  palette: { 
    mode: 'dark', 
    primary: { main: '#FF8C00' },
    secondary: { main: '#FFD700' },
    background: { default: '#0F0F0F', paper: '#1A1A1A' },
    text: { primary: '#FFFFFF', secondary: '#E0E0E0' }
  } 
});

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute> : <Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute><Layout><Customers /></Layout></ProtectedRoute>} />
      <Route path="/campaigns" element={<ProtectedRoute><Layout><Campaigns /></Layout></ProtectedRoute>} />
      <Route path="/generate" element={<ProtectedRoute><Layout><EmailGenerator /></Layout></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><Layout><History /></Layout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
      <Route path="/templates" element={<ProtectedRoute><Layout><Templates /></Layout></ProtectedRoute>} />
      <Route path="/schedule" element={<ProtectedRoute><Layout><EmailScheduling /></Layout></ProtectedRoute>} />
      <Route path="/deliverability" element={<ProtectedRoute><Layout><DeliverabilityReports /></Layout></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <AppRoutes />
            <ToastContainer position="top-right" />
          </BrowserRouter>
        </ThemeProvider>
      </SearchProvider>
    </AuthProvider>
  );
}
