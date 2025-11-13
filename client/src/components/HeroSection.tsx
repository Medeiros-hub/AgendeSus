import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 py-20 relative overflow-hidden">
      {/* Diagonal stripes background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(100, 116, 139, 0.1) 35px, rgba(100, 116, 139, 0.1) 70px)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Posto de Saúde Sede 1
          </h1>

          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Somos o seu ponto de referência em bem-estar na comunidade. Da
            prevenção ao tratamento, nossa equipe está pronta para cuidar de
            você e sua família com o respeito e a empatia que vocês merecem.
          </p>

          <Link href="/scheduling">
            <Button
              size="lg"
              className="bg-slate-600 hover:bg-slate-700 text-white px-12 py-6 text-lg"
            >
              Agendar consulta
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
