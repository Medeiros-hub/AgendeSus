'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
import { EUserType } from '@/services/internal-api/types/auth';
import { users } from '@/services/internal-api/users';
import { CreateUserSchema, createUserSchema } from '@/validations/user-schema';

export default function CreateUserPage() {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
  });

  const { handler: createUser, isLoading } = useRequestApi(users.createUser, {
    onSuccess() {
      toast.success('Usuário cadastrado com sucesso!');
      router.push('/admin/users');
    },
    onError(error) {
      toast.error(error.message || 'Erro ao cadastrar usuário');
    },
  });

  const handleSubmitForm = (data: CreateUserSchema) => {
    createUser({
      cpf: data.cpf,
      fullName: data.fullName,
      birthDate: data.birthDate,
      phone: data.phone,
      email: data.email,
      password: data.password,
      type: data.type,
      zipcode: data.zipcode,
      address: data.address,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header variant="atendente" />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Cadastrar Novo Usuário
              </h1>
              <p className="text-slate-600">
                Preencha os dados para criar um novo usuário no sistema
              </p>
            </div>

            <Card className="p-8 border border-slate-200 bg-white shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <UserPlus className="w-6 h-6 text-slate-600" />
                <h2 className="text-xl font-semibold text-slate-900">
                  Informações do Usuário
                </h2>
              </div>

              <form
                onSubmit={handleSubmit(handleSubmitForm)}
                className="space-y-6"
              >
                {/* Nome Completo */}
                <div>
                  <Label htmlFor="fullName">Nome Completo *</Label>
                  <Input
                    id="fullName"
                    placeholder="Nome completo do usuário"
                    {...register('fullName')}
                    className="mt-1"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CPF */}
                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      {...register('cpf')}
                      className="mt-1"
                    />
                    {errors.cpf && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.cpf.message}
                      </p>
                    )}
                  </div>

                  {/* Data de Nascimento */}
                  <div>
                    <Label htmlFor="birthDate">Data de Nascimento *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      {...register('birthDate')}
                      className="mt-1"
                    />
                    {errors.birthDate && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.birthDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Telefone */}
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      placeholder="(88) 99999-9999"
                      {...register('phone')}
                      className="mt-1"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="usuario@email.com"
                      {...register('email')}
                      className="mt-1"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tipo de Usuário */}
                <div>
                  <Label htmlFor="type">Tipo de Usuário *</Label>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione o tipo de usuário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={EUserType.CITIZEN}>
                            Cidadão
                          </SelectItem>
                          <SelectItem value={EUserType.RECEPTIONIST}>
                            Recepcionista
                          </SelectItem>
                          <SelectItem value={EUserType.ADMIN}>
                            Administrador
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.type && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.type.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* CEP */}
                  <div>
                    <Label htmlFor="zipcode">CEP *</Label>
                    <Input
                      id="zipcode"
                      placeholder="00000-000"
                      {...register('zipcode')}
                      className="mt-1"
                    />
                    {errors.zipcode && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.zipcode.message}
                      </p>
                    )}
                  </div>

                  {/* Endereço */}
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Endereço *</Label>
                    <Input
                      id="address"
                      placeholder="Rua, número, bairro"
                      {...register('address')}
                      className="mt-1"
                    />
                    {errors.address && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Senha */}
                  <div>
                    <Label htmlFor="password">Senha *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      {...register('password')}
                      className="mt-1"
                    />
                    {errors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirmar Senha */}
                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repita a senha"
                      {...register('confirmPassword')}
                      className="mt-1"
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push('/admin/users')}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Cadastrando...' : 'Cadastrar Usuário'}
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
