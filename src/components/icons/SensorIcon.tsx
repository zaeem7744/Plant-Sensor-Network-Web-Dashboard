import { 
  Thermometer, 
  Sun, 
  Wine, 
  Flame, 
  Sprout, 
  AlertTriangle, 
  Cloud, 
  Wind, 
  Droplets, 
  CircleDot, 
  Zap,
  LucideIcon 
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Thermometer,
  Sun,
  Wine,
  Flame,
  Sprout,
  AlertTriangle,
  Cloud,
  Wind,
  Droplets,
  CircleDot,
  Zap,
};

interface SensorIconProps {
  icon: string;
  className?: string;
}

export const SensorIcon: React.FC<SensorIconProps> = ({ icon, className = '' }) => {
  const IconComponent = iconMap[icon] || Thermometer;
  return <IconComponent className={className} />;
};
