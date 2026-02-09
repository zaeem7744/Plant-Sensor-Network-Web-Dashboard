// Sensor definitions matching the ESP32 firmware
export interface SensorParameter {
  key: string;
  label: string;
  unit: string;
  min?: number;
  max?: number;
  warningThreshold?: number;
  dangerThreshold?: number;
}

export interface SensorDefinition {
  id: string;
  name: string;
  description: string;
  category: 'environment' | 'light' | 'gas' | 'soil' | 'temperature';
  icon: string;
  parameters: SensorParameter[];
}

export const SENSORS: SensorDefinition[] = [
  {
    id: 'MS8607',
    name: 'MS8607 Environment',
    description: 'Temperature, humidity, and barometric pressure sensor',
    category: 'environment',
    icon: 'Thermometer',
    parameters: [
      { key: 'temperature_c', label: 'Temperature', unit: '°C', min: -10, max: 50 },
      { key: 'humidity_rh', label: 'Humidity', unit: '%RH', min: 0, max: 100 },
      { key: 'pressure_hpa', label: 'Pressure', unit: 'hPa', min: 900, max: 1100 },
    ],
  },
  {
    id: 'BH1750',
    name: 'BH1750 Light',
    description: 'Ambient light intensity sensor',
    category: 'light',
    icon: 'Sun',
    parameters: [
      { key: 'lux', label: 'Light Intensity', unit: 'lux', min: 0, max: 65535 },
    ],
  },
  {
    id: 'MLX90614',
    name: 'MLX90614 IR Temperature',
    description: 'Non-contact infrared temperature sensor',
    category: 'temperature',
    icon: 'Thermometer',
    parameters: [
      { key: 'object_temp_c', label: 'Object Temperature', unit: '°C', min: -40, max: 125 },
    ],
  },
  {
    id: 'SOIL_CAP_I2C',
    name: 'Soil Moisture (I2C)',
    description: 'Capacitive soil moisture sensor',
    category: 'soil',
    icon: 'Droplet',
    parameters: [
      { key: 'moisture', label: 'Soil Moisture', unit: '', min: 200, max: 2000 },
    ],
  },
  {
    id: 'ALCOHOL',
    name: 'Alcohol Sensor',
    description: 'DFRobot alcohol concentration sensor',
    category: 'gas',
    icon: 'Wine',
    parameters: [
      { key: 'alcohol_ppm', label: 'Alcohol', unit: 'ppm', min: 0, max: 100, warningThreshold: 20, dangerThreshold: 50 },
    ],
  },
  {
    id: 'CH4',
    name: 'CH₄ Methane',
    description: 'MHZ9041A methane gas sensor',
    category: 'gas',
    icon: 'Flame',
    parameters: [
      { key: 'ch4_lel_percent', label: 'CH₄ LEL', unit: '%LEL', min: 0, max: 100, warningThreshold: 10, dangerThreshold: 25 },
      { key: 'module_temp_c', label: 'Module Temp', unit: '°C', min: 0, max: 60 },
      { key: 'error_code', label: 'Error Code', unit: '', min: 0, max: 255 },
    ],
  },
  {
    id: 'SOIL_EC_PH',
    name: 'Soil EC + pH',
    description: 'RS485 soil electrical conductivity and pH probe',
    category: 'soil',
    icon: 'Sprout',
    parameters: [
      { key: 'ec_mS_cm', label: 'EC', unit: 'mS/cm', min: 0, max: 20 },
      { key: 'ph', label: 'pH', unit: 'pH', min: 0, max: 14 },
    ],
  },
  {
    id: 'HCHO_UART',
    name: 'HCHO Formaldehyde',
    description: 'Formaldehyde concentration sensor',
    category: 'gas',
    icon: 'AlertTriangle',
    parameters: [
      { key: 'hcho_ppm', label: 'Formaldehyde', unit: 'ppm', min: 0, max: 5, warningThreshold: 0.08, dangerThreshold: 0.1 },
    ],
  },
  {
    id: 'H2S',
    name: 'H₂S Hydrogen Sulfide',
    description: 'MultiGas hydrogen sulfide sensor',
    category: 'gas',
    icon: 'Cloud',
    parameters: [
      { key: 'h2s_ppm', label: 'H₂S', unit: 'ppm', min: 0, max: 100, warningThreshold: 10, dangerThreshold: 20 },
    ],
  },
  {
    id: 'O2',
    name: 'O₂ Oxygen',
    description: 'MultiGas oxygen concentration sensor',
    category: 'gas',
    icon: 'Wind',
    parameters: [
      { key: 'o2_percent_vol', label: 'Oxygen', unit: '%vol', min: 0, max: 25 },
    ],
  },
  {
    id: 'NH3',
    name: 'NH₃ Ammonia',
    description: 'MultiGas ammonia sensor',
    category: 'gas',
    icon: 'Droplets',
    parameters: [
      { key: 'nh3_ppm', label: 'Ammonia', unit: 'ppm', min: 0, max: 100, warningThreshold: 25, dangerThreshold: 50 },
    ],
  },
  {
    id: 'CO',
    name: 'CO Carbon Monoxide',
    description: 'MultiGas carbon monoxide sensor',
    category: 'gas',
    icon: 'CircleDot',
    parameters: [
      { key: 'co_ppm', label: 'CO', unit: 'ppm', min: 0, max: 1000, warningThreshold: 35, dangerThreshold: 100 },
    ],
  },
  {
    id: 'O3',
    name: 'O₃ Ozone',
    description: 'MultiGas ozone sensor',
    category: 'gas',
    icon: 'Zap',
    parameters: [
      { key: 'o3_ppm', label: 'Ozone', unit: 'ppm', min: 0, max: 1, warningThreshold: 0.07, dangerThreshold: 0.12 },
    ],
  },
];

export const getSensorById = (id: string): SensorDefinition | undefined => {
  return SENSORS.find(s => s.id === id);
};

export const getSensorsByCategory = (category: SensorDefinition['category']): SensorDefinition[] => {
  return SENSORS.filter(s => s.category === category);
};

export const CATEGORY_LABELS: Record<SensorDefinition['category'], string> = {
  environment: 'Environment',
  light: 'Light',
  gas: 'Gas',
  soil: 'Soil',
  temperature: 'Temperature',
};

export const CATEGORY_COLORS: Record<SensorDefinition['category'], string> = {
  environment: 'hsl(152 45% 28%)',
  light: 'hsl(42 85% 55%)',
  gas: 'hsl(200 70% 50%)',
  soil: 'hsl(25 60% 45%)',
  temperature: 'hsl(15 85% 60%)',
};
