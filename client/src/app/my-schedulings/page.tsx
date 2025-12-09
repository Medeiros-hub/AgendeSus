'use client';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Stethoscope,
  User,
  X,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ConfirmCodeModal } from '@/components/ConfirmCodeModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRequestApi } from '@/hooks/use-request-api';
import { schedulings } from '@/services/internal-api/schedulings';
import { TUserScheduling } from '@/services/internal-api/types/schedulings';
import { getErrorMessage } from '@/utils/error-handler';

const statusConfig = {
  SCHEDULED: {
    label: 'Agendado',
    color: 'text-blue-600 bg-blue-50',
    icon: Calendar,
  },
  CONFIRMED: {
    label: 'Confirmado',
    color: 'text-green-600 bg-green-50',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Cancelado',
    color: 'text-red-600 bg-red-50',
    icon: XCircle,
  },
  ATTENDED: {
    label: 'Atendido',
    color: 'text-purple-600 bg-purple-50',
    icon: CheckCircle2,
  },
  MISSED: {
    label: 'Faltou',
    color: 'text-orange-600 bg-orange-50',
    icon: AlertCircle,
  },
};

export default function MySchedulingsPage() {
  const [selectedScheduling, setSelectedScheduling] =
    useState<TUserScheduling | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: schedulingsData,
    handler: schedulingsHandler,
    isLoading,
  } = useRequestApi(schedulings.getUserSchedulings);

  const { handler: cancelHandler, isLoading: isCancelling } = useRequestApi(
    schedulings.cancelScheduling,
  );

  useEffect(() => {
    schedulingsHandler({ page, limit });
  }, [page]);

  const handleShowConfirmCode = (scheduling: TUserScheduling) => {
    setSelectedScheduling(scheduling);
  };

  const handleCancelScheduling = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return;
    }

    try {
      await cancelHandler({ id });
      toast.success('Agendamento cancelado com sucesso!');
      schedulingsHandler({ page, limit });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const canCancel = (scheduling: TUserScheduling) => {
    return (
      scheduling.status === 'SCHEDULED' || scheduling.status === 'CONFIRMED'
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-linear-to-br from-slate-100 via-slate-50 to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Meus Agendamentos
            </h1>
            <p className="text-slate-600">
              Visualize e gerencie suas consultas agendadas
            </p>
          </motion.div>

          {/* Metrics Cards */}
          {schedulingsData?.metrics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
            >
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-slate-600">Total</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {schedulingsData.metrics.total}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-blue-600">Agendados</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {schedulingsData.metrics.scheduled}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-green-600">Confirmados</p>
                  <p className="text-2xl font-bold text-green-600">
                    {schedulingsData.metrics.confirmed}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-purple-600">Atendidos</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {schedulingsData.metrics.attended}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-red-600">Cancelados</p>
                  <p className="text-2xl font-bold text-red-600">
                    {schedulingsData.metrics.cancelled}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Schedulings List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600 mt-4">Carregando agendamentos...</p>
            </div>
          ) : schedulingsData?.schedulings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-slate-600 mb-6">
                Você ainda não possui consultas agendadas.
              </p>
              <Button onClick={() => (window.location.href = '/scheduling')}>
                Agendar Consulta
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {schedulingsData?.schedulings.map((scheduling, index) => {
                const StatusIcon = statusConfig[scheduling.status].icon;

                return (
                  <motion.div
                    key={scheduling.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {scheduling.service.name}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {scheduling.healthProfessional.name} •{' '}
                              {scheduling.healthProfessional.specialty}
                            </CardDescription>
                          </div>
                          <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[scheduling.status].color}`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig[scheduling.status].label}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(scheduling.date)}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="w-4 h-4" />
                            <span>
                              {scheduling.startTime} - {scheduling.endTime}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="w-4 h-4" />
                            <span>{scheduling.ubs.name}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Stethoscope className="w-4 h-4" />
                            <span>{scheduling.healthProfessional.name}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-slate-100">
                          <Button
                            onClick={() => handleShowConfirmCode(scheduling)}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Ver Código
                          </Button>

                          {canCancel(scheduling) && (
                            <Button
                              onClick={() =>
                                handleCancelScheduling(scheduling.id)
                              }
                              variant="outline"
                              size="sm"
                              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={isCancelling}
                            >
                              <X className="w-4 h-4" />
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {schedulingsData && schedulingsData.total > limit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 mt-8"
            >
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
                size="sm"
              >
                Anterior
              </Button>
              <span className="text-sm text-slate-600">
                Página {page} de {Math.ceil(schedulingsData.total / limit)}
              </span>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(schedulingsData.total / limit)}
                variant="outline"
                size="sm"
              >
                Próxima
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      {/* Confirm Code Modal */}
      {selectedScheduling && (
        <ConfirmCodeModal
          isOpen={!!selectedScheduling}
          onClose={() => setSelectedScheduling(null)}
          confirmCode={selectedScheduling.confirmCode}
          schedulingInfo={{
            serviceName: selectedScheduling.service.name,
            professionalName: selectedScheduling.healthProfessional.name,
            ubsName: selectedScheduling.ubs.name,
            date: formatDate(selectedScheduling.date),
            time: `${selectedScheduling.startTime} - ${selectedScheduling.endTime}`,
          }}
        />
      )}
    </div>
  );
}
