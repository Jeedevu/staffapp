import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TaskDetailsPage from './pages/TaskDetailsPage';
import QRScannerPage from './pages/QRScannerPage';
import TaskHistoryPage from './pages/TaskHistoryPage';
import AlertsPage from './pages/AlertsPage';
import ProfilePage from './pages/ProfilePage';
import EmergencyPage from './pages/EmergencyPage';
import RecordReadingsPage from './pages/RecordReadingsPage';

function App() {
  return (
    <HashRouter>
      <AppProvider>
        <div className="max-w-md mx-auto bg-white dark:bg-black h-screen shadow-lg flex flex-col font-sans">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="history" element={<TaskHistoryPage />} />
              <Route path="alerts" element={<AlertsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="/task/:id" element={<TaskDetailsPage />} />
            <Route path="/scan/:id" element={<QRScannerPage />} />
            <Route path="/record/:id" element={<RecordReadingsPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
          </Routes>
        </div>
      </AppProvider>
    </HashRouter>
  );
}

export default App;
