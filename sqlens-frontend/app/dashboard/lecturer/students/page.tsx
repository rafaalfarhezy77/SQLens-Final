import { PageHeader } from "@/components/layout/page-header";
import { DEMO_ACTIVITIES } from "@/lib/features/lecturer/demo-data";
import { requireDosen } from "@/lib/auth/guards";

export default async function StudentsPage() {
  await requireDosen();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Aktivitas Mahasiswa"
        badge="MODE DEMO FRONTEND"
        description="Riwayat aktivitas terketik yang akan diganti endpoint BFF dosen."
      />
      <section className="overflow-x-auto border-2 border-[#111111] bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FFF3A3]">
            <tr>
              <th className="p-3">Mahasiswa</th>
              <th className="p-3">Query</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aktivitas</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_ACTIVITIES.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">
                  {item.studentName}
                  <br />
                  <span className="font-mono">{item.email}</span>
                </td>
                <td className="p-3 font-mono">{item.query}</td>
                <td className="p-3">{item.status}</td>
                <td className="p-3">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
