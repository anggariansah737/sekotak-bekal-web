import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import authHero from "@/assets/auth-hero.jpg";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [{ title: "Daftar / Masuk — Sekotak Bekal" }],
  }),
});

type Tab = "daftar" | "masuk";

function AuthPage() {
  const navigate = useNavigate();
  const { register, login, user } = useAuth();
  const [tab, setTab] = useState<Tab>("daftar");
  const [showPwd, setShowPwd] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "daftar") {
        await register(name, phone, password);
        toast.success("Akun berhasil dibuat!");
      } else {
        await login(phone, password);
        toast.success("Berhasil masuk!");
      }
      navigate({ to: "/" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Hero image */}
      <div className="relative h-56 w-full overflow-hidden bg-accent">
        <img
          src={authHero}
          alt="Mangkuk sayur sehat"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/0 to-background" />
      </div>

      <div className="-mt-6 px-5">
        {/* Tabs */}
        <div className="mx-auto flex w-full rounded-full bg-muted p-1">
          {(["daftar", "masuk"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-full py-2 text-sm font-semibold capitalize transition-all",
                tab === t
                  ? "bg-surface text-primary shadow-sm"
                  : "text-muted-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <h1 className="font-display text-2xl font-bold">
            {tab === "daftar" ? "Buat Akun" : "Selamat Datang Kembali"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {tab === "daftar"
              ? "Daftar untuk pesan menu sehat harian dengan mudah"
              : "Masuk untuk lanjut memesan favoritmu"}
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {tab === "daftar" && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                placeholder="Mis. Sari Wulandari"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="wa">Nomor WhatsApp</Label>
            <Input
              id="wa"
              type="tel"
              placeholder="08xxxxxxxxxx"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pwd">Password</Label>
            <div className="relative">
              <Input
                id="pwd"
                type={showPwd ? "text" : "password"}
                placeholder="Minimal 6 karakter"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label="Tampilkan password"
              >
                {showPwd ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md shadow-primary/30 active:scale-[0.98] disabled:opacity-50"
          >
            {loading
              ? "Sedang memproses..."
              : tab === "daftar"
                ? "Daftar Sekarang"
                : "Masuk"}
            <ArrowRight className="size-4" />
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {tab === "daftar" ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <button
            type="button"
            onClick={() => setTab(tab === "daftar" ? "masuk" : "daftar")}
            className="font-semibold text-primary"
          >
            {tab === "daftar" ? "Masuk di sini" : "Daftar di sini"}
          </button>
        </p>

        {/* Trust badges */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-3">
            <span className="grid size-9 place-items-center rounded-xl bg-success-soft text-success">
              <ShieldCheck className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="text-xs font-bold">Higiene</p>
              <p className="text-[11px] text-muted-foreground">Terjamin</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-3">
            <span className="grid size-9 place-items-center rounded-xl bg-success-soft text-success">
              <Leaf className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="text-xs font-bold">Gizi</p>
              <p className="text-[11px] text-muted-foreground">Seimbang</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
