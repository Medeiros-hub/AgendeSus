'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
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
import { useRequestApi } from '@/hooks/use-request-api';
import { healthProfessionals } from '@/services/internal-api';
import { services } from '@/services/internal-api/services';
import { ubs } from '@/services/internal-api/ubs';
import {
  RegisterDoctorSchema,
  registerDoctorSchema,
} from '@/validations/register-doctor-schema';

export default function RegisterDoctorPage() {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterDoctorSchema>({
    resolver: zodResolver(registerDoctorSchema),
  });

  const { handler: createProfessional, isLoading: isCreating } = useRequestApi(
    healthProfessionals.createHealthProfessional,
    {
      onSuccess() {
        toast.success('Médico cadastrado com sucesso!');
        router.push('/receptionist');
      },
      onError(error) {
        toast.error(error.message || 'Erro ao cadastrar médico');
      },
    },
  );

  const { data: servicesData, handler: servicesHandler } = useRequestApi(
    services.getServices,
  );

  const { data: ubsData, handler: ubsHandler } = useRequestApi(ubs.getUBSList);

  useEffect(() => {
    servicesHandler({ limit: 1000, page: 1 });
    ubsHandler({ limit: 1000, page: 1 });
  }, []);

  const handleSubmitForm = (data: RegisterDoctorSchema) => {
    createProfessional({
      name: data.fullName,
      specialty: data.specialty,
      crm: data.crm,
      ubsId: data.ubsId,
      serviceId: data.serviceId,
    });
  };

  const selectedSpecialty = watch('specialty');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header variant="atendente" />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Cadastro de Médico
              </h1>
              <p className="text-slate-600">
                Adicione um novo médico ao sistema
              </p>
            </div>

            <Card className="p-8 border border-slate-200 bg-white shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <Stethoscope className="w-6 h-6 text-slate-600" />
                <h2 className="text-xl font-semibold text-slate-900">
                  Informações do Médico
                </h2>
              </div>

              <form
                onSubmit={handleSubmit(handleSubmitForm)}
                className="space-y-6"
              >
                <div>
                  <Label htmlFor="fullName">Nome Completo *</Label>
                  <Input
                    id="fullName"
                    placeholder="Nome completo do médico"
                    {...register('fullName', {
                      required: 'O nome completo é obrigatório',
                    })}
                    className="mt-1"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-600">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="crm">CRM *</Label>
                    <Input
                      id="crm"
                      placeholder="Número do CRM"
                      {...register('crm', { required: 'O CRM é obrigatório' })}
                      className="mt-1"
                    />
                    {errors.crm && (
                      <p className="text-sm text-red-600">
                        {errors.crm.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="specialty">Especialidade *</Label>
                    <Controller
                      control={control}
                      name="specialty"
                      rules={{ required: 'Selecione uma especialidade' }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecione a especialidade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pediatra">Pediatra</SelectItem>
                            <SelectItem value="clinico-geral">
                              Clínico Geral
                            </SelectItem>
                            <SelectItem value="dentista">Dentista</SelectItem>
                            <SelectItem value="ocupanista">
                              Ocupanista
                            </SelectItem>
                            <SelectItem value="cardiologista">
                              Cardiologista
                            </SelectItem>
                            <SelectItem value="dermatologista">
                              Dermatologista
                            </SelectItem>
                            <SelectItem value="ginecologista">
                              Ginecologista
                            </SelectItem>
                            <SelectItem value="ortopedista">
                              Ortopedista
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.specialty && (
                      <p className="text-sm text-red-600">
                        {errors.specialty.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ubsId">UBS *</Label>
                    <Controller
                      control={control}
                      name="ubsId"
                      rules={{ required: 'Selecione uma UBS' }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecione a UBS" />
                          </SelectTrigger>
                          <SelectContent>
                            {ubsData?.ubsList.map((u) => (
                              <SelectItem key={u.id} value={u.id}>
                                {u.props.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.ubsId && (
                      <p className="text-sm text-red-600">
                        {errors.ubsId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="serviceId">Serviço</Label>
                    <Controller
                      control={control}
                      name="serviceId"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecione o serviço" />
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
                    {errors.serviceId && (
                      <p className="text-sm text-red-600">
                        {errors.serviceId.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      placeholder="(88)99999-9999"
                      {...register('phone', {
                        required: 'O telefone é obrigatório',
                      })}
                      className="mt-1"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="medico@email.com"
                      {...register('email', {
                        required: 'O e-mail é obrigatório',
                      })}
                      className="mt-1"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Horário de Atendimento *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="startTime"
                        className="text-sm text-slate-600"
                      >
                        Início
                      </Label>
                      <Input
                        id="startTime"
                        type="time"
                        {...register('startTime', {
                          required: 'Horário de início obrigatório',
                        })}
                        className="mt-1"
                      />
                      {errors.startTime && (
                        <p className="text-sm text-red-600">
                          {errors.startTime.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="endTime"
                        className="text-sm text-slate-600"
                      >
                        Fim
                      </Label>
                      <Input
                        id="endTime"
                        type="time"
                        {...register('endTime', {
                          required: 'Horário de fim obrigatório',
                        })}
                        className="mt-1"
                      />
                      {errors.endTime && (
                        <p className="text-sm text-red-600">
                          {errors.endTime.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push('/receptionist')}
                    disabled={isCreating}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white"
                    disabled={isCreating}
                  >
                    {isCreating ? 'Cadastrando...' : 'Cadastrar Médico'}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
