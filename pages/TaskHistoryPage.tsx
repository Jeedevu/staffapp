
import React, { useMemo, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { TaskStatus } from '../types';
import TaskCard from '../components/TaskCard';

const TaskHistoryPage: React.FC = () => {
  const { tasks } = useAppContext();
  const [filter, setFilter] = useState('All');

  const completedTasks = useMemo(() => {
    return tasks
      .filter(task => task.status === TaskStatus.Completed)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
  }, [tasks]);
  
  const tasksCompletedToday = completedTasks.filter(task => 
    new Date(task.completedAt!).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Task History</h1>
      
      <div className="bg-blue-500 text-white p-4 rounded-lg mb-6 shadow-lg">
        <p className="text-lg">Tasks Completed Today</p>
        <p className="text-4xl font-bold">{tasksCompletedToday}</p>
      </div>

      <div className="mb-4">
        {/* Mock filter buttons */}
        <div className="flex space-x-2">
          <button className={`px-3 py-1 rounded-full text-sm ${filter === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`} onClick={() => setFilter('All')}>All</button>
          <button className={`px-3 py-1 rounded-full text-sm ${filter === 'Today' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`} onClick={() => setFilter('Today')}>Today</button>
          <button className={`px-3 py-1 rounded-full text-sm ${filter === 'Week' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`} onClick={() => setFilter('Week')}>This Week</button>
        </div>
      </div>

      {completedTasks.length > 0 ? (
        completedTasks.map(task => <TaskCard key={task.id} task={task} />)
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No completed tasks yet.</p>
      )}
    </div>
  );
};

export default TaskHistoryPage;
