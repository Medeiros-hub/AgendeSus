import { CheckCircle2, ClipboardCheck, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TReceptionistScheduling } from '@/services/internal-api/types/receptionist';

import { ConfirmSchedulingModal } from './ConfirmSchedulingModal';
import { StatusBadge } from './StatusBadge';

interface AppointmentsTableProps {
  schedulings: TReceptionistScheduling[];
  isLoading: boolean;
  onConfirm: (id: string, confirmCode: string) => Promise<void>;
  onComplete: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
}

export function AppointmentsTable({
  schedulings,
  isLoading,
  onConfirm,
  onComplete,
  onCancel,
}: AppointmentsTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean;
    schedulingId: string | null;
  }>({ open: false, schedulingId: null });
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    scheduling: TReceptionistScheduling | null;
  }>({ open: false, scheduling: null });

  const handleAction = async (
    id: string,
    action: (id: string) => Promise<void>,
  ) => {
    setActionLoading(id);
    try {
      await action(id);
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmClick = (scheduling: TReceptionistScheduling) => {
    setConfirmModal({ open: true, scheduling });
  };

  const handleConfirmWithCode = async (confirmCode: string) => {
    if (confirmModal.scheduling) {
      setActionLoading(confirmModal.scheduling.id);
      try {
        await onConfirm(confirmModal.scheduling.id, confirmCode);
        setConfirmModal({ open: false, scheduling: null });
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleCancelClick = (id: string) => {
    setCancelDialog({ open: true, schedulingId: id });
  };

  const handleCancelConfirm = async () => {
    if (cancelDialog.schedulingId) {
      await handleAction(cancelDialog.schedulingId, onCancel);
    }
    setCancelDialog({ open: false, schedulingId: null });
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatDateTime = (date: string, time: string) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year} às ${time}`;
  };

  if (isLoading) {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Médico</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(8)].map((_, j) => (
                  <TableCell key={j}>
                    <div className="h-4 bg-slate-200 animate-pulse rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (schedulings.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <p className="text-slate-500 text-lg">
          Nenhuma consulta encontrada com os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Paciente</TableHead>
                <TableHead className="font-semibold">CPF</TableHead>
                <TableHead className="font-semibold">Telefone</TableHead>
                <TableHead className="font-semibold">Serviço</TableHead>
                <TableHead className="font-semibold">Médico</TableHead>
                <TableHead className="font-semibold">Horário</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedulings.map((scheduling) => {
                const isProcessing = actionLoading === scheduling.id;
                const canConfirm = scheduling.status === 'SCHEDULED';
                const canComplete = scheduling.status === 'CONFIRMED';
                const canCancel = ['SCHEDULED', 'CONFIRMED'].includes(
                  scheduling.status,
                );

                return (
                  <TableRow key={scheduling.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      {scheduling.patient.fullName}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {formatCPF(scheduling.patient.cpf)}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {formatPhone(scheduling.patient.phone)}
                    </TableCell>
                    <TableCell>{scheduling.service.name}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {scheduling.healthProfessional.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {scheduling.healthProfessional.specialty}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {formatDateTime(scheduling.date, scheduling.startTime)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={scheduling.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {canConfirm && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConfirmClick(scheduling)}
                            disabled={isProcessing}
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200"
                          >
                            {isProcessing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Confirmar
                              </>
                            )}
                          </Button>
                        )}
                        {canComplete && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleAction(scheduling.id, onComplete)
                            }
                            disabled={isProcessing}
                            className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                          >
                            {isProcessing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <ClipboardCheck className="h-4 w-4 mr-1" />
                                Concluir
                              </>
                            )}
                          </Button>
                        )}
                        {canCancel && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelClick(scheduling.id)}
                            disabled={isProcessing}
                            className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
                          >
                            {isProcessing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancelar
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog
        open={cancelDialog.open}
        onOpenChange={(open) => setCancelDialog({ open, schedulingId: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Consulta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta consulta? Esta ação não pode
              ser desfeita e o paciente precisará reagendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não, manter consulta</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Sim, cancelar consulta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {confirmModal.scheduling && (
        <ConfirmSchedulingModal
          isOpen={confirmModal.open}
          onClose={() => setConfirmModal({ open: false, scheduling: null })}
          onConfirm={handleConfirmWithCode}
          schedulingInfo={{
            patientName: confirmModal.scheduling.patient.fullName,
            service: confirmModal.scheduling.service.name,
            professional: confirmModal.scheduling.healthProfessional.name,
            dateTime: formatDateTime(
              confirmModal.scheduling.date,
              confirmModal.scheduling.startTime,
            ),
          }}
        />
      )}
    </>
  );
}
