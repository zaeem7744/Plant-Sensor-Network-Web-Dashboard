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

interface ParamStatsCardProps {
  sensorId: string;
  paramKey: string;
  label: string;
  unit: string;
  hours: number;
}

const ParamStatsCard: React.FC<ParamStatsCardProps> = ({
  sensorId,
  paramKey,
  label,
  unit,
  hours,
}) => {
  const { data, loading } = useSensorHistory(sensorId, paramKey, hours);

  if (loading) {
    return (
      <div className="text-center p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        <p className="text-xs mb-1">{label}</p>
        <p>No data in selected range</p>
      </div>
    );
  }

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  return (
    <div className="text-center p-4 bg-muted/50 rounded-lg">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="space-y-1">
        <p className="text-sm">
          <span className="text-muted-foreground">Min:</span>{' '}
          <span className="font-medium">{min.toFixed(2)} {unit}</span>
        </p>
        <p className="text-sm">
          <span className="text-muted-foreground">Max:</span>{' '}
          <span className="font-medium">{max.toFixed(2)} {unit}</span>
        </p>
        <p className="text-sm">
          <span className="text-muted-foreground">Avg:</span>{' '}
          <span className="font-medium">{avg.toFixed(2)} {unit}</span>
        </p>
      </div>
    </div>
  );
};

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
            sensorStatus?.online && sensorStatus?.status !== 'offline'
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
              <StatusBadge online={sensorStatus?.online && sensorStatus?.status !== 'offline'} />
              {sensorStatus && (!sensorStatus.online || sensorStatus.status === 'offline') && (
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
      
      {/* Hardware Offline Alert */}
      {sensorStatus?.status === 'offline' && (
        <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
          <svg className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <p className="font-medium text-destructive">Sensor Hardware Offline</p>
            <p className="text-sm text-muted-foreground mt-1">
              The sensor hardware is disconnected or not responding. The ESP32 firmware has reported this sensor as offline. 
              Check the sensor wiring, I²C connections, or power supply. Historical data is shown below for reference.
            </p>
          </div>
        </div>
      )}
      
      {/* Warming Up Alert */}
      {sensorStatus?.status === 'warming_up' && (
        <div className="flex items-start gap-3 p-4 bg-warning/10 rounded-lg border border-warning/20">
          <svg className="h-6 w-6 text-warning flex-shrink-0 mt-0.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <div className="flex-1">
            <p className="font-medium text-warning">Sensor Warming Up</p>
            <p className="text-sm text-muted-foreground mt-1">
              The sensor is currently stabilizing after power-on. Readings will be available shortly.
            </p>
          </div>
        </div>
      )}

      {/* Current Values */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : sensorStatus?.status === 'offline' ? (
        <div className="stat-card text-center py-8">
          <p className="text-muted-foreground">
            Current readings unavailable - sensor hardware is offline.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            View historical data below to see previous measurements.
          </p>
        </div>
      ) : sensorStatus?.status === 'warming_up' ? (
        <div className="stat-card text-center py-8">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted-foreground">
              Sensor is warming up - readings will be available soon...
            </p>
          </div>
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
        <p className="text-xs text-muted-foreground mb-3">
          Calculated from history over the selected time range.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sensorDef.parameters
            .filter(p => p.key !== 'error_code')
            .map(param => (
              <ParamStatsCard
                key={param.key}
                sensorId={sensorDef.id}
                paramKey={param.key}
                label={param.label}
                unit={param.unit}
                hours={timeRange}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
