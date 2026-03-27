import { DashboardScope } from '@/components/dashboard-scope';
import { getAvailablePeriods, getDashboardRows } from '@/lib/repository';

export default async function VlPage({ searchParams }: { searchParams?: Promise<{ period?: string }> }) {
  const params = searchParams ? await searchParams : undefined;
  const period = params?.period;

  return <DashboardScope scope="VL" rows={getDashboardRows('VL')} periods={getAvailablePeriods()} selectedPeriod={period} />;
}
