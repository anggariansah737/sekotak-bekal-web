import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  User,
  LogIn,
  Heart,
  MapPin,
  Bell,
  HelpCircle,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "Profil — Sekotak Bekal" }] }),
});

const menuItems = [
  { icon: Heart, label: "Menu Favorit" },
  { icon: MapPin, label: "Alamat Pengiriman" },
  { icon: Bell, label: "Notifikasi" },
  { icon: HelpCircle, label: "Bantuan" },
];

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Berhasil keluar");
      navigate({ to: "/" });
    } catch (err) {
      toast.error("Gagal keluar");
    }
  };

  return (
    <div className="min-h-screen pb-28">
      <header className="border-b border-border bg-background px-4 py-4">
        <h1 className="font-display text-xl font-bold">Profil</h1>
      </header>

      {/* User card */}
      <section className="px-4 pt-5">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
              <User className="size-7" />
            </span>
            <div className="flex-1">
              {user ? (
                <>
                  <p className="font-display text-base font-bold">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.phone}</p>
                </>
              ) : (
                <>
                  <p className="font-display text-base font-bold">Tamu</p>
                  <p className="text-xs text-muted-foreground">
                    Masuk untuk pengalaman lebih lengkap
                  </p>
                </>
              )}
            </div>
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive"
              >
                <LogOut className="size-3.5" /> Keluar
              </button>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
              >
                <LogIn className="size-3.5" /> Masuk
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Menu list */}
      <section className="px-4 pt-4">
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {menuItems.map(({ icon: Icon, label }) => (
            <li key={label}>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/50"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-4" />
                </span>
                <span className="flex-1 text-sm font-medium">{label}</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-center text-[11px] text-muted-foreground">
        Sekotak Bekal v1.0 · Dibuat dengan ♥
      </p>

      <BottomNav />
    </div>
  );
}
