import { PageHeader } from "@/components/layout/page-header";
import { requireSession } from "@/lib/auth/guards";
import { Badge } from "@/components/ui/badge";
import { getLatestIoTReadings } from "@/lib/api/server/iot";

export default async function IoTPage() {
  await requireSession();
  let readings = [];
  try {
    readings = await getLatestIoTReadings();
  } catch (error) {
    console.error("Failed to load IoT readings:", error);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitoring Data IoT"
        badge="TELEMETRI AKTIF"
        description="Monitoring pembacaan sensor IoT lingkungan pembelajaran dari database dan perangkat live."
      />
      <div className="border-3 border-[#111111] bg-[#D4F4DD] p-4 shadow-[3px_3px_0_#111111] text-xs font-mono font-bold flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-[#00A854] border border-[#111111] inline-block" />
        <span>
          PIPELINE IOT AKTIF — Data telemetri sensor terhubung ke backend FastAPI dan PostgreSQL.
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
            {readings.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-[#666666]">
                  Belum ada data telemetri sensor. Jalankan simulator untuk merekam pembacaan baru.
                </td>
              </tr>
            ) : (
              readings.map((reading) => (
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
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
