// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Studio from './pages/Studio';
import Agents from './pages/Agents';;
import StudioPreview from './pages/StudioPreview';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './pages/UserProfile';
import History from './pages/History';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/studio" replace />} />
          <Route path="studio" element={<Studio />} />
          <Route path="agents" element={<Agents />} />
          <Route path="preview" element={<StudioPreview />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;