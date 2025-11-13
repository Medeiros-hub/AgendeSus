import { motion } from 'framer-motion';
import { Clock, Phone } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Appointment {
  id: string;
  paciente: string;
  cpf: string;
  telefone: string;
  servico: string;
  medico: string;
  horario: string;
  status: 'confirmado' | 'pendente' | 'concluida' | 'cancelada';
}

const appointments: Appointment[] = [
  {
    id: '1',
    paciente: 'João Neto',
    cpf: '000.000.000-00',
    telefone: '(88)99999-9999',
    servico: 'Medico Pediatra',
    medico: 'Dr. Vitor Paulino',
    horario: '09:00',
    status: 'confirmado',
  },
  {
    id: '2',
    paciente: 'Emerson Santos',
    cpf: '000.000.000-00',
    telefone: '(88)99999-9999',
    servico: 'Clinico Geral',
    medico: 'Dra. Vera',
    horario: '10:00',
    status: 'pendente',
  },
  {
    id: '3',
    paciente: 'João Victor',
    cpf: '000.000.000-00',
    telefone: '(88)99999-9999',
    servico: 'Dentista',
    medico: 'Dr. Luiz',
    horario: '11:30',
    status: 'concluida',
  },
  {
    id: '4',
    paciente: 'José Ravi',
    cpf: '000.000.000-00',
    telefone: '(88)99999-9999',
    servico: 'Medico Pediatra',
    medico: 'Dr. Vitor Paulino',
    horario: '09:00',
    status: 'cancelada',
  },
];

const statusConfig = {
  confirmado: {
    label: 'Confirmado',
    className: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  },
  pendente: {
    label: 'Pendente',
    className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
  },
  concluida: {
    label: 'Concluída',
    className: 'bg-green-100 text-green-700 hover:bg-green-100',
  },
  cancelada: {
    label: 'Cancelada',
    className: 'bg-red-100 text-red-700 hover:bg-red-100',
  },
};

export default function AppointmentTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-lg border border-slate-200 overflow-hidden"
    >
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">
          Agendamentos do Dia
        </h2>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-700">
                Paciente
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                CPF
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Telefone
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Serviço
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Médico
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Horário
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Status
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Ação
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id} className="hover:bg-slate-50">
                <TableCell className="font-medium text-slate-900">
                  {appointment.paciente}
                </TableCell>
                <TableCell className="text-slate-600">
                  {appointment.cpf}
                </TableCell>
                <TableCell className="text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {appointment.telefone}
                  </div>
                </TableCell>
                <TableCell className="text-slate-600">
                  {appointment.servico}
                </TableCell>
                <TableCell className="text-slate-600">
                  {appointment.medico}
                </TableCell>
                <TableCell className="text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {appointment.horario}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={statusConfig[appointment.status].className}>
                    {statusConfig[appointment.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {appointment.status === 'confirmado' && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Concluir
                      </Button>
                    )}
                    {appointment.status === 'pendente' && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Confirmar
                      </Button>
                    )}
                    {(appointment.status === 'confirmado' ||
                      appointment.status === 'pendente') && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="text-white"
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
