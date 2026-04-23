import type { Kpi } from '@/lib/data/types';
import KpiCard from './KpiCard';

interface KpiGridProps {
  kpis: Kpi[];
}

export default function KpiGrid({ kpis }: KpiGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}
