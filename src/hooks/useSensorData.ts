import { useState, useEffect, useCallback } from 'react';
import type { 
  SensorStatus,
  SensorReading 
} from '@/lib/mockData';

// Base URL for the Python backend (FastAPI)
// Adjust this if you deploy the backend elsewhere.
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Polling interval in milliseconds
const POLLING_INTERVAL = 3000;

export const useSensorData = () => {
  const [sensors, setSensors] = useState<SensorStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSensors = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/sensors/current`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data: SensorStatus[] = await res.json();
      setSensors(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch sensor data', err);
      setError('Failed to fetch sensor data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSensors();
    const interval = setInterval(fetchSensors, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchSensors]);

  return { sensors, loading, error, refetch: fetchSensors };
};

export interface OverviewStats {
  totalSensors: number;
  onlineSensors: number;
  offlineSensors: number;
  totalMeasurements: number;
  avgTemperature: number | null;
  avgHumidity: number | null;
}

export const useOverviewStats = () => {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/overview`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data: OverviewStats = await res.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch overview stats', err);
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading };
};

export const useSensorHistory = (
  sensorId: string,
  parameter: string,
  hours: number = 24
) => {
  const [data, setData] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const url = new URL(`${API_BASE_URL}/api/sensors/history`);
        url.searchParams.set('sensor_id', sensorId);
        url.searchParams.set('parameter', parameter);
        url.searchParams.set('hours', String(hours));

        const res = await fetch(url.toString());
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const readings: SensorReading[] = await res.json();
        setData(readings);
      } catch (err) {
        console.error('Failed to fetch sensor history', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [sensorId, parameter, hours]);

  return { data, loading };
};
