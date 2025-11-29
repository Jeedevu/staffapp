
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { ShieldExclamationIcon, CheckCircleIcon } from '../components/icons/Icons';

const EmergencyPage: React.FC = () => {
  const navigate = useNavigate();
  const { triggerEmergency, emergencies } = useAppContext();
  const [note, setNote] = useState('');
  const [isTriggered, setIsTriggered] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (isTriggered) {
      const latestEmergency = emergencies[0];
      if (latestEmergency && latestEmergency.acknowledged) {
        setAcknowledged(true);
      }
    }
  }, [emergencies, isTriggered]);

  const handleTrigger = () => {
    triggerEmergency(note);
    setIsTriggered(true);
  };

  if (isTriggered) {
    return (
      <div className="flex flex-col h-screen bg-red-800 text-white p-8 items-center justify-center text-center">
        <ShieldExclamationIcon className="w-24 h-24 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Emergency Alert Sent</h1>
        <p className="text-lg mb-8">Management has been notified. Help is on the way.</p>
        
        <div className={`flex items-center p-4 rounded-lg transition-colors duration-500 ${acknowledged ? 'bg-green-500' : 'bg-white/20 animate-pulse'}`}>
          {acknowledged && <CheckCircleIcon className="w-6 h-6 mr-3" />}
          <p className="font-semibold">{acknowledged ? 'Acknowledged by Admin' : 'Awaiting Acknowledgment...'}</p>
        </div>
        
        <button
          onClick={() => navigate('/')}
          className="mt-12 bg-white text-red-800 font-bold py-3 px-8 rounded-full"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-red-600 text-white p-8">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <ShieldExclamationIcon className="w-20 h-20 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Confirm Emergency</h1>
        <p className="mb-8">This will send an immediate alert to all managers and security personnel.</p>
        
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add an optional note (e.g., patient unresponsive, cardiac arrest)..."
          className="w-full h-24 p-3 bg-white/20 rounded-lg placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white mb-8"
        ></textarea>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={handleTrigger}
          className="w-full bg-white text-red-600 font-bold text-xl py-4 rounded-lg shadow-2xl"
        >
          CONFIRM AND SEND ALERT
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-transparent border-2 border-white/50 text-white font-bold py-3 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EmergencyPage;
