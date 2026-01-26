import { 
  Cpu, 
  Activity, 
  Database, 
  Thermometer, 
  Droplets,
  Wifi,
  WifiOff
} from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { SensorCard } from '@/components/SensorCard';
import { useSensorData, useOverviewStats } from '@/hooks/useSensorData';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { sensors, loading: sensorsLoading } = useSensorData();
  const { stats, loading: statsLoading } = useOverviewStats();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-semibold text-foreground">
          Overview Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Real-time monitoring of your plant sensor network
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </>
        ) : (
          <>
            <StatCard
              title="Total Sensors"
              value={stats?.totalSensors ?? 0}
              subtitle="Configured devices"
              icon={Cpu}
              variant="primary"
            />
            <StatCard
              title="Online"
              value={stats?.onlineSensors ?? 0}
              subtitle="Active and reporting"
              icon={Wifi}
              variant="success"
            />
            <StatCard
              title="Offline"
              value={stats?.offlineSensors ?? 0}
              subtitle="Not responding"
              icon={WifiOff}
            />
            <StatCard
              title="Measurements"
              value={stats?.totalMeasurements?.toLocaleString() ?? '—'}
              subtitle="Total recorded"
              icon={Database}
            />
          </>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statsLoading ? (
          <>
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </>
        ) : (
          <>
            <div className="stat-card flex items-center gap-4">
              <div className="p-3 rounded-xl bg-golden/10 text-golden">
                <Thermometer className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Temperature (24h)</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.avgTemperature !== null ? `${stats?.avgTemperature}°C` : '—'}
                </p>
              </div>
            </div>
            <div className="stat-card flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent text-accent-foreground">
                <Droplets className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Humidity (24h)</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.avgHumidity !== null ? `${stats?.avgHumidity}%` : '—'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sensors Grid */}
      <div>
        <h2 className="text-xl font-display font-semibold text-foreground mb-4">
          All Sensors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sensorsLoading ? (
            <>
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </>
          ) : (
            sensors.map(sensor => (
              <SensorCard key={sensor.id} sensor={sensor} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
