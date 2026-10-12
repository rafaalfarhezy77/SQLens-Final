import { PageHeader } from "@/components/layout/page-header";
import { DEMO_ACTIVITIES } from "@/lib/features/lecturer/demo-data";
import { requireDosen } from "@/lib/auth/guards";
import { getStudentActivitiesForLecturer } from "@/lib/api/server/lecturer";
import type { StudentActivity } from "@/lib/api/contracts/lecturer";

export default async function StudentsPage() {
  await requireDosen();
  let activities: StudentActivity[] = [];
  try {
    activities = await getStudentActivitiesForLecturer();
    if (activities.length === 0) {
      activities = DEMO_ACTIVITIES;
    }
  } catch {
    activities = DEMO_ACTIVITIES;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Aktivitas Mahasiswa"
        badge="PORTAL DOSEN"
        description="Riwayat eksekusi query SQL mahasiswa yang tersimpan di database pembelajaran."
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
            {activities.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">
                  {item.studentName}
                  <br />
                  <span className="font-mono">{item.email}</span>
                </td>
                <td className="p-3 font-mono">{item.query}</td>
                <td className="p-3">
                  <span
                    className={`inline-block px-2 py-0.5 border border-[#111111] text-[10px] font-bold uppercase ${
                      item.status === "success"
                        ? "bg-[#00D084] text-[#111111]"
                        : "bg-[#FF5A5F] text-white"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-3 font-mono">{item.count} query</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

