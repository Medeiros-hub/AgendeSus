import {
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  XCircle,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricsCardsProps {
  metrics: {
    total: number;
    scheduled: number;
    confirmed: number;
    attended: number;
    cancelled: number;
  };
  isLoading?: boolean;
}

const metricCards = [
  {
    key: 'total' as const,
    title: 'Total de Consultas',
    icon: ClipboardList,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
  },
  {
    key: 'scheduled' as const,
    title: 'Pendentes',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    key: 'confirmed' as const,
    title: 'Confirmadas',
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    key: 'attended' as const,
    title: 'Concluídas',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    key: 'cancelled' as const,
    title: 'Canceladas',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
];

export function MetricsCards({ metrics, isLoading }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {metricCards.map(({ key, title, icon: Icon, color, bgColor }) => (
        <Card key={key} className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${bgColor}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-200 animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-bold text-slate-900">
                {metrics[key]}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
