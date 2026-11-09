import { PageHeader } from "@/components/layout/page-header";
import { MaterialManager } from "@/components/lecturer/material-manager";
import { SharedDatasetManager } from "@/components/lecturer/shared-dataset-manager";
import { DEMO_MATERIALS } from "@/lib/features/lecturer/demo-data";
import { requireDosen } from "@/lib/auth/guards";
import { listMaterialsForCurrentUser } from "@/lib/api/server/materials";
import { getSharedDatasets } from "@/lib/api/server/shared-datasets";
import type { Material } from "@/lib/api/contracts/lecturer";
import type { SharedDataset } from "@/lib/api/contracts/shared-datasets";

export default async function MaterialsPage() {
  await requireDosen();
  let materials: Material[] = [];
  let sharedDatasets: SharedDataset[] = [];

  try {
    materials = await listMaterialsForCurrentUser();
    if (materials.length === 0) {
      materials = DEMO_MATERIALS;
    }
  } catch {
    materials = DEMO_MATERIALS;
  }

  try {
    sharedDatasets = await getSharedDatasets();
  } catch {
    sharedDatasets = [];
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Materi, Latihan & Dataset Kelas"
        badge="DOSEN/ASISTEN"
        description="Kelola modul pembelajaran dan unggah basis data studi kasus tugas kelas untuk mahasiswa."
      />
      <SharedDatasetManager initialDatasets={sharedDatasets} />
      <MaterialManager initialMaterials={materials} />
    </div>
  );
}
