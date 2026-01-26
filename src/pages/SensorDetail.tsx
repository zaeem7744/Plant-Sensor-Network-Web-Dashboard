import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getSensorById, CATEGORY_LABELS } from '@/lib/sensors';
import { useSensorData, useSensorHistory } from '@/hooks/useSensorData';
import { SensorIcon } from '@/components/icons/SensorIcon';
import { StatusBadge } from '@/components/StatusBadge';
import { SensorChart } from '@/components/SensorChart';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const TIME_RANGES = [
  { label: '24h', hours: 24 },
  { label: '7d', hours: 168 },
  { label: '30d', hours: 720 },
  { label: 'All', hours: 8760 },
];

const CHART_COLORS = [
  'hsl(152 45% 28%)',
  'hsl(42 85% 55%)',
  'hsl(200 70% 50%)',
  'hsl(340 65% 55%)',
];

export default function SensorDetail() {
  const { sensorId } = useParams<{ sensorId: string }>();
  const { sensors, loading, refetch } = useSensorData();
  const [timeRange, setTimeRange] = useState(24);

  const sensorDef = sensorId ? getSensorById(sensorId) : undefined;
  const sensorStatus = sensors.find(s => s.id === sensorId);

  if (!sensorDef) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">Sensor not found</p>
        <Button asChild variant="outline">
          <Link to="/sensors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sensors
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Link */}
      <Link 
        to="/sensors" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Sensors
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={cn(
            'p-4 rounded-xl',
            sensorStatus?.online 
              ? 'bg-primary/10 text-primary' 
              : 'bg-muted text-muted-foreground'
          )}>
            <SensorIcon icon={sensorDef.icon} className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-semibold text-foreground">
              {sensorDef.name}
            </h1>
            <p className="text-muted-foreground">
              {sensorDef.description}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-muted-foreground">
                {CATEGORY_LABELS[sensorDef.category]}
              </span>
              <span className="text-muted-foreground">•</span>
              <StatusBadge online={sensorStatus?.online ?? false} />
              {sensorStatus && !sensorStatus.online && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    Last seen {formatDistanceToNow(new Date(sensorStatus.lastSeen), { addSuffix: true })}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={refetch}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Current Values */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : sensorStatus?.online ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {sensorDef.parameters.map((param, index) => {
            const reading = sensorStatus.readings[param.key];
            return (
              <div 
                key={param.key}
                className="stat-card"
              >
                <p className="text-sm text-muted-foreground">{param.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {reading ? reading.value.toFixed(param.key === 'error_code' ? 0 : 2) : '—'}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    {param.unit}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="stat-card text-center py-8">
          <p className="text-muted-foreground">
            Sensor is offline. Last readings are not available.
          </p>
        </div>
      )}

      {/* Time Range Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Time range:</span>
        <div className="flex gap-2">
          {TIME_RANGES.map(range => (
            <Button
              key={range.hours}
              variant={timeRange === range.hours ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range.hours)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {sensorDef.parameters
          .filter(p => p.key !== 'error_code')
          .map((param, index) => (
            <SensorChart
              key={param.key}
              sensorId={sensorDef.id}
              parameter={param.key}
              hours={timeRange}
              color={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
      </div>

      {/* Stats Summary */}
      <div className="stat-card">
        <h3 className="font-semibold text-foreground mb-4">Statistics Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          {sensorDef.parameters
            .filter(p => p.key !== 'error_code')
            .map(param => (
              <div key={param.key} className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">{param.label}</p>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Min:</span>{' '}
                    <span className="font-medium">{(param.min ?? 0).toFixed(1)}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Max:</span>{' '}
                    <span className="font-medium">{(param.max ?? 100).toFixed(1)}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Avg:</span>{' '}
                    <span className="font-medium">
                      {(((param.min ?? 0) + (param.max ?? 100)) / 2).toFixed(1)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
