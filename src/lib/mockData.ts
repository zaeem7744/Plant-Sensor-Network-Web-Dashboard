// Mock data generator for development
// Replace with actual API calls when connecting to FastAPI backend

import { SENSORS } from './sensors';

export interface SensorReading {
  timestamp: string;
  sensor_id: string;
  parameter: string;
  value: number;
  unit: string;
}

export interface SensorStatus {
  id: string;
  name: string;
  category: string;
  online: boolean;
  lastSeen: string;
  readings: Record<string, { value: number; unit: string }>;
  status?: 'online' | 'offline' | 'warming_up'; // Hardware status from firmware
}

// Generate a random value within a range with some noise
const randomInRange = (min: number, max: number, base?: number): number => {
  if (base !== undefined) {
    // Add small variation around base value
    const variation = (max - min) * 0.05;
    return Math.max(min, Math.min(max, base + (Math.random() - 0.5) * variation * 2));
  }
  return min + Math.random() * (max - min);
};

// Base values for realistic sensor readings
const BASE_VALUES: Record<string, Record<string, number>> = {
  MS8607: { temperature_c: 24.5, humidity_rh: 55, pressure_hpa: 1013 },
  BH1750: { lux: 450 },
  ALCOHOL: { alcohol_ppm: 2.5 },
  CH4: { ch4_lel_percent: 0.5, module_temp_c: 32, error_code: 0 },
  SOIL_EC_PH: { ec_mS_cm: 1.2, ph: 6.8 },
  HCHO: { hcho_ppm: 0.02 },
  H2S: { h2s_ppm: 0.1 },
  O2: { o2_percent_vol: 20.9 },
  NH3: { nh3_ppm: 0.8 },
  CO: { co_ppm: 1.5 },
  O3: { o3_ppm: 0.03 },
};

// Simulate some sensors being offline
const OFFLINE_SENSORS = new Set<string>(); // Empty for now, all online

export const generateCurrentReadings = (): SensorStatus[] => {
  const now = new Date();
  
  return SENSORS.map(sensor => {
    const isOnline = !OFFLINE_SENSORS.has(sensor.id);
    const lastSeen = isOnline 
      ? now.toISOString()
      : new Date(now.getTime() - Math.random() * 3600000).toISOString(); // Random time in last hour

    const readings: Record<string, { value: number; unit: string }> = {};
    
    if (isOnline) {
      sensor.parameters.forEach(param => {
        const baseValue = BASE_VALUES[sensor.id]?.[param.key];
        const value = randomInRange(param.min ?? 0, param.max ?? 100, baseValue);
        readings[param.key] = {
          value: Math.round(value * 100) / 100,
          unit: param.unit,
        };
      });
    }

    return {
      id: sensor.id,
      name: sensor.name,
      category: sensor.category,
      online: isOnline,
      lastSeen,
      readings,
    };
  });
};

export const generateHistoricalData = (
  sensorId: string,
  parameter: string,
  hours: number = 24
): SensorReading[] => {
  const sensor = SENSORS.find(s => s.id === sensorId);
  const param = sensor?.parameters.find(p => p.key === parameter);
  
  if (!sensor || !param) return [];

  const readings: SensorReading[] = [];
  const now = new Date();
  const intervalMs = 60000; // 1 minute intervals
  const numPoints = Math.min((hours * 60), 1440); // Max 1440 points (24 hours)
  
  let baseValue = BASE_VALUES[sensorId]?.[parameter] ?? (param.min ?? 0 + (param.max ?? 100 - (param.min ?? 0)) / 2);

  for (let i = numPoints; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * intervalMs);
    
    // Add some time-based variation (simulating day/night cycles for temp, light, etc.)
    const hourOfDay = timestamp.getHours();
    let timeMultiplier = 1;
    
    if (parameter === 'temperature_c') {
      timeMultiplier = 1 + Math.sin((hourOfDay - 6) * Math.PI / 12) * 0.15;
    } else if (parameter === 'lux') {
      timeMultiplier = hourOfDay >= 6 && hourOfDay <= 20 
        ? Math.sin((hourOfDay - 6) * Math.PI / 14)
        : 0.05;
    } else if (parameter === 'humidity_rh') {
      timeMultiplier = 1 - Math.sin((hourOfDay - 6) * Math.PI / 12) * 0.1;
    }

    const value = randomInRange(
      param.min ?? 0,
      param.max ?? 100,
      baseValue * timeMultiplier
    );

    readings.push({
      timestamp: timestamp.toISOString(),
      sensor_id: sensorId,
      parameter,
      value: Math.round(value * 1000) / 1000,
      unit: param.unit,
    });
  }

  return readings;
};

export const generateOverviewStats = () => {
  const sensors = generateCurrentReadings();
  const onlineSensors = sensors.filter(s => s.online);
  
  // Calculate averages for key metrics
  const tempReadings = onlineSensors
    .filter(s => s.readings.temperature_c)
    .map(s => s.readings.temperature_c.value);
  const humidityReadings = onlineSensors
    .filter(s => s.readings.humidity_rh)
    .map(s => s.readings.humidity_rh.value);

  return {
    totalSensors: SENSORS.length,
    onlineSensors: onlineSensors.length,
    offlineSensors: SENSORS.length - onlineSensors.length,
    totalMeasurements: Math.floor(Math.random() * 50000) + 100000, // Mock total
    avgTemperature: tempReadings.length > 0 
      ? Math.round(tempReadings.reduce((a, b) => a + b, 0) / tempReadings.length * 10) / 10
      : null,
    avgHumidity: humidityReadings.length > 0
      ? Math.round(humidityReadings.reduce((a, b) => a + b, 0) / humidityReadings.length * 10) / 10
      : null,
  };
};
