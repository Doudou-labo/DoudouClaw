import { DashboardScope } from '@/components/dashboard-scope';
import { getAvailablePeriods, getDashboardRows } from '@/lib/repository';

export default async function AgencePage({ searchParams }: { searchParams?: Promise<{ period?: string }> }) {
  const params = searchParams ? await searchParams : undefined;
  const period = params?.period;

  return <DashboardScope scope="AGENCE" rows={getDashboardRows('AGENCE')} periods={getAvailablePeriods()} selectedPeriod={period} />;
}
