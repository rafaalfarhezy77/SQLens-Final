import { PageHeader } from "@/components/layout/page-header";
import { DEMO_IOT_READINGS } from "@/lib/features/lecturer/demo-data";
import { requireSession } from "@/lib/auth/guards";
import { Badge } from "@/components/ui/badge";

export default async function IoTPage() {
  await requireSession();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitoring Data IoT"
        badge="MODE DEMO FRONTEND"
        description="Tampilan pembacaan sensor dengan kontrak terketik; bukan koneksi perangkat langsung."
      />
      <div className="border-3 border-[#111111] bg-[#FFF3A3] p-4 shadow-[3px_3px_0_#111111] text-xs font-mono font-bold flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-[#FFD600] border border-[#111111] inline-block" />
        <span>
          LIVE IOT BELUM TERHUBUNG — fixture development yang diisolasi
          digunakan untuk memverifikasi UI.
        </span>
      </div>
      <section className="overflow-x-auto border-3 border-[#111111] shadow-[5px_5px_0_#111111] bg-white">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead className="bg-[#FFF3A3] border-b-2 border-[#111111]">
            <tr>
              <th className="p-3 border-r border-[#111111] font-black uppercase">
                Perangkat
              </th>
              <th className="p-3 border-r border-[#111111] font-black uppercase">
                Sensor
              </th>
              <th className="p-3 border-r border-[#111111] font-black uppercase">
                Nilai
              </th>
              <th className="p-3 border-r border-[#111111] font-black uppercase">
                Waktu
              </th>
              <th className="p-3 font-black uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y border-[#111111]">
            {DEMO_IOT_READINGS.map((reading) => (
              <tr
                key={reading.id}
                className="hover:bg-[#F7F7F2] transition-colors"
              >
                <td className="p-3 font-bold border-r border-[#111111]">
                  {reading.deviceId}
                </td>
                <td className="p-3 border-r border-[#111111]">
                  {reading.sensorType}
                </td>
                <td className="p-3 font-bold border-r border-[#111111]">
                  {reading.value} {reading.unit}
                </td>
                <td className="p-3 border-r border-[#111111] text-[#666666]">
                  {reading.recordedAt}
                </td>
                <td className="p-3">
                  <Badge
                    variant={reading.status === "normal" ? "success" : "yellow"}
                  >
                    {reading.status.toUpperCase()}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
