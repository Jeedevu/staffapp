
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AlertType } from '../types';
import AlertCard from '../components/AlertCard';

const AlertsPage: React.FC = () => {
  const { alerts, markAlertsAsRead } = useAppContext();
  const [filter, setFilter] = useState<AlertType | 'All'>('All');
  
  useEffect(() => {
    // Mark alerts as read when the page is viewed
    const timeoutId = setTimeout(markAlertsAsRead, 2000);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredAlerts = alerts.filter(alert => filter === 'All' || alert.type === filter);
  
  const filters: { label: string, value: AlertType | 'All'}[] = [
    { label: 'All', value: 'All' },
    { label: 'IoT', value: AlertType.IoT },
    { label: 'CCTV', value: AlertType.CCTV },
    { label: 'System', value: AlertType.System },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Alerts & Notifications</h1>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {filters.map(f => (
           <button 
             key={f.value}
             onClick={() => setFilter(f.value)}
             className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap ${filter === f.value ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
           >
             {f.label}
           </button>
        ))}
      </div>
      
      {filteredAlerts.length > 0 ? (
        filteredAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No alerts in this category.</p>
      )}
    </div>
  );
};

export default AlertsPage;
