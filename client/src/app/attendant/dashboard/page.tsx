'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  XCircle,
} from 'lucide-react';

import AppointmentTable from '@/components/AppointmentTable';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AttendantAreaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header variant="atendente" />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <StatsCard
              label="Total"
              value={10}
              icon={Calendar}
              color="gray"
              delay={0}
            />
            <StatsCard
              label="Pendentes"
              value={2}
              icon={Clock}
              color="orange"
              delay={0.05}
            />
            <StatsCard
              label="Confirmados"
              value={3}
              icon={CheckCircle2}
              color="blue"
              delay={0.1}
            />
            <StatsCard
              label="Concluídas"
              value={4}
              icon={CheckCircle2}
              color="green"
              delay={0.15}
            />
            <StatsCard
              label="Canceladas"
              value={1}
              icon={XCircle}
              color="red"
              delay={0.2}
            />
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="bg-white rounded-lg border border-slate-200 p-6 mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">Filtros</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input placeholder="Buscar por Nome ou CPF" className="pl-10" />
              </div>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Status da Consulta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <AppointmentTable />
        </div>
      </main>
      <Footer />
    </div>
  );
}
