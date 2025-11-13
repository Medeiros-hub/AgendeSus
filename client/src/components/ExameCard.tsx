import { motion } from 'framer-motion';

import { Card } from '@/components/ui/card';

interface ExameCardProps {
  title: string;
  delay?: number;
}

export default function ExameCard({ title, delay = 0 }: ExameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer border border-slate-200 bg-white">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      </Card>
    </motion.div>
  );
}