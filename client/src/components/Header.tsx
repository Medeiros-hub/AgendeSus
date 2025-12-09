'use client';

import {
  Calendar,
  LayoutDashboard,
  LogOut,
  UserCircle,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthContext } from '@/contexts/AuthContext';
import { EUserType } from '@/services/internal-api/types/auth';

interface HeaderProps {
  variant?: 'default' | 'atendente';
}

export default function Header({ variant = 'default' }: HeaderProps) {
  const { user, isAuthenticated, handleLogOut } = useAuthContext();
  const pathname = usePathname();

  const isAtendente =
    pathname === '/receptionist' ||
    pathname === '/attendant/register-doctor' ||
    pathname.startsWith('/admin/users');

  const canAccessReceptionist =
    user?.type === EUserType.ADMIN || user?.type === EUserType.RECEPTIONIST;

  const isAdmin = user?.type === EUserType.ADMIN;

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
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
          {/* Navigation for authenticated users */}
          {isAuthenticated && !isAtendente && (
            <nav className="flex items-center gap-2 mr-4">
              <Link href="/my-schedulings">
                <Button
                  variant="ghost"
                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Meus Agendamentos
                </Button>
              </Link>
              {canAccessReceptionist && (
                <Link href="/receptionist">
                  <Button
                    variant="ghost"
                    className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Área do Atendente
                  </Button>
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin/users">
                  <Button
                    variant="ghost"
                    className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Usuários
                  </Button>
                </Link>
              )}
            </nav>
          )}

          {/* Login/Register buttons for non-authenticated users */}
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

          {/* User menu for authenticated users */}
          {isAuthenticated && !isAtendente && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-slate-300"
                >
                  <UserCircle className="w-4 h-4" />
                  <span className="max-w-[150px] truncate">
                    {user?.fullName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-slate-600">
                  <UserCircle className="w-4 h-4 mr-2" />
                  {user?.type === EUserType.ADMIN
                    ? 'Administrador'
                    : user?.type === EUserType.RECEPTIONIST
                      ? 'Recepcionista'
                      : 'Cidadão'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogOut}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Atendente area actions */}
          {(variant === 'atendente' || isAtendente) && (
            <>
              {pathname === '/receptionist' && (
                <Link href="/attendant/register-doctor">
                  <Button className="bg-slate-600 hover:bg-slate-700 text-white">
                    Cadastrar Médico
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={handleLogOut}
              >
                Sair
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
