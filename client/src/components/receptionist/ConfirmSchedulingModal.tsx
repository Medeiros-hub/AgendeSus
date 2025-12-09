'use client';

import { AnimatePresence,motion } from 'framer-motion';
import { AlertCircle,CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getErrorMessage } from '@/utils/error-handler';

interface ConfirmSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (confirmCode: string) => Promise<void>;
  schedulingInfo: {
    patientName: string;
    service: string;
    professional: string;
    dateTime: string;
  };
}

export function ConfirmSchedulingModal({
  isOpen,
  onClose,
  onConfirm,
  schedulingInfo,
}: ConfirmSchedulingModalProps) {
  const [confirmCode, setConfirmCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!confirmCode.trim()) {
      setError('Por favor, insira o código de confirmação');
      return;
    }

    if (confirmCode.length !== 6) {
      setError('O código deve ter 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(confirmCode.toUpperCase());
      handleClose();
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmCode('');
    setError('');
    onClose();
  };

  const handleInputChange = (value: string) => {
    // Only allow alphanumeric characters and limit to 6
    const sanitized = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    setConfirmCode(sanitized.slice(0, 6));
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6 relative">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Confirmar Presença
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                      Insira o código fornecido pelo paciente
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6">
                {/* Patient Info */}
                <div className="bg-slate-50 rounded-lg p-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Paciente:</span>
                    <span className="font-medium text-slate-900">
                      {schedulingInfo.patientName}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Serviço:</span>
                    <span className="font-medium text-slate-900">
                      {schedulingInfo.service}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Profissional:</span>
                    <span className="font-medium text-slate-900">
                      {schedulingInfo.professional}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Data/Hora:</span>
                    <span className="font-medium text-slate-900">
                      {schedulingInfo.dateTime}
                    </span>
                  </div>
                </div>

                {/* Confirm Code Input */}
                <div className="space-y-2 mb-6">
                  <Label
                    htmlFor="confirmCode"
                    className="text-base font-medium"
                  >
                    Código de Confirmação
                  </Label>
                  <Input
                    id="confirmCode"
                    type="text"
                    value={confirmCode}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Ex: ABC123"
                    className="text-center text-2xl font-bold tracking-widest uppercase h-14 font-mono"
                    maxLength={6}
                    autoFocus
                    disabled={isLoading}
                  />
                  <p className="text-sm text-slate-500 text-center">
                    Digite o código de 6 caracteres
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Info Alert */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Importante:</strong> Solicite ao paciente o código
                    de confirmação que foi enviado no momento do agendamento.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handleClose}
                    variant="outline"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading || !confirmCode}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Confirmando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Confirmar Presença
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
