'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller,useForm } from 'react-hook-form';

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

  const handleSubmitForm = (data: RegisterDoctorSchema) => {
    console.log('Cadastro Médico:', data);
    alert('Médico cadastrado com sucesso!');
    router.push('/attendant/dashboard');
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
                    onClick={() => router.push('/attendant/dashboard')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white"
                  >
                    Cadastrar Médico
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
