'use client';

import { AnimatePresence,motion } from 'framer-motion';
import { Check,Copy, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from './ui/button';

interface ConfirmCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  confirmCode: string;
  schedulingInfo: {
    serviceName: string;
    professionalName: string;
    ubsName: string;
    date: string;
    time: string;
  };
}

export function ConfirmCodeModal({
  isOpen,
  onClose,
  confirmCode,
  schedulingInfo,
}: ConfirmCodeModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(confirmCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            onClick={onClose}
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
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-white">
                  Código de Confirmação
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  Apresente este código ao atendente
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Confirm Code Display */}
                <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-xl p-8 text-center mb-6 border-2 border-slate-200">
                  <p className="text-sm text-slate-600 mb-2 font-medium">
                    Seu código
                  </p>
                  <div className="text-5xl font-bold text-blue-600 tracking-widest mb-4 font-mono">
                    {confirmCode}
                  </div>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar código
                      </>
                    )}
                  </Button>
                </div>

                {/* Scheduling Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">
                    Detalhes do Agendamento
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Serviço:</span>
                      <span className="font-medium text-slate-900">
                        {schedulingInfo.serviceName}
                      </span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Profissional:</span>
                      <span className="font-medium text-slate-900">
                        {schedulingInfo.professionalName}
                      </span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">UBS:</span>
                      <span className="font-medium text-slate-900">
                        {schedulingInfo.ubsName}
                      </span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Data:</span>
                      <span className="font-medium text-slate-900">
                        {schedulingInfo.date}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="text-slate-600">Horário:</span>
                      <span className="font-medium text-slate-900">
                        {schedulingInfo.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Important Note */}
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Importante:</strong> Apresente este código ao
                    atendente para confirmar sua presença na consulta.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-200">
                <Button onClick={onClose} className="w-full">
                  Fechar
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
