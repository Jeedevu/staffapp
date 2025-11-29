import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { TaskStatus } from '../types';
import { ChevronLeftIcon, CheckCircleIcon, HeartIcon, ClipboardDocumentListIcon, BeakerIcon, ChartBarIcon } from '../components/icons/Icons';

const RecordReadingsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, getPatientById, updateTask } = useAppContext();

  const task = getTaskById(id!);
  const patient = task ? getPatientById(task.patientId) : undefined;

  const [heartRate, setHeartRate] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [notes, setNotes] = useState('');
  const [administeredMeds, setAdministeredMeds] = useState<string[]>([]);

  if (!task || !patient) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Task not found</h1>
        <button onClick={() => navigate(-1)} className="text-blue-500">Go Back</button>
      </div>
    );
  }

  const handleMedicationChange = (medName: string) => {
    setAdministeredMeds(prev =>
      prev.includes(medName)
        ? prev.filter(m => m !== medName)
        : [...prev, medName]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTask({
      ...task,
      status: TaskStatus.Completed,
      completedAt: new Date().toISOString(),
      readings: {
        heartRate: heartRate ? parseInt(heartRate, 10) : undefined,
        bloodPressure: bloodPressure || undefined,
        notes: notes || undefined,
        medicationsAdministered: administeredMeds,
      },
    });
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="flex items-center p-4 bg-white dark:bg-black border-b dark:border-gray-800">
        <button onClick={() => navigate(`/task/${id}`)} className="mr-4">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Record Vitals for {patient.name}</h1>
      </header>
      
      <main className="flex-1 p-4 overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-6">
            {task.medications && task.medications.length > 0 && (
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <BeakerIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Medications Administered
                </label>
                <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                  {task.medications.map(med => (
                    <label key={med.name} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 bg-gray-100 dark:bg-gray-900 focus:ring-blue-500"
                        checked={administeredMeds.includes(med.name)}
                        onChange={() => handleMedicationChange(med.name)}
                      />
                      <span className="ml-3 text-gray-700 dark:text-gray-300">{med.name} ({med.dosage})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          
            <div>
              <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heart Rate (bpm)</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <HeartIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="heartRate"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  placeholder="e.g., 85"
                  className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bloodPressure" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Pressure (mmHg)</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                   <ChartBarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="bloodPressure"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  placeholder="e.g., 120/80"
                  className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes & Observations</label>
              <div className="relative">
                 <div className="pointer-events-none absolute top-3.5 left-0 flex items-center pl-3">
                  <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400" />
                </div>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="e.g., Patient is resting comfortably. No signs of distress."
                className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
              </div>
            </div>
          </div>
        </form>
      </main>
      
      <footer className="p-4 bg-white dark:bg-black border-t dark:border-gray-800">
        <button 
          onClick={handleSubmit} 
          className="w-full bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center"
        >
          <CheckCircleIcon className="w-6 h-6 mr-2" /> Submit & Complete Task
        </button>
      </footer>
    </div>
  );
};

export default RecordReadingsPage;