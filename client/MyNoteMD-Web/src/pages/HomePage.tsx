import DashboardLayout from "@/features/dashboard/components/dashboard-layout";
import { RecentActivity } from "@/features/dashboard/components/recent-sections";

export default function HomePage() {
  return (
    <DashboardLayout>
      <RecentActivity />
    </DashboardLayout>
  );
}