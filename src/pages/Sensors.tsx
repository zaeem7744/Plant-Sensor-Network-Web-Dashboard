import { useState } from 'react';
import { useSensorData } from '@/hooks/useSensorData';
import { SensorCard } from '@/components/SensorCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SENSORS, CATEGORY_LABELS } from '@/lib/sensors';
import { cn } from '@/lib/utils';

type FilterCategory = 'all' | 'environment' | 'light' | 'gas' | 'soil';

export default function Sensors() {
  const { sensors, loading } = useSensorData();
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const categories: { key: FilterCategory; label: string }[] = [
    { key: 'all', label: 'All Sensors' },
    { key: 'environment', label: 'Environment' },
    { key: 'light', label: 'Light' },
    { key: 'gas', label: 'Gas' },
    { key: 'soil', label: 'Soil' },
  ];

  const filteredSensors = sensors.filter(sensor => {
    const sensorDef = SENSORS.find(s => s.id === sensor.id);
    if (!sensorDef) return false;
    
    if (filter !== 'all' && sensorDef.category !== filter) return false;
    if (showOnlineOnly && !sensor.online) return false;
    
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-semibold text-foreground">
          Sensors
        </h1>
        <p className="text-muted-foreground mt-1">
          Browse and manage your sensor network
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <Button
              key={cat.key}
              variant={filter === cat.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(cat.key)}
              className={cn(
                'transition-all',
                filter === cat.key && 'shadow-md'
              )}
            >
              {cat.label}
            </Button>
          ))}
        </div>
        <div className="h-6 w-px bg-border hidden sm:block" />
        <Button
          variant={showOnlineOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowOnlineOnly(!showOnlineOnly)}
          className={cn(
            'transition-all',
            showOnlineOnly && 'bg-leaf-medium hover:bg-leaf-medium/90'
          )}
        >
          Online Only
        </Button>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredSensors.length} of {sensors.length} sensors
      </p>

      {/* Sensors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <>
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </>
        ) : filteredSensors.length > 0 ? (
          filteredSensors.map(sensor => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No sensors match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
