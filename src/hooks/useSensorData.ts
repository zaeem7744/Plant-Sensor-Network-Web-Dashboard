import { useState, useEffect, useCallback } from 'react';
import { 
  generateCurrentReadings, 
  generateHistoricalData, 
  generateOverviewStats,
  SensorStatus,
  SensorReading 
} from '@/lib/mockData';

// Polling interval in milliseconds
const POLLING_INTERVAL = 3000;

export const useSensorData = () => {
  const [sensors, setSensors] = useState<SensorStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSensors = useCallback(() => {
    try {
      const data = generateCurrentReadings();
      setSensors(data);
      setError(null);
    } catch (err) {
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

export const useOverviewStats = () => {
  const [stats, setStats] = useState<ReturnType<typeof generateOverviewStats> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = () => {
      const data = generateOverviewStats();
      setStats(data);
      setLoading(false);
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
    setLoading(true);
    // Simulate API delay
    const timer = setTimeout(() => {
      const readings = generateHistoricalData(sensorId, parameter, hours);
      setData(readings);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [sensorId, parameter, hours]);

  return { data, loading };
};
