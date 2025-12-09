'use client';

import { motion } from 'framer-motion';
import { UserPlus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AppointmentsTable } from '@/components/receptionist/AppointmentsTable';
import { Filters } from '@/components/receptionist/Filters';
import { MetricsCards } from '@/components/receptionist/MetricsCards';
import { Pagination } from '@/components/receptionist/Pagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRequestApi } from '@/hooks/use-request-api';
import { receptionist } from '@/services/internal-api/receptionist';
import { EUserType } from '@/services/internal-api/types/auth';
import { SchedulingStatus } from '@/services/internal-api/types/receptionist';
import { getErrorMessage } from '@/utils/error-handler';

export default function ReceptionistDashboard() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<SchedulingStatus | 'ALL'>('ALL');
  const limit = 10;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const {
    data,
    handler: fetchSchedulings,
    isLoading,
  } = useRequestApi(receptionist.getAllSchedulings);

  const { handler: completeHandler } = useRequestApi(
    receptionist.completeScheduling,
    {
      onSuccess: () => {
        toast.success('Consulta concluída com sucesso!');
        fetchSchedulings({
          page,
          limit,
          ...(debouncedSearch ? { search: debouncedSearch } : {}),
          ...(status !== 'ALL' ? { status } : {}),
        });
      },
      onError: (error) => {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
      },
    },
  );

  const { handler: cancelHandler } = useRequestApi(
    receptionist.cancelScheduling,
    {
      onSuccess: () => {
        toast.success('Consulta cancelada com sucesso!');
        fetchSchedulings({
          page,
          limit,
          ...(debouncedSearch ? { search: debouncedSearch } : {}),
          ...(status !== 'ALL' ? { status } : {}),
        });
      },
      onError: (error) => {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
      },
    },
  );

  // Load schedulings when filters change
  useEffect(() => {
    fetchSchedulings({
      page,
      limit,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(status !== 'ALL' ? { status } : {}),
    });
  }, [page, debouncedSearch, status]);

  const handleConfirm = async (id: string, confirmCode: string) => {
    try {
      await receptionist.confirmScheduling(id, confirmCode);
      toast.success('Consulta confirmada com sucesso!');
      fetchSchedulings({
        page,
        limit,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(status !== 'ALL' ? { status } : {}),
      });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      throw error; // Re-throw para o modal mostrar o erro
    }
  };

  const handleComplete = async (id: string) => {
    await completeHandler(id);
  };

  const handleCancel = async (id: string) => {
    await cancelHandler(id);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleStatusChange = (value: SchedulingStatus | 'ALL') => {
    setStatus(value);
    setPage(1);
  };

  const schedulings = data?.schedulings || [];
  const metrics = data?.metrics || {
    total: 0,
    scheduled: 0,
    confirmed: 0,
    attended: 0,
    cancelled: 0,
  };
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const isAdmin = user?.type === EUserType.ADMIN;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Área do Atendente
              </h1>
              <p className="text-slate-600">
                Gerencie e acompanhe todas as consultas agendadas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button
                onClick={() => router.push('/admin/users')}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Gerenciar Usuários
              </Button>
            )}
            <Button
              onClick={() => router.push('/attendant/register-doctor')}
              className="bg-slate-600 hover:bg-slate-700 text-white flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Cadastrar Profissional de Saúde
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <MetricsCards metrics={metrics} isLoading={isLoading} />

        {/* Filters and Table */}
        <Card className="p-6 border-slate-200 shadow-sm">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Filtrar Consultas
              </h2>
              <Filters
                search={search}
                status={status}
                onSearchChange={handleSearchChange}
                onStatusChange={handleStatusChange}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Lista de Consultas
                </h2>
                {!isLoading && total > 0 && (
                  <span className="text-sm text-slate-600">
                    {total} {total === 1 ? 'consulta' : 'consultas'}{' '}
                    {status !== 'ALL' && 'filtrada(s)'}
                  </span>
                )}
              </div>

              <AppointmentsTable
                schedulings={schedulings}
                isLoading={isLoading}
                onConfirm={handleConfirm}
                onComplete={handleComplete}
                onCancel={handleCancel}
              />
            </div>

            {!isLoading && total > 0 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={limit}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
