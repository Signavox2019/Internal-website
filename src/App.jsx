import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import WelcomePage from './components/WelcomePage';
import EmployeesPage from './components/EmployeesPage';
import CardsPage from './components/CardsPage';
import CardDetailsPage from './components/CardDetails';
import QuickLinksPage from './components/QuickLinksPage';
import TicketsPage from './components/TicketsPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ProfilePage from './components/ProfilePage';
import SkillPath from './components/SkillPath';
import LandingPage from './components/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';
import InsurancePage from './components/InsurancePage';
import JobFeed from './components/JobFeed';
import EmergencyContactPage from './components/EmergencyContact';
import CommunityConnect from './components/CommunityConnect';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#6c757d',
    },
  },
});

function App() {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure loading screen is shown for at least 3 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <ProtectedRoute>
              <LoginPage />
            </ProtectedRoute>
          } />
          <Route path="/forgot-password" element={
            <ProtectedRoute>
              <ForgotPasswordPage />
            </ProtectedRoute>
          } />

          {/* Protected Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/welcome" element={
              <ProtectedRoute adminOnly={true}>
                <WelcomePage />
              </ProtectedRoute>
            } />
            <Route path="/employees" element={
              <ProtectedRoute adminOnly={true}>
                <EmployeesPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/cards" element={
              <ProtectedRoute>
                <CardsPage />
              </ProtectedRoute>
            } />
            <Route path="/cards/:id" element={
              <ProtectedRoute>
                <CardDetailsPage />
              </ProtectedRoute>
            } />
            <Route path="/quick-links" element={
              <ProtectedRoute>
                <QuickLinksPage />
              </ProtectedRoute>
            } />
            <Route path="/tickets" element={
              <ProtectedRoute>
                <TicketsPage />
              </ProtectedRoute>
            } />
            <Route path="/landing" element={
              <ProtectedRoute>
                <LandingPage />
              </ProtectedRoute>
            } />
            <Route path="/insurance" element={
              <ProtectedRoute>
                <InsurancePage />
              </ProtectedRoute>
            } />
            <Route path="/job-feed" element={
              <ProtectedRoute>
                <JobFeed />
              </ProtectedRoute>
            } />
            <Route path="/emergency" element={
              <ProtectedRoute>
                <EmergencyContactPage />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <CommunityConnect />
              </ProtectedRoute>
            } />
            <Route path="/skill-path" element={
              <ProtectedRoute>
                <SkillPath />
              </ProtectedRoute>
            } />
          </Route>

          {/* Redirect root to login or welcome based on auth status */}
          <Route path="/" element={
            localStorage.getItem('token')
              ? (localStorage.getItem('isAdmin') === 'true'
                ? <Navigate to="/welcome" replace />
                : <Navigate to="/landing" replace />)
              : <Navigate to="/login" replace />
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
