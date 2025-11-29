import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { TaskStatus } from '../types';
import { ChevronLeftIcon, UserIcon, BedIcon, ClockIcon, QrCodeIcon, VideoCameraIcon, HeartIcon } from '../components/icons/Icons';

const TaskDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, getPatientById, getRoomById } = useAppContext();
  
  const task = getTaskById(id!);
  const patient = task ? getPatientById(task.patientId) : undefined;
  const room = task ? getRoomById(task.roomId) : undefined;
  
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: number | undefined;
    if (task?.status === TaskStatus.InProgress) {
      interval = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [task?.status]);

  if (!task || !patient || !room) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Task not found</h1>
        <button onClick={() => navigate(-1)} className="text-blue-500">Go Back</button>
      </div>
    );
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const canRecordVitals = task.status === TaskStatus.InProgress && task.qrVerified;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="flex items-center p-4 bg-white dark:bg-black border-b dark:border-gray-800">
        <button onClick={() => navigate('/')} className="mr-4">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">{task.title}</h1>
      </header>
      
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Task Details</h2>
          <p>{task.description}</p>
          {task.medications && task.medications.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-600 dark:text-gray-400">Medications to Administer:</h3>
              <ul className="list-disc list-inside mt-1 text-gray-600 dark:text-gray-300">
                {task.medications.map(med => (
                  <li key={med.name}>{med.name} ({med.dosage})</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Patient & Room</h2>
          <div className="space-y-2 text-gray-600 dark:text-gray-300">
            <p className="flex items-center"><UserIcon className="w-5 h-5 mr-2" /> {patient.name} ({patient.age}, {patient.gender})</p>
            <p className="flex items-center"><BedIcon className="w-5 h-5 mr-2" /> Room {room.number}</p>
          </div>
        </div>

        {(task.cctvInsights || task.iotAlerts) && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">AI Insights</h2>
                <div className="space-y-2">
                    {task.cctvInsights?.map((insight, i) => (
                        <p key={`cctv-${i}`} className="flex items-center text-sm text-yellow-700 dark:text-yellow-300"><VideoCameraIcon className="w-4 h-4 mr-2" />{insight}</p>
                    ))}
                    {task.iotAlerts?.map((alert, i) => (
                        <p key={`iot-${i}`} className="flex items-center text-sm text-yellow-700 dark:text-yellow-300"><HeartIcon className="w-4 h-4 mr-2" />{alert}</p>
                    ))}
                </div>
            </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Status</h2>
            {task.status === TaskStatus.InProgress && (
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                    <ClockIcon className="w-5 h-5 mr-2 animate-spin"/> Task in progress... ({formatTime(timer)})
                </div>
            )}
             <div className={`flex items-center font-semibold mt-2 ${task.qrVerified ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                <QrCodeIcon className="w-5 h-5 mr-2" />
                QR Verification: {task.qrVerified ? 'Complete' : 'Pending'}
             </div>
        </div>
        
        {task.status === TaskStatus.Completed && task.readings && (
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
             <h2 className="text-lg font-semibold mb-2">Recorded Vitals & Actions</h2>
             <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {task.readings.heartRate && <p><span className="font-semibold">Heart Rate:</span> {task.readings.heartRate} bpm</p>}
                {task.readings.bloodPressure && <p><span className="font-semibold">Blood Pressure:</span> {task.readings.bloodPressure} mmHg</p>}
                {task.readings.medicationsAdministered && task.readings.medicationsAdministered.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="font-semibold">Medications Administered:</p>
                    <ul className="list-disc list-inside">
                      {task.readings.medicationsAdministered.map(medName => (
                        <li key={medName}>{medName}</li>
                      ))}
                    </ul>
                  </div>
                 )}
                {task.readings.notes && <p className="whitespace-pre-wrap pt-2 mt-2 border-t border-gray-200 dark:border-gray-700"><span className="font-semibold">Notes:</span> {task.readings.notes}</p>}
             </div>
           </div>
        )}
      </main>
      
      <footer className="p-4 bg-white dark:bg-black border-t dark:border-gray-800">
        {task.status === TaskStatus.Pending && (
          <button onClick={() => navigate(`/scan/${task.id}`)} className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center">
            <QrCodeIcon className="w-6 h-6 mr-2" /> Start Task & Scan QR
          </button>
        )}
        {task.status === TaskStatus.InProgress && !task.qrVerified && (
            <button onClick={() => navigate(`/scan/${task.id}`)} className="w-full bg-yellow-500 text-white font-bold py-3 rounded-lg flex items-center justify-center">
                <QrCodeIcon className="w-6 h-6 mr-2" /> Verify with QR
            </button>
        )}
        {canRecordVitals && (
          <button onClick={() => navigate(`/record/${task.id}`)} className="w-full bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center">
            <HeartIcon className="w-6 h-6 mr-2" /> Record Vitals
          </button>
        )}
      </footer>
    </div>
  );
};

export default TaskDetailsPage;