import { PageHeader } from "@/components/layout/page-header";
import { ProfileCard } from "@/components/profile/profile-card";
import { requireSession } from "@/lib/auth/guards";

export default async function ProfilePage() {
  const session = await requireSession();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Profil"
        badge="AKUN"
        description="Tinjau identitas dan peran sesi SQLens Anda."
      />
      <ProfileCard user={session} />
    </div>
  );
}
