'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from '@/components/ui/stepper';
import { useRequestApi } from '@/hooks/use-request-api';
import { auth } from '@/services/internal-api/auth';
import { EUserType } from '@/services/internal-api/types/auth';
import { signUpSchema, TSignUpFormSchema } from '@/validations/sign-up-schema';

export default function CadastroPaciente() {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [1, 2];

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignUpFormSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const { handler: registerUserHandler, isLoading } = useRequestApi(
    auth.registerUser,
    {
      onSuccess(data) {
        toast.success('Usuário cadastrado com sucesso.');
        router.push('/auth/sign-in');
      },
      onError(error) {
        toast.error(error.message);
      },
    },
  );

  const handleSubmitForm = (data: TSignUpFormSchema) => {
    registerUserHandler({
      ...data,
      type: EUserType.CITIZEN,
    });
  };

  return (
    <>
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center justify-center mb-4">
          <Image
            src="/logo-icon.png"
            alt="AgendeSUS"
            className="h-16 w-16 object-contain"
            width={64}
            height={64}
          />
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Cadastro de Paciente
        </h1>
        <p className="text-slate-600">
          Preencha seus dados para criar sua conta
        </p>
      </div>

      <Card className="p-8 border border-slate-200 bg-white shadow-lg">
        <Stepper defaultValue={1} className="mb-8">
          {steps.map((step) => (
            <StepperItem key={step} step={step} className="not-last:flex-1">
              <StepperTrigger>
                <StepperIndicator className="size-4 data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:bg-transparent [&_span]:sr-only [&_svg]:size-3" />
              </StepperTrigger>
              {step < steps.length && <StepperSeparator />}
            </StepperItem>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit(handleSubmitForm)}>
          {currentStep === 1 && (
            <>
              <div className="flex items-center gap-2 mb-6">
                <User className="w-6 h-6 text-slate-600" />
                <h2 className="text-xl font-semibold text-slate-900">
                  Informações Pessoais
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Nome Completo *</Label>
                  <Input
                    id="fullName"
                    placeholder="Seu nome completo"
                    className="mt-1"
                    {...register('fullName')}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="mt-1"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      className="mt-1"
                      {...register('cpf')}
                    />
                    {errors.cpf && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.cpf.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="birthDate">Data de Nascimento *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      className="mt-1"
                      {...register('birthDate')}
                    />
                    {errors.birthDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.birthDate.message}
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
                      className="mt-1"
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="password">Senha *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="mt-1"
                      {...register('password')}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white py-6 text-lg mt-6"
                  disabled={Object.keys(errors).length > 0}
                >
                  {Object.keys(errors).length > 0
                    ? 'Corrija os erros acima'
                    : 'Próximo'}
                </Button>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-6 h-6 text-slate-600" />
                <h2 className="text-xl font-semibold text-slate-900">
                  Dados de Endereço
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="zipcode">CEP *</Label>
                  <Input
                    id="zipcode"
                    placeholder="00000-000"
                    className="mt-1"
                    {...register('zipcode')}
                  />
                  {errors.zipcode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.zipcode.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="address">Endereço *</Label>
                  <Input
                    id="address"
                    placeholder="Rua, número, complemento, bairro, cidade, estado"
                    className="mt-1"
                    {...register('address')}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-3 mt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white py-6 text-lg "
                >
                  Criar Conta
                </Button>
                <Button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-6 text-lg mr-4"
                >
                  Voltar
                </Button>
              </div>
            </>
          )}
        </form>
        <div className="text-center text-sm text-slate-600 mt-4">
          Já tem uma conta?{' '}
          <Link
            href="/auth/sign-in"
            className="text-slate-900 font-semibold hover:underline"
          >
            Faça login
          </Link>
        </div>
      </Card>
    </>
  );
}
