import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

import { Card } from '@/components/ui/card';

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export default function StatsCard({ label, value, icon: Icon, color, delay = 0 }: StatsCardProps) {
  const colorClasses = {
    orange: 'text-orange-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    red: 'text-red-500',
    gray: 'text-slate-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="p-6 border border-slate-200 bg-white hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">{label}</p>
            <p className={`text-4xl font-bold ${colorClasses[color as keyof typeof colorClasses]}`}>
              {value}
            </p>
          </div>
          <div className={`${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="w-8 h-8" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}