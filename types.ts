export enum TaskPriority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface Medication {
  name: string;
  dosage: string;
}

export interface TaskReadings {
  heartRate?: number;
  bloodPressure?: string;
  notes?: string;
  medicationsAdministered?: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  patientId: string;
  roomId: string;
  createdAt: string;
  completedAt?: string;
  qrVerified: boolean;
  cctvInsights?: string[];
  iotAlerts?: string[];
  readings?: TaskReadings;
  medications?: Medication[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: string;
  roomNumber: string;
}

export interface Room {
  id: string;
  number: string;
  qrCodeValue: string;
}

export enum AlertType {
  Emergency = 'Emergency',
  CCTV = 'CCTV',
  IoT = 'IoT',
  System = 'System'
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  roomId?: string;
}

export interface Emergency {
  id: string;
  timestamp: string;
  note?: string;
  acknowledged: boolean;
}