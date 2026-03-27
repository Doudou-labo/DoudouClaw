import { DashboardScope } from '@/components/dashboard-scope';
import { getDashboardRows } from '@/lib/repository';

export default function PlPage() {
  return <DashboardScope scope="PL" rows={getDashboardRows('PL')} />;
}
