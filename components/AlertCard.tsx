
import React from 'react';
import { Alert, AlertType } from '../types';
import { BellIcon, VideoCameraIcon, HeartIcon, CogIcon } from './icons/Icons';

interface AlertCardProps {
  alert: Alert;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const getAlertDetails = () => {
    switch (alert.type) {
      case AlertType.Emergency:
        return { icon: <BellIcon className="w-6 h-6 text-white" />, color: 'bg-red-500' };
      case AlertType.CCTV:
        return { icon: <VideoCameraIcon className="w-6 h-6 text-white" />, color: 'bg-yellow-500' };
      case AlertType.IoT:
        return { icon: <HeartIcon className="w-6 h-6 text-white" />, color: 'bg-blue-500' };
      case AlertType.System:
        return { icon: <CogIcon className="w-6 h-6 text-white" />, color: 'bg-gray-500' };
      default:
        return { icon: <BellIcon className="w-6 h-6 text-white" />, color: 'bg-gray-500' };
    }
  };

  const { icon, color } = getAlertDetails();

  return (
    <div className={`flex items-start p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-md ${!alert.read ? 'border-l-4 border-blue-500' : ''}`}>
      <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full ${color}`}>
        {icon}
      </div>
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-start">
          <p className="font-bold text-gray-800 dark:text-white">{alert.title}</p>
          {!alert.read && <span className="h-2 w-2 rounded-full bg-blue-500"></span>}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{alert.message}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{new Date(alert.timestamp).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default AlertCard;
