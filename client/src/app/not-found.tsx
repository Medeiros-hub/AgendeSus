'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6 text-center">
      <div className="space-y-6 max-w-md">
        <div className="space-y-3">
          <h1 className="text-8xl font-bold text-blue-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800">
            Página Não Encontrada
          </h2>
          <p className="text-muted-foreground">
            A página que você está procurando não existe ou pode ter sido
            movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">Voltar para a Página Inicial</Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="cursor-pointer"
          >
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}
