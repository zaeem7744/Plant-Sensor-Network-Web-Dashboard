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

  return (
    <Link 
      to={`/sensors/${sensor.id}`}
      className={cn(
        'sensor-card group block',
        !sensor.online && 'offline'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2.5 rounded-lg',
            sensor.online 
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
        <StatusBadge online={sensor.online} showLabel={false} />
      </div>

      {sensor.online && primaryValue ? (
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
