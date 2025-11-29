import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SchedulingStatus } from '@/services/internal-api/types/receptionist';

interface FiltersProps {
  search: string;
  status: SchedulingStatus | 'ALL';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: SchedulingStatus | 'ALL') => void;
}

const statusOptions = [
  { value: 'ALL', label: 'Todos os Status' },
  { value: 'SCHEDULED', label: 'Agendado' },
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'ATTENDED', label: 'Concluído' },
  { value: 'CANCELLED', label: 'Cancelado' },
  { value: 'MISSED', label: 'Faltou' },
];

export function Filters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: FiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="search" className="text-slate-700">
          Buscar Paciente
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="search"
            type="text"
            placeholder="Nome ou CPF do paciente..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status" className="text-slate-700">
          Status da Consulta
        </Label>
        <Select
          value={status}
          onValueChange={(value) =>
            onStatusChange(value as SchedulingStatus | 'ALL')
          }
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Selecione um status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
