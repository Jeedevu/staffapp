

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Task, Patient, Room, Alert, Emergency, TaskStatus, TaskPriority } from '../types';
import { MOCK_TASKS, MOCK_PATIENTS, MOCK_ROOMS, MOCK_ALERTS, MOCK_EMERGENCIES } from '../data/mockData';
import { supabase } from '../utils/supabaseClient';

interface AppContextType {
  tasks: Task[];
  patients: Patient[];
  rooms: Room[];
  alerts: Alert[];
  emergencies: Emergency[];
  getTaskById: (id: string) => Task | undefined;
  getPatientById: (id: string) => Patient | undefined;
  getRoomById: (id: string) => Room | undefined;
  updateTask: (updatedTask: Task) => void;
  triggerEmergency: (note?: string, location?: string, emergencyType?: string) => Promise<void>;
  markAlertsAsRead: () => void;
  getUnreadAlertsCount: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to get current staff info (you can enhance this with actual auth)
const getCurrentStaffInfo = () => {
  return {
    name: 'Nurse Sarah',
    role: 'Nurse',
    department: 'General Ward'
  };
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS); // Use mock data instead of Supabase
  const [patients] = useState<Patient[]>(MOCK_PATIENTS);
  const [rooms] = useState<Room[]>(MOCK_ROOMS);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [emergencies, setEmergencies] = useState<Emergency[]>(MOCK_EMERGENCIES);

  // SUPABASE INTEGRATION DISABLED - Using mock data for now
  // Uncomment the code below to re-enable Supabase integration

  /*
  // Fetch tasks from Supabase - defined as useCallback so it can be reused
  const fetchTasks = useCallback(async () => {
    console.log('🔄 Fetching tasks from Supabase...');
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching tasks:', error);
      console.log('📋 Falling back to mock tasks');
      setTasks(MOCK_TASKS); // Fallback
    } else if (data) {
      console.log(`✅ Fetched ${data.length} tasks from Supabase:`, data);
      // Map Supabase tasks to local Task interface

      // Helper to map DB status to Enum
      const mapStatus = (status: string): TaskStatus => {
        const s = status.toLowerCase();
        if (s === 'in_progress' || s === 'inprogress') return TaskStatus.InProgress;
        if (s === 'pending') return TaskStatus.Pending;
        if (s === 'completed') return TaskStatus.Completed;
        if (s === 'cancelled') return TaskStatus.Cancelled;
        return (s.charAt(0).toUpperCase() + s.slice(1)) as TaskStatus;
      };

      const mappedTasks: Task[] = data.map(t => ({
        id: t.id,
        title: t.title,
        description: t.title, // Use title as description if missing
        priority: (t.priority.charAt(0).toUpperCase() + t.priority.slice(1)) as TaskPriority,
        status: mapStatus(t.status),
        patientId: t.patient_id || 'unknown',
        roomId: t.room || 'unknown',
        createdAt: t.created_at,
        qrVerified: false
      }));
      console.log(`📝 Mapped ${mappedTasks.length} tasks:`, mappedTasks);
      setTasks(mappedTasks);
    }
  }, []);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();

    // Real-time subscription for new tasks
    const taskSubscription = supabase
      .channel('public:tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
        console.log('Real-time task update:', payload);
        fetchTasks(); // Refresh list on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(taskSubscription);
    };
  }, [fetchTasks]);
  */

  const getTaskById = useCallback((id: string) => tasks.find(task => task.id === id), [tasks]);
  const getPatientById = useCallback((id: string) => patients.find(p => p.id === id), [patients]);
  const getRoomById = useCallback((id: string) => rooms.find(room => room.id === id), [rooms]);

  const updateTask = async (updatedTask: Task) => {
    console.log('📝 Updating task:', updatedTask);

    // Update local state only (Supabase disabled)
    setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));

    console.log('✅ Task updated in local state (Supabase disabled)');

    /* SUPABASE SYNC DISABLED
    // Convert status and priority to lowercase for Supabase
    const statusMap: Record<string, string> = {
      'Pending': 'pending',
      'In Progress': 'in_progress',
      'Completed': 'completed',
      'Cancelled': 'cancelled'
    };

    const priorityMap: Record<string, string> = {
      'High': 'high',
      'Medium': 'medium',
      'Low': 'low'
    };

    const dbStatus = statusMap[updatedTask.status] || updatedTask.status.toLowerCase();
    const dbPriority = priorityMap[updatedTask.priority] || updatedTask.priority.toLowerCase();

    // Update Supabase for any status change
    const updateData: any = {
      status: dbStatus,
      priority: dbPriority
    };

    if (updatedTask.status === TaskStatus.Completed) {
      updateData.completed_at = new Date().toISOString();
    }

    console.log('💾 Syncing to Supabase:', { id: updatedTask.id, updateData });

    const { error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', updatedTask.id);

    if (error) {
      console.error('❌ Error updating task in Supabase:', error);
      // Revert optimistic update if needed
      fetchTasks();
    } else {
      console.log('✅ Task updated successfully in Supabase');
    }
    */
  };

  const triggerEmergency = async (note?: string, location?: string, emergencyType: string = 'Medical Emergency') => {
    const staffInfo = getCurrentStaffInfo();
    const timestamp = new Date().toISOString();

    // Match the actual Supabase schema: id, type, room, triggered_by, status, created_at
    const emergencyData = {
      type: emergencyType,
      room: location || null,
      triggered_by: 'ea283dbc-a4e5-4f98-bb95-8eaba784d0de', // Staff UUID (replace with actual auth user ID)
      status: 'active',
      created_at: timestamp,
    };

    try {
      // Insert into Supabase emergencies table
      const { data, error } = await supabase
        .from('emergencies')
        .insert([emergencyData])
        .select()
        .single();

      if (error) {
        console.error('Error inserting emergency into Supabase:', error);
        // Fall back to local state
        const newEmergency: Emergency = {
          id: `emg-${Date.now()}`,
          timestamp,
          note,
          acknowledged: false,
        };
        setEmergencies(prev => [newEmergency, ...prev]);
      } else {
        console.log('✅ Emergency successfully sent to Supabase:', data);
        // Update local state with Supabase data
        const newEmergency: Emergency = {
          id: data.id,
          timestamp: data.created_at,
          note: note || `${emergencyType} - ${location || 'General Ward'}`,
          acknowledged: false,
        };
        setEmergencies(prev => [newEmergency, ...prev]);
      }

      // Simulate acknowledgment for demo (remove in production)
      setTimeout(() => {
        setEmergencies(prev => prev.map(emg =>
          emg.timestamp === timestamp ? { ...emg, acknowledged: true } : emg
        ));
      }, 5000);

    } catch (err) {
      console.error('Error triggering emergency:', err);
    }
  };

  const markAlertsAsRead = () => {
    setAlerts(prevAlerts => prevAlerts.map(alert => ({ ...alert, read: true })));
  };

  const getUnreadAlertsCount = () => {
    return alerts.filter(a => !a.read).length;
  };

  const value = {
    tasks,
    patients,
    rooms,
    alerts,
    emergencies,
    getTaskById,
    getPatientById,
    getRoomById,
    updateTask,
    triggerEmergency,
    markAlertsAsRead,
    getUnreadAlertsCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
