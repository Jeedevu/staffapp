import { Task, Patient, Room, Alert, Emergency, TaskStatus, TaskPriority, AlertType, Medication } from '../types';

export const MOCK_ROOMS: Room[] = [
  { id: 'room-101', number: '101', qrCodeValue: 'SURGE-MIND-ROOM-101' },
  { id: 'room-102', number: '102', qrCodeValue: 'SURGE-MIND-ROOM-102' },
  { id: 'room-103', number: '103', qrCodeValue: 'SURGE-MIND-ROOM-103' },
  { id: 'room-205', number: '205', qrCodeValue: 'SURGE-MIND-ROOM-205' },
];

export const MOCK_PATIENTS: Patient[] = [
  { id: 'p-001', name: 'John Doe', age: 78, gender: 'Male', condition: 'Post-op recovery', roomNumber: '101' },
  { id: 'p-002', name: 'Jane Smith', age: 65, gender: 'Female', condition: 'Pneumonia', roomNumber: '102' },
  { id: 'p-003', name: 'Peter Jones', age: 55, gender: 'Male', condition: 'Stable', roomNumber: '103' },
  { id: 'p-004', name: 'Mary Williams', age: 82, gender: 'Female', condition: 'Observation', roomNumber: '205' },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Administer 8am Medication',
    description: 'Administer required morning medications as per the chart.',
    priority: TaskPriority.High,
    status: TaskStatus.Pending,
    patientId: 'p-001',
    roomId: 'room-101',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    qrVerified: false,
    iotAlerts: ['Heart rate slightly elevated (95bpm)'],
    medications: [
      { name: 'Paracetamol', dosage: '500mg' },
      { name: 'Amlodipine', dosage: '10mg' },
    ]
  },
  {
    id: 'task-2',
    title: 'Check Vital Signs',
    description: 'Record blood pressure, heart rate, and temperature.',
    priority: TaskPriority.Medium,
    status: TaskStatus.Pending,
    patientId: 'p-002',
    roomId: 'room-102',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    qrVerified: false,
  },
  {
    id: 'task-3',
    title: 'Assist with Morning Hygiene',
    description: 'Help patient with washing and changing.',
    priority: TaskPriority.Low,
    status: TaskStatus.Pending,
    patientId: 'p-003',
    roomId: 'room-103',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    qrVerified: false,
  },
  {
    id: 'task-4',
    title: 'Hourly Round & Medication',
    description: 'Check on patient comfort and administer pain relief if requested.',
    priority: TaskPriority.Medium,
    status: TaskStatus.Completed,
    patientId: 'p-004',
    roomId: 'room-205',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    completedAt: new Date(Date.now() - 13000000).toISOString(),
    qrVerified: true,
    medications: [{ name: 'Ibuprofen', dosage: '200mg' }],
    readings: {
      heartRate: 72,
      bloodPressure: '122/78',
      notes: 'Patient is sleeping soundly. Administered Ibuprofen as scheduled.',
      medicationsAdministered: ['Ibuprofen'],
    }
  },
   {
    id: 'task-5',
    title: 'Change IV Drip',
    description: 'Replace saline IV drip bag.',
    priority: TaskPriority.High,
    status: TaskStatus.Pending,
    patientId: 'p-002',
    roomId: 'room-102',
    createdAt: new Date(Date.now() - 600000).toISOString(),
    qrVerified: false,
    cctvInsights: ['Patient seems agitated.'],
  },
];

export const MOCK_ALERTS: Alert[] = [
  { id: 'alert-1', type: AlertType.IoT, title: 'Oxygen Drop', message: 'Patient in Room 102 oxygen saturation dropped to 89%.', timestamp: new Date(Date.now() - 120000).toISOString(), read: false, roomId: 'room-102' },
  { id: 'alert-2', type: AlertType.CCTV, title: 'Fall Detected', message: 'Potential fall detected in Room 101. Please check immediately.', timestamp: new Date(Date.now() - 300000).toISOString(), read: false, roomId: 'room-101' },
  { id: 'alert-3', type: AlertType.System, title: 'Schedule Change', message: 'Your shift for tomorrow has been updated. Please review.', timestamp: new Date(Date.now() - 9000000).toISOString(), read: true },
  { id: 'alert-4', type: AlertType.IoT, title: 'Device Offline', message: 'ECG monitor in Room 103 is offline.', timestamp: new Date(Date.now() - 86400000).toISOString(), read: true, roomId: 'room-103' },
];

export const MOCK_EMERGENCIES: Emergency[] = [];