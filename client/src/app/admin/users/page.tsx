'use client';

import { motion } from 'framer-motion';
import {
  Edit,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  UserCircle,
  Users as UsersIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRequestApi } from '@/hooks/use-request-api';
import { EUserType } from '@/services/internal-api/types/auth';
import { users } from '@/services/internal-api/users';

export default function UsersManagementPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<EUserType | 'ALL'>('ALL');
  const limit = 10;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data,
    handler: fetchUsers,
    isLoading,
  } = useRequestApi(users.getUsersList);

  const { handler: deleteUserHandler } = useRequestApi(users.deleteUser, {
    onSuccess: () => {
      toast.success('Usuário excluído com sucesso!');
      fetchUsers({
        page,
        limit,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(typeFilter !== 'ALL' ? { type: typeFilter } : {}),
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao excluir usuário');
    },
  });

  useEffect(() => {
    fetchUsers({
      page,
      limit,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(typeFilter !== 'ALL' ? { type: typeFilter } : {}),
    });
  }, [page, debouncedSearch, typeFilter]);

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o usuário "${name}"? Esta ação não pode ser desfeita.`,
      )
    ) {
      await deleteUserHandler({ id });
    }
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case EUserType.ADMIN:
        return 'Administrador';
      case EUserType.RECEPTIONIST:
        return 'Recepcionista';
      case EUserType.CITIZEN:
        return 'Cidadão';
      default:
        return type;
    }
  };

  const getUserTypeBadgeClass = (type: string) => {
    switch (type) {
      case EUserType.ADMIN:
        return 'bg-purple-100 text-purple-800';
      case EUserType.RECEPTIONIST:
        return 'bg-blue-100 text-blue-800';
      case EUserType.CITIZEN:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const usersList = data?.users || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header variant="atendente" />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
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
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Gerenciamento de Usuários
                  </h1>
                  <p className="text-slate-600">
                    Gerencie todos os usuários do sistema
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push('/admin/users/create')}
                className="bg-slate-600 hover:bg-slate-700 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Novo Usuário
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total</p>
                    <p className="text-2xl font-bold text-slate-900">{total}</p>
                  </div>
                  <div className="p-3 bg-slate-100 rounded-lg">
                    <UsersIcon className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Administradores</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {
                        usersList.filter(
                          (u) => u.props.type === EUserType.ADMIN,
                        ).length
                      }
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <UserCircle className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Recepcionistas</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {
                        usersList.filter(
                          (u) => u.props.type === EUserType.RECEPTIONIST,
                        ).length
                      }
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <UserCircle className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Cidadãos</p>
                    <p className="text-2xl font-bold text-green-600">
                      {
                        usersList.filter(
                          (u) => u.props.type === EUserType.CITIZEN,
                        ).length
                      }
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <UserCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters and Table */}
            <Card className="p-6 border-slate-200 shadow-sm">
              <div className="space-y-6">
                {/* Filters */}
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Filtros
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        placeholder="Buscar por nome, CPF ou email"
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <Select
                      value={typeFilter}
                      onValueChange={(value) =>
                        setTypeFilter(value as EUserType | 'ALL')
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de usuário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Todos</SelectItem>
                        <SelectItem value={EUserType.ADMIN}>
                          Administrador
                        </SelectItem>
                        <SelectItem value={EUserType.RECEPTIONIST}>
                          Recepcionista
                        </SelectItem>
                        <SelectItem value={EUserType.CITIZEN}>
                          Cidadão
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Table */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Lista de Usuários
                    </h2>
                    {!isLoading && total > 0 && (
                      <span className="text-sm text-slate-600">
                        {total} {total === 1 ? 'usuário' : 'usuários'}
                      </span>
                    )}
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>CPF</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Cadastro</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                                <span className="text-slate-600">
                                  Carregando...
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : usersList.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <p className="text-slate-600">
                                Nenhum usuário encontrado
                              </p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          usersList.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">
                                {user.props.fullName}
                              </TableCell>
                              <TableCell>{user.props.cpf.value}</TableCell>
                              <TableCell>{user.props.email.value}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUserTypeBadgeClass(user.props.type)}`}
                                >
                                  {getUserTypeLabel(user.props.type)}
                                </span>
                              </TableCell>
                              <TableCell>
                                {formatDate(user.createdAt)}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        router.push(`/admin/users/${user.id}`)
                                      }
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDelete(
                                          user.id,
                                          user.props.fullName,
                                        )
                                      }
                                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Excluir
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Pagination */}
                {!isLoading && total > 0 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                      Mostrando {(page - 1) * limit + 1} até{' '}
                      {Math.min(page * limit, total)} de {total} usuários
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                      >
                        Próxima
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
