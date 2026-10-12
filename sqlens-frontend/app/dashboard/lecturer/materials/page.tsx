import { PageHeader } from "@/components/layout/page-header";
import { MaterialManager } from "@/components/lecturer/material-manager";
import { DEMO_MATERIALS } from "@/lib/features/lecturer/demo-data";
import { requireDosen } from "@/lib/auth/guards";
import { listMaterialsForCurrentUser } from "@/lib/api/server/materials";
import type { Material } from "@/lib/api/contracts/lecturer";

export default async function MaterialsPage() {
  await requireDosen();
  let materials: Material[] = [];
  try {
    materials = await listMaterialsForCurrentUser();
    if (materials.length === 0) {
      materials = DEMO_MATERIALS;
    }
  } catch {
    materials = DEMO_MATERIALS;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Materi & Latihan"
        badge="DOSEN/ASISTEN"
        description="Kelola materi pembelajaran SQLens yang tersimpan di sistem."
      />
      <MaterialManager initialMaterials={materials} />
    </div>
  );
}

