import { DashboardScope } from '@/components/dashboard-scope';
import { getDashboardRows } from '@/lib/repository';

export default function VlPage() {
  return <DashboardScope scope="VL" rows={getDashboardRows('VL')} />;
}
