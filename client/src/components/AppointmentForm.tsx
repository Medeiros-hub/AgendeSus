//TODO: REFACTOR COMPONENT
'use client';

import { motion } from 'framer-motion';
import { Calendar, FileText, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

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
import { AppointmentCreate } from '@/types/appointment';

export default function AppointmentForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AppointmentCreate>();
  const { user, isAuthenticated } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: AppointmentCreate) => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Erro na requisição');
      }

      const created = await res.json();
      console.log('Form submitted:', created);
      alert('Consulta agendada com sucesso');
    } catch (err) {
      console.error(err);
      alert('Erro ao agendar consulta');
    } finally {
      setLoading(false);
    }
  };

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
                <Label htmlFor="nomeCompleto" className="text-slate-700">
                  Nome Completo
                </Label>
                <Input
                  id="nomeCompleto"
                  placeholder="Nome Completo"
                  className="mt-1"
                  {...register('nomeCompleto', { required: true })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone" className="text-slate-700">
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    placeholder="(88)99999-9999"
                    className="mt-1"
                    {...register('telefone', { required: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="cpf" className="text-slate-700">
                    CPF
                  </Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    className="mt-1"
                    {...register('cpf', { required: true })}
                  />
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
                  <Label htmlFor="servico" className="text-slate-700">
                    Serviço
                  </Label>
                  <Select onValueChange={(v) => setValue('servico', v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Medico Pediatra" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pediatra">Medico Pediatra</SelectItem>
                      <SelectItem value="clinico">Clínico Geral</SelectItem>
                      <SelectItem value="dentista">Dentista</SelectItem>
                      <SelectItem value="ocupanista">
                        Medico Ocupanista
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="medico" className="text-slate-700">
                    Médico
                  </Label>
                  <Select onValueChange={(v) => setValue('medico', v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Dr. Vitor Paulino" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vitor">Dr. Vitor Paulino</SelectItem>
                      <SelectItem value="vera">Dra. Vera</SelectItem>
                      <SelectItem value="luiz">Dr. Luiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data" className="text-slate-700">
                    Data
                  </Label>
                  <Input
                    id="data"
                    type="date"
                    className="mt-1"
                    {...register('data', { required: true })}
                  />
                </div>

                <div>
                  <Label htmlFor="horario" className="text-slate-700">
                    Horário
                  </Label>
                  <Select onValueChange={(v) => setValue('horario', v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="09:00" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                      <SelectItem value="14:00">14:00</SelectItem>
                      <SelectItem value="15:00">15:00</SelectItem>
                      <SelectItem value="16:00">16:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-slate-600 hover:bg-slate-700 text-white py-6 text-lg"
            disabled={loading}
          >
            {loading ? 'Agendando...' : 'Agendar Consulta'}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}
