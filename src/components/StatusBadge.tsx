import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  online: boolean;
  className?: string;
  showLabel?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  online, 
  className,
  showLabel = true 
}) => {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span
        className={cn(
          'h-2.5 w-2.5 rounded-full',
          online ? 'bg-leaf-medium animate-pulse-glow' : 'bg-muted-foreground/40'
        )}
      />
      {showLabel && (
        <span className={cn(
          'text-xs font-medium',
          online ? 'text-leaf-medium' : 'text-muted-foreground'
        )}>
          {online ? 'Online' : 'Offline'}
        </span>
      )}
    </div>
  );
};
