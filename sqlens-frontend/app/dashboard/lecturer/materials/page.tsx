import { PageHeader } from "@/components/layout/page-header";
import { MaterialManager } from "@/components/lecturer/material-manager";
import { DEMO_MATERIALS } from "@/lib/features/lecturer/demo-data";
import { requireDosen } from "@/lib/auth/guards";

export default async function MaterialsPage() {
  await requireDosen();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Materi & Latihan"
        badge="DOSEN/ASISTEN"
        description="Kelola draft materi melalui batas frontend yang siap dihubungkan ke BFF."
      />
      <MaterialManager initialMaterials={DEMO_MATERIALS} />
    </div>
  );
}
