'use client';

import { motion } from 'framer-motion';

import ExameCard from '@/components/ExameCard';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';

export default function Page() {
  const exames = ['Dentista', 'Medico Ocupanista', 'Prevenção'];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <HeroSection />

        {/* Seção de Exames */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-center text-slate-900 mb-12"
            >
              Seus Exames
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {exames.map((exame, index) => (
                <ExameCard key={exame} title={exame} delay={index * 0.1} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
