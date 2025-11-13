import { motion } from 'framer-motion';
import { Clock,MapPin, Phone } from 'lucide-react';

import { Card } from '@/components/ui/card';

interface InfoCardProps {
  type: 'address' | 'contact' | 'hours';
  title: string;
  content: string;
  delay?: number;
}

export default function InfoCard({ type, title, content, delay = 0 }: InfoCardProps) {
  const icons = {
    address: MapPin,
    contact: Phone,
    hours: Clock,
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="p-6 text-center border border-slate-200 bg-white hover:shadow-md transition-shadow">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <Icon className="w-6 h-6 text-slate-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{content}</p>
      </Card>
    </motion.div>
  );
}