import { Badge } from '@/components/ui/badge';
import { SchedulingStatus } from '@/services/internal-api/types/receptionist';

interface StatusBadgeProps {
  status: SchedulingStatus;
}

const statusConfig = {
  SCHEDULED: {
    label: 'Agendado',
    variant: 'secondary' as const,
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  CONFIRMED: {
    label: 'Confirmado',
    variant: 'default' as const,
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  ATTENDED: {
    label: 'Concluído',
    variant: 'default' as const,
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  CANCELLED: {
    label: 'Cancelado',
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
  MISSED: {
    label: 'Faltou',
    variant: 'outline' as const,
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
