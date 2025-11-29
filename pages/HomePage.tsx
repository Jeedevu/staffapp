
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import TaskCard from '../components/TaskCard';
import { Task, TaskStatus } from '../types';
import EmergencySlider from '../components/EmergencySlider';
import {
  BellIcon,
  VideoCameraIcon,
  QrCodeIcon,
  UserIcon,
  HeartIcon,
  ShieldExclamationIcon,
  BeakerIcon,
  ClockIcon,
  CheckCircleIcon
} from '../components/icons/Icons';
import { useNavigate } from 'react-router-dom';

const QuickActionBtn: React.FC<{ icon: React.ElementType, label: string, color: string, onClick?: () => void }> = ({ icon: Icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform"
  >
    <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center mb-2`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
  </button>
);

const HomePage: React.FC = () => {
  const { tasks } = useAppContext();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const pendingTasks = tasks.filter(task => task.status === TaskStatus.Pending);

  console.log('🏠 HomePage - All tasks:', tasks);
  console.log('🏠 HomePage - Pending tasks:', pendingTasks);
  console.log('🏠 HomePage - Task statuses:', tasks.map(t => ({ id: t.id, status: t.status, title: t.title })));

  const aiSuggestion = pendingTasks.length > 0 ? pendingTasks[0] : null;

  // Mock data for summary
  const myPatients = 5;
  const criticalPatients = 1;

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="p-4 text-gray-800 dark:text-gray-200 pb-24">
      {/* Dynamic Header */}
      <header className="mb-6 flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {getGreeting()}, Sarah
          </h1>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-semibold border border-green-200 dark:border-green-800">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
            On Duty
          </div>
          <p className="text-xs text-gray-400 mt-1">Shift ends in 4h 30m</p>
        </div>
      </header>

      {/* Patient Status Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-600 rounded-xl p-4 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 opacity-20">
            <UserIcon className="w-16 h-16" />
          </div>
          <p className="text-blue-100 text-xs font-medium mb-1">My Patients</p>
          <p className="text-3xl font-bold">{myPatients}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 opacity-5">
            <ShieldExclamationIcon className="w-16 h-16" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-1">Critical Attention</p>
          <p className="text-3xl font-bold text-red-500">{criticalPatients}</p>
        </div>
      </div>

      {/* Emergency Slider */}
      <div className="mb-8">
        <EmergencySlider />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center">
          Quick Actions
        </h2>
        <div className="grid grid-cols-4 gap-3">
          <QuickActionBtn icon={QrCodeIcon} label="Scan" color="bg-purple-500" onClick={() => navigate('/qr-scanner')} />
          <QuickActionBtn icon={HeartIcon} label="Vitals" color="bg-pink-500" onClick={() => navigate('/record-readings')} />
          <QuickActionBtn icon={UserIcon} label="Admit" color="bg-blue-500" />
          <QuickActionBtn icon={BeakerIcon} label="Supplies" color="bg-teal-500" />
        </div>
      </div>

      {/* AI Suggestion */}
      {aiSuggestion && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
              <span className="text-xs">✨</span>
            </div>
            <h2 className="text-sm font-bold text-blue-800 dark:text-blue-200 uppercase tracking-wide">AI Recommendation</h2>
          </div>
          <TaskCard task={aiSuggestion} />
        </div>
      )}

      {/* Task List */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Tasks</h2>
          <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
            {pendingTasks.length} Pending
          </span>
        </div>

        {pendingTasks.length > 0 ? (
          <div className="space-y-3">
            {pendingTasks.map(task => <TaskCard key={task.id} task={task} />)}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
            <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-2 opacity-50" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">All caught up!</p>
            <p className="text-xs text-gray-400">Great job, take a breather.</p>
          </div>
        )}
      </div>

      {/* Live Insights */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Live Insights</h2>
        <div className="space-y-3">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-xl flex items-start shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="mt-0.5 mr-3">
              <VideoCameraIcon className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Room 102: Patient Agitation</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Detected via CCTV analysis 2m ago.</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-xl flex items-start shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="mt-0.5 mr-3">
              <BellIcon className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Room 101: Elevated Heart Rate</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">IoT Sensor reading: 115 bpm.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
