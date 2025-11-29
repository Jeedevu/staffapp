
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { TaskStatus } from '../types';
import { QrCodeIcon, CheckCircleIcon, XCircleIcon, ChevronLeftIcon } from '../components/icons/Icons';

const QRScannerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, getRoomById, updateTask } = useAppContext();
  
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const task = getTaskById(id!);
  const room = task ? getRoomById(task.roomId) : undefined;
  
  const handleScan = () => {
    if (!task || !room) {
      setErrorMessage('Task or Room data is missing.');
      setScanStatus('error');
      return;
    }

    setScanStatus('scanning');
    
    // Simulate a scan with a delay
    setTimeout(() => {
      // Simulate a 90% success rate
      if (Math.random() > 0.1) {
        setScanStatus('success');
        updateTask({ ...task, qrVerified: true, status: TaskStatus.InProgress });
        setTimeout(() => navigate(`/record/${id}`), 1500);
      } else {
        setErrorMessage('QR code does not match. Please scan the correct room.');
        setScanStatus('error');
      }
    }, 2000);
  };

  const getStatusContent = () => {
    switch(scanStatus) {
      case 'scanning':
        return (
          <div className="text-center text-white">
            <div className="animate-pulse">
                <QrCodeIcon className="w-24 h-24 mx-auto mb-4" />
                <p className="text-xl font-semibold">Scanning...</p>
            </div>
          </div>
        );
      case 'success':
        return (
          <div className="text-center text-green-300">
            <CheckCircleIcon className="w-24 h-24 mx-auto mb-4" />
            <p className="text-xl font-semibold">Verified!</p>
            <p>Room {room?.number} confirmed.</p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center text-red-300">
            <XCircleIcon className="w-24 h-24 mx-auto mb-4" />
            <p className="text-xl font-semibold">Verification Failed</p>
            <p>{errorMessage}</p>
          </div>
        );
      case 'idle':
      default:
        return (
          <div className="text-center text-white/80">
            <QrCodeIcon className="w-24 h-24 mx-auto mb-4" />
            <p className="text-xl font-semibold">Ready to Scan</p>
            <p>Tap to verify you are at Room {room?.number}.</p>
          </div>
        );
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex items-center p-4 bg-black/30 absolute top-0 left-0 right-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">QR Verification</h1>
      </header>

      <main 
        className="flex-1 flex flex-col items-center justify-center p-8 cursor-pointer"
        onClick={scanStatus === 'idle' || scanStatus === 'error' ? handleScan : undefined}
      >
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          <div className="absolute inset-0 border-4 border-dashed border-white/50 rounded-lg animate-pulse"></div>
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>
          {/* This is a placeholder for a camera feed */}
          <div className="w-full h-full bg-black/50 flex items-center justify-center">
            {getStatusContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default QRScannerPage;
