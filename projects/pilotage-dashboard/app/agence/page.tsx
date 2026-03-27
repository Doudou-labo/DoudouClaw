import { DashboardScope } from '@/components/dashboard-scope';
import { getDashboardRows } from '@/lib/repository';

export default function AgencePage() {
  return <DashboardScope scope="AGENCE" rows={getDashboardRows('AGENCE')} />;
}
