
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { TaskStatus } from '../types';
import { UserCircleIcon, ClockIcon, CheckCircleIcon, CogIcon } from '../components/icons/Icons';

const ProfilePage: React.FC = () => {
  const { tasks } = useAppContext();
  const tasksCompletedToday = tasks.filter(task => 
    task.status === TaskStatus.Completed && 
    new Date(task.completedAt!).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="p-4 text-gray-800 dark:text-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">My Profile</h1>
      
      <div className="flex flex-col items-center mb-8">
        <img src="https://picsum.photos/128" alt="Profile" className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-blue-500" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Nurse Sarah Johnson</h2>
        <p className="text-gray-500 dark:text-gray-400">RN, Cardiology Ward</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
        <div className="flex items-center">
          <ClockIcon className="w-6 h-6 mr-3 text-blue-500" />
          <div>
            <p className="font-semibold">Shift Timing</p>
            <p className="text-gray-600 dark:text-gray-300">7:00 AM - 7:00 PM</p>
          </div>
        </div>
        <div className="flex items-center">
          <CheckCircleIcon className="w-6 h-6 mr-3 text-green-500" />
          <div>
            <p className="font-semibold">Tasks Completed Today</p>
            <p className="text-gray-600 dark:text-gray-300">{tasksCompletedToday}</p>
          </div>
        </div>
         <div className="flex items-center">
          <UserCircleIcon className="w-6 h-6 mr-3 text-gray-500" />
          <div>
            <p className="font-semibold">Employee ID</p>
            <p className="text-gray-600 dark:text-gray-300">#SN-12094</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <button className="w-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-4 rounded-lg">
          <CogIcon className="w-5 h-5 mr-2" />
          <span>Settings & Preferences</span>
        </button>
      </div>
       <div className="mt-4">
        <button className="w-full flex items-center justify-center bg-red-500/10 text-red-500 font-bold py-3 px-4 rounded-lg">
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
