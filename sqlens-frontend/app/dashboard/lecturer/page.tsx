import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DEMO_ACTIVITIES,
  DEMO_MATERIALS,
  DEMO_PROGRESS,
} from "@/lib/features/lecturer/demo-data";
import { requireDosen } from "@/lib/auth/guards";

export default async function LecturerPage() {
  await requireDosen();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Dosen/Asisten"
        badge="MODE DEMO FRONTEND"
        description="Ringkasan terketik untuk integrasi BFF pembelajaran."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Mahasiswa", DEMO_PROGRESS.length],
          ["Aktivitas", DEMO_ACTIVITIES.length],
          ["Materi", DEMO_MATERIALS.length],
        ].map(([label, value]) => (
          <Card key={String(label)} variant="white">
            <CardHeader>
              <CardTitle>{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Button href="/dashboard/lecturer/materials">Kelola Materi</Button>
        <Button href="/dashboard/lecturer/students" variant="secondary">
          Aktivitas Mahasiswa
        </Button>
        <Button href="/dashboard/lecturer/progress" variant="secondary">
          Progress Mahasiswa
        </Button>
      </div>
    </div>
  );
}
