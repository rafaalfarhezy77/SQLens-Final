import "server-only";

import { listQueryHistoryForCurrentUser } from "@/lib/api/server/query-history";

export interface RecentActivityItem {
  id: string;
  query: string;
  action: string;
  status: "success" | "warning" | "error";
  duration: string;
  timestamp: string;
}

export interface LearningTopicItem {
  id: string;
  title: string;
  progressPercent: number;
  completed: boolean;
  score: string;
}

function relativeTime(timestamp: string): string {
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000),
  );
  if (seconds < 60) return "baru saja";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
  if (seconds < 86_400) return `${Math.floor(seconds / 3600)} jam lalu`;
  return `${Math.floor(seconds / 86_400)} hari lalu`;
}

export async function getRecentActivities(): Promise<RecentActivityItem[]> {
  const history = await listQueryHistoryForCurrentUser();
  return history.items.slice(0, 5).map((item) => ({
    id: item.id,
    query: item.query,
    action: item.status === "success" ? "Eksekusi query" : "Query Checker",
    status: item.status === "success" ? "success" : "error",
    duration:
      item.executionTimeMs === undefined ? "—" : `${item.executionTimeMs}ms`,
    timestamp: relativeTime(item.executedAt),
  }));
}

/** Transparent progress is calculated from persisted successful practice. */
export async function getLearningProgress(): Promise<LearningTopicItem[]> {
  const history = await listQueryHistoryForCurrentUser();
  const successfulQueries = history.items.filter(
    (item) => item.status === "success",
  );
  const checkpoints = [
    [
      "select",
      "Dasar Relasional & Proyeksi SELECT",
      successfulQueries.some((item) => /\bSELECT\b/i.test(item.query)),
    ],
    [
      "where",
      "Filtering WHERE & Logika Boolean",
      successfulQueries.some((item) => /\bWHERE\b/i.test(item.query)),
    ],
    [
      "join",
      "Multi-table Relational JOIN",
      successfulQueries.some((item) => /\bJOIN\b/i.test(item.query)),
    ],
  ] as const;
  return checkpoints.map(([id, title, completed]) => ({
    id,
    title,
    progressPercent: completed ? 100 : 0,
    completed,
    score: completed ? "Tuntas" : "Belum dipraktikkan",
  }));
}
