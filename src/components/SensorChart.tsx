import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import { useSensorHistory } from '@/hooks/useSensorData';
import { getSensorById } from '@/lib/sensors';
import { Skeleton } from '@/components/ui/skeleton';

interface SensorChartProps {
  sensorId: string;
  parameter: string;
  hours: number;
  color?: string;
}

export const SensorChart: React.FC<SensorChartProps> = ({
  sensorId,
  parameter,
  hours,
  color = 'hsl(152 45% 28%)',
}) => {
  const { data, loading } = useSensorHistory(sensorId, parameter, hours);
  const sensor = getSensorById(sensorId);
  const param = sensor?.parameters.find(p => p.key === parameter);

  const chartData = useMemo(() => {
    return data.map(d => ({
      timestamp: new Date(d.timestamp).getTime(),
      [parameter]: d.value,
    }));
  }, [data, parameter]);

  const formatXAxis = (timestamp: number) => {
    if (hours <= 24) {
      return format(new Date(timestamp), 'HH:mm');
    } else if (hours <= 168) {
      return format(new Date(timestamp), 'EEE HH:mm');
    }
    return format(new Date(timestamp), 'MMM dd');
  };

  if (loading) {
    return (
      <div className="chart-container h-[300px]">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="font-semibold text-foreground mb-4">
        {param?.label || parameter}
        <span className="text-muted-foreground font-normal ml-2">({param?.unit})</span>
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${parameter}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickMargin={8}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickMargin={8}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-card)',
              }}
              labelFormatter={(value) => format(new Date(value), 'PPpp')}
              formatter={(value: number) => [
                `${value.toFixed(3)} ${param?.unit || ''}`,
                param?.label || parameter,
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={parameter}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: color }}
              name={param?.label || parameter}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
