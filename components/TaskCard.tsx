
import React from 'react';
import { Link } from 'react-router-dom';
import { Task, TaskPriority } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { ChevronRightIcon, BedIcon, UserIcon } from './icons/Icons';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { getPatientById } = useAppContext();
  const patient = getPatientById(task.patientId);

  const priorityStyles: { [key in TaskPriority]: string } = {
    [TaskPriority.High]: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border-red-500',
    [TaskPriority.Medium]: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 border-yellow-500',
    [TaskPriority.Low]: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border-blue-500',
  };

  const priorityDotStyles: { [key in TaskPriority]: string } = {
    [TaskPriority.High]: 'bg-red-500',
    [TaskPriority.Medium]: 'bg-yellow-500',
    [TaskPriority.Low]: 'bg-blue-500',
  };

  return (
    <Link to={`/task/${task.id}`} className={`block bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4 border-l-4 ${priorityStyles[task.priority]}`}>
      <div className="p-4 flex items-center justify-between">
        <div>
          <div className="flex items-center mb-1">
            <span className={`h-2.5 w-2.5 rounded-full ${priorityDotStyles[task.priority]} mr-2`}></span>
            <p className="font-bold text-gray-800 dark:text-white">{task.title}</p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-4">
            <div className="flex items-center">
              <UserIcon className="w-4 h-4 mr-1" />
              <span>{patient?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <BedIcon className="w-4 h-4 mr-1" />
              <span>Room {patient?.roomNumber || 'N/A'}</span>
            </div>
          </div>
        </div>
        <ChevronRightIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
      </div>
    </Link>
  );
};

export default TaskCard;
