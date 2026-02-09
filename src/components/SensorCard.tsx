import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { SensorIcon } from './icons/SensorIcon';
import { StatusBadge } from './StatusBadge';
import { getSensorById, CATEGORY_LABELS } from '@/lib/sensors';
import { SensorStatus } from '@/lib/mockData';
import { ChevronRight } from 'lucide-react';

interface SensorCardProps {
  sensor: SensorStatus;
}

export const SensorCard: React.FC<SensorCardProps> = ({ sensor }) => {
  const definition = getSensorById(sensor.id);
  
  if (!definition) return null;

  const primaryParam = definition.parameters[0];
  const primaryValue = sensor.readings[primaryParam?.key];
  
  // Check if sensor is offline based on hardware status
  // @ts-ignore - status field comes from backend
  const hardwareStatus = sensor.status || 'online';
  const isOffline = hardwareStatus === 'offline';
  const isWarmingUp = hardwareStatus === 'warming_up';

  return (
    <Link 
      to={`/sensors/${sensor.id}`}
      className={cn(
        'sensor-card group block',
        (isOffline || !sensor.online) && 'offline'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2.5 rounded-lg',
            sensor.online && !isOffline
              ? 'bg-primary/10 text-primary' 
              : 'bg-muted text-muted-foreground'
          )}>
            <SensorIcon icon={definition.icon} className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {definition.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {CATEGORY_LABELS[definition.category]}
            </p>
          </div>
        </div>
        <StatusBadge online={sensor.online && !isOffline} showLabel={false} />
      </div>

      {/* Show offline message when hardware reports sensor as offline */}
      {isOffline ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <svg className="h-5 w-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-destructive">Sensor Offline</p>
              <p className="text-xs text-muted-foreground">Hardware disconnected or not responding</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Click to view previous data
          </p>
        </div>
      ) : isWarmingUp ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg border border-warning/20">
            <svg className="h-5 w-5 text-warning animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-warning">Warming Up</p>
              <p className="text-xs text-muted-foreground">Sensor is stabilizing...</p>
            </div>
          </div>
        </div>
      ) : primaryValue ? (
        <div className="space-y-2">
          {definition.parameters.slice(0, 3).map(param => {
            const reading = sensor.readings[param.key];
            if (!reading) return null;
            return (
              <div key={param.key} className="flex justify-between items-baseline">
                <span className="text-sm text-muted-foreground">{param.label}</span>
                <span className="font-semibold text-foreground">
                  {reading.value.toFixed(param.key === 'error_code' ? 0 : 2)}
                  <span className="text-xs text-muted-foreground ml-1">{reading.unit}</span>
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          <p>Last seen</p>
          <p className="font-medium">
            {formatDistanceToNow(new Date(sensor.lastSeen), { addSuffix: true })}
          </p>
        </div>
      )}

      <div className="flex items-center justify-end mt-4 text-xs text-muted-foreground group-hover:text-primary transition-colors">
        View details
        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
