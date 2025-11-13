'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';

interface HeaderProps {
  variant?: 'default' | 'atendente';
}

export default function Header({ variant = 'default' }: HeaderProps) {
  const { user, isAuthenticated } = useAuthContext();
  const pathname = usePathname();

  const isAtendente =
    pathname === '/attendant/dashboard' ||
    pathname === '/attendant/register-doctor';
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-icon.png"
            alt="AgendeSUS"
            className="h-12 w-12 object-contain"
            width={48}
            height={48}
          />
          <span className="text-slate-700 font-semibold text-xl">
            {isAtendente ? 'Área do Atendente' : 'AgendeSUS'}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {variant === 'default' && !isAtendente && !isAuthenticated && (
            <>
              <Link href="/auth/sign-in">
                <Button
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-slate-600 hover:bg-slate-700 text-white">
                  Cadastrar
                </Button>
              </Link>
            </>
          )}
          {isAuthenticated && (
            <h1>
              <span>{user?.fullName}</span>
            </h1>
          )}
          {(variant === 'atendente' || isAtendente) && (
            <>
              {pathname === '/attendant/dashboard' && (
                <Link href="/attendant/register-doctor">
                  <Button className="bg-slate-600 hover:bg-slate-700 text-white">
                    Cadastrar Médico
                  </Button>
                </Link>
              )}
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Sair
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
