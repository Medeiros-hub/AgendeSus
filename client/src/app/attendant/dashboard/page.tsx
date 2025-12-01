'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AttendantAreaPage() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a página de recepcionista que é a verdadeira área do atendente
    router.replace('/receptionist');
  }, [router]);

  return null;
}
