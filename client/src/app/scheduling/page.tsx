'use client';

import { motion } from 'framer-motion';

import AppointmentForm from '@/components/AppointmentForm';
import ExameCard from '@/components/ExameCard';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import InfoCard from '@/components/InfoCard';

export default function SchedulingPage() {
  const exames = ['Dentista', 'Medico Ocupanista', 'Prevenção'];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-linear-to-br from-slate-100 via-slate-50 to-blue-50">
        {/* Info Cards Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <InfoCard
                type="address"
                title="Endereço"
                content="Av. Vicente Alençar Barbosa S/N - Sipauba, Araripe - CE, 63170S-000"
                delay={0}
              />
              <InfoCard
                type="contact"
                title="Contato"
                content="Aliquam Vehicula Pellentesque Id Mi Quam Ipsum. Arcu Nisl Faucibus Mattis Etiam."
                delay={0.1}
              />
              <InfoCard
                type="hours"
                title="Horário De Funcionamento"
                content="Segunda a Sexta: 08:00 - 17:00"
                delay={0.2}
              />
            </div>
          </div>
        </section>

        {/* Appointment Form Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <AppointmentForm />
          </div>
        </section>

        {/* Exames Section */}
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
