import { DashboardScope } from '@/components/dashboard-scope';
import { getAvailablePeriods, getDashboardRows } from '@/lib/repository';

export default async function PlPage({ searchParams }: { searchParams?: Promise<{ period?: string }> }) {
  const params = searchParams ? await searchParams : undefined;
  const period = params?.period;

  return <DashboardScope scope="PL" rows={getDashboardRows('PL')} periods={getAvailablePeriods()} selectedPeriod={period} />;
}
