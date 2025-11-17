//TODO: REFACTOR COMPONENT
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Calendar, FileText, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRequestApi } from '@/hooks/use-request-api';
import { availableTimes,healthProfessionals } from '@/services/internal-api';
import { schedulings } from '@/services/internal-api/schedulings';
import { services } from '@/services/internal-api/services';
import { AppointmentCreate } from '@/types/appointment';
import {
  appointmentSchedulingSchema,
  TAppointmentSchedulingSchema,
} from '@/validations/appointment-scheduling-schema';

export default function AppointmentForm() {
  const { user, isAuthenticated } = useAuthContext();
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedProfessional, setSelectedProfessional] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    control,
    watch,
    formState: { errors },
  } = useForm<TAppointmentSchedulingSchema>({
    resolver: zodResolver(appointmentSchedulingSchema),
  });

  const watchedDate = watch('date');

  const { handler: createScheduling, isLoading: isLoadingScheduling } =
    useRequestApi(schedulings.createScheduling, {
      onSuccess(data) {
        toast.success('Consulta agendada com sucesso!');
      },
      onError(error) {
        toast.error(error.message);
      },
    });

  const { data: servicesData, handler: servicesHandler } = useRequestApi(
    services.getServices,
  );

  const {
    data: healthProfessionalsData,
    handler: healthProfessionalsHandler,
    isLoading: isLoadingProfessionals,
  } = useRequestApi(healthProfessionals.getHealthProfessionalsByService);

  const {
    data: availableTimesData,
    handler: availableTimesHandler,
    isLoading: isLoadingTimes,
  } = useRequestApi(availableTimes.getAvailableTimes);

  const onSubmit = async (data: TAppointmentSchedulingSchema) => {
    const selectedAvailableTime = availableTimesData?.times.find((time) => {
      return (
        time.date === data.date &&
        time.startTime === data.time &&
        time.healthProfessionalId === data.professional &&
        time.available
      );
    });

    if (!selectedAvailableTime) {
      toast.error('Horário selecionado não está disponível');
      return;
    }

    await createScheduling({
      availableTimeId: selectedAvailableTime.id,
    });
  };

  useEffect(() => {
    servicesHandler({
      limit: 1000,
      page: 1,
    });
  }, []);

  useEffect(() => {
    if (selectedService) {
      healthProfessionalsHandler(selectedService);
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedProfessional && watchedDate) {
      resetField('time');
      setSelectedDate(watchedDate);

      availableTimesHandler({
        healthProfessionalId: selectedProfessional,
        dateFrom: watchedDate,
        dateTo: watchedDate,
        page: 1,
        limit: 1000,
      });
    } else {
      setSelectedDate('');
      resetField('time');
    }
  }, [selectedProfessional, watchedDate]);

  useEffect(() => {
    if (!user) return;

    setValue('fullName', user.fullName);
    setValue('phone', user.phone);
    setValue('cpf', user.cpf);
  }, [user, setValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="p-8 border border-slate-200 bg-white shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-6 h-6 text-slate-600" />
          <h2 className="text-2xl font-bold text-slate-900">
            Agendamento de Consulta
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados Pessoais */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-900">
                Dados pessoais
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-slate-700">
                  Nome Completo
                </Label>
                <Input
                  id="fullName"
                  placeholder="Nome Completo"
                  className="mt-1"
                  disabled={isAuthenticated}
                  {...register('fullName', { required: true })}
                />
                {errors.fullName && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-slate-700">
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="(88)99999-9999"
                    className="mt-1"
                    disabled={isAuthenticated}
                    {...register('phone', { required: true })}
                  />
                  {errors.phone && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="cpf" className="text-slate-700">
                    CPF
                  </Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    className="mt-1"
                    disabled={isAuthenticated}
                    {...register('cpf', { required: true })}
                  />
                  {errors.cpf && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.cpf.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dados da Consulta */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-900">
                Dados da Consulta
              </h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="service" className="text-slate-700">
                    Serviço
                  </Label>
                  <Controller
                    name="service"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        onValueChange={(v) => {
                          field.onChange(v);
                          setSelectedService(v);
                          resetField('professional');
                          resetField('date');
                          resetField('time');
                          setSelectedDate('');
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione um serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          {servicesData?.services.map((service) => (
                            <SelectItem
                              key={service.props.id}
                              value={service.props.id}
                            >
                              {service.props.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.service && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.service.message}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="professional" className="text-slate-700">
                    Médico
                  </Label>
                  <Controller
                    name="professional"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        disabled={
                          !selectedService ||
                          isLoadingProfessionals ||
                          (healthProfessionalsData?.professionals?.length ??
                            0) === 0
                        }
                        onValueChange={(v) => {
                          field.onChange(v);
                          setSelectedProfessional(v);
                          resetField('date');
                          resetField('time');
                          setSelectedDate('');
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue
                            placeholder={
                              !selectedService
                                ? 'Selecione um serviço primeiro'
                                : isLoadingProfessionals
                                  ? 'Carregando...'
                                  : (healthProfessionalsData?.professionals
                                        ?.length ?? 0) === 0
                                    ? 'Nenhum profissional encontrado'
                                    : 'Selecione um profissional'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {healthProfessionalsData?.professionals?.map(
                            (doctor) => (
                              <SelectItem key={doctor.id} value={doctor.id}>
                                {doctor.props.name} - {doctor.props.specialty}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.professional && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.professional.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-slate-700">
                    Data
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    className="mt-1"
                    disabled={!selectedProfessional}
                    min={(() => {
                      const today = new Date();
                      const year = today.getFullYear();
                      const month = String(today.getMonth() + 1).padStart(
                        2,
                        '0',
                      );
                      const day = String(today.getDate()).padStart(2, '0');
                      return `${year}-${month}-${day}`;
                    })()}
                    {...register('date', { required: true })}
                  />
                  {errors.date && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.date.message}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="time" className="text-slate-700">
                    Horário
                  </Label>
                  <Controller
                    name="time"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        value={field.value || ''}
                        disabled={
                          !selectedDate ||
                          isLoadingTimes ||
                          (availableTimesData?.times?.filter((t) => t.available)
                            .length ?? 0) === 0
                        }
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue
                            placeholder={
                              !selectedDate
                                ? 'Selecione uma data primeiro'
                                : isLoadingTimes
                                  ? 'Carregando...'
                                  : (availableTimesData?.times?.filter(
                                        (t) => t.available,
                                      ).length ?? 0) === 0
                                    ? 'Nenhum horário disponível'
                                    : 'Selecione um horário'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimesData?.times
                            ?.filter((time) => time.available)
                            .map((time) => (
                              <SelectItem key={time.id} value={time.startTime}>
                                {time.startTime} - {time.endTime}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.time && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.time.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-slate-600 hover:bg-slate-700 text-white py-6 text-lg"
            disabled={isLoadingScheduling || Object.keys(errors).length > 0}
          >
            {isLoadingScheduling ? 'Agendando...' : 'Agendar Consulta'}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}
