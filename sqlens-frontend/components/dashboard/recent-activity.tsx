import { getRecentActivities } from "@/lib/data/dashboard";
import type { RecentActivityItem } from "@/lib/data/dashboard";
import { RecentQueriesTable } from "./recent-queries-table";

export async function RecentActivity() {
  let activities: RecentActivityItem[] = [];
  try {
    activities = await getRecentActivities();
  } catch {
    activities = [];
  }

  return <RecentQueriesTable initialActivities={activities} />;
}
