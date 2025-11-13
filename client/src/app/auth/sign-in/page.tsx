'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  signInUserSchema,
  TSignInUserSchema,
} from '@/validations/sign-in-schema';

export default function Login() {
  const { handleLogin } = useAuthContext();

  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    formState: { errors: userErrors },
  } = useForm<TSignInUserSchema>({
    resolver: zodResolver(signInUserSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await handleLogin(data.identifier, data.password);
    } catch (err: any) {
      toast.error(err?.message || 'Falha no login');
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center justify-center mb-4">
          <Image
            src="/logo-icon.png"
            alt="AgendeSUS"
            className="h-16 w-16 object-contain"
            height={64}
            width={64}
          />
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Bem-vindo de volta
        </h1>
        <p className="text-slate-600">Faça login para continuar</p>
      </div>

      <Card className="p-6 border border-slate-200 bg-white shadow-lg">
        {/* <CardHeader>
          <CardTitle>Não possui Conta?</CardTitle>
          <CardDescription>
            Crie uma conta para acessar todos os recursos.
          </CardDescription>
        </CardHeader> */}

        <CardContent>
          <form onSubmit={handleSubmitUser(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="paciente-email">E-mail</Label>
              <Input
                id="paciente-email"
                type="email"
                placeholder="seu@email.com"
                {...registerUser('identifier')}
              />
              {userErrors.identifier && (
                <p className="text-red-500 text-sm mt-1">
                  {userErrors.identifier.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="paciente-senha">Senha</Label>
              <Input
                id="paciente-senha"
                type="password"
                placeholder="••••••••"
                {...registerUser('password')}
              />
              {userErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {userErrors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link href="#" className="text-slate-600 hover:text-slate-900">
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-600 hover:bg-slate-700 text-white py-6"
            >
              Entrar
            </Button>

            <div className="text-center text-sm text-slate-600">
              Não tem uma conta?{' '}
              <Link
                href="/auth/sign-up"
                className="text-slate-900 font-semibold hover:underline"
              >
                Cadastre-se
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
