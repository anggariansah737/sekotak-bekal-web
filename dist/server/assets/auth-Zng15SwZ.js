import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useState, useEffect } from "react";
import { EyeOff, Eye, ArrowRight, ShieldCheck, Leaf } from "lucide-react";
import { c as cn } from "./utils-FX9JXj3v.js";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { toast } from "sonner";
import { u as useAuth } from "./router-VI3ubcTf.js";
import "clsx";
import "tailwind-merge";
import "@supabase/supabase-js";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
const authHero = "/assets/auth-hero-CpI7CDuG.jpg";
function AuthPage() {
  const navigate = useNavigate();
  const {
    register,
    login,
    user
  } = useAuth();
  const [tab, setTab] = useState("daftar");
  const [showPwd, setShowPwd] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user) navigate({
      to: "/"
    });
  }, [user, navigate]);
  const onSubmit = async (e) => {
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
      navigate({
        to: "/"
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background pb-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative h-56 w-full overflow-hidden bg-accent", children: [
      /* @__PURE__ */ jsx("img", { src: authHero, alt: "Mangkuk sayur sehat", className: "h-full w-full object-cover" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-transparent via-background/0 to-background" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "-mt-6 px-5", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto flex w-full rounded-full bg-muted p-1", children: ["daftar", "masuk"].map((t) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setTab(t), className: cn("flex-1 rounded-full py-2 text-sm font-semibold capitalize transition-all", tab === t ? "bg-surface text-primary shadow-sm" : "text-muted-foreground"), children: t }, t)) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl font-bold", children: tab === "daftar" ? "Buat Akun" : "Selamat Datang Kembali" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: tab === "daftar" ? "Daftar untuk pesan menu sehat harian dengan mudah" : "Masuk untuk lanjut memesan favoritmu" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit, className: "mt-6 space-y-4", children: [
        tab === "daftar" && /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nama Lengkap" }),
          /* @__PURE__ */ jsx(Input, { id: "name", placeholder: "Mis. Sari Wulandari", required: true, value: name, onChange: (e) => setName(e.target.value), className: "h-11 rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "wa", children: "Nomor WhatsApp" }),
          /* @__PURE__ */ jsx(Input, { id: "wa", type: "tel", placeholder: "08xxxxxxxxxx", required: true, value: phone, onChange: (e) => setPhone(e.target.value), className: "h-11 rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "pwd", children: "Password" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Input, { id: "pwd", type: showPwd ? "text" : "password", placeholder: "Minimal 6 karakter", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), className: "h-11 rounded-xl pr-10" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowPwd((s) => !s), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground", "aria-label": "Tampilkan password", children: showPwd ? /* @__PURE__ */ jsx(EyeOff, { className: "size-4" }) : /* @__PURE__ */ jsx(Eye, { className: "size-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "submit", disabled: loading, className: "mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md shadow-primary/30 active:scale-[0.98] disabled:opacity-50", children: [
          loading ? "Sedang memproses..." : tab === "daftar" ? "Daftar Sekarang" : "Masuk",
          /* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-4 text-center text-xs text-muted-foreground", children: [
        tab === "daftar" ? "Sudah punya akun?" : "Belum punya akun?",
        " ",
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setTab(tab === "daftar" ? "masuk" : "daftar"), className: "font-semibold text-primary", children: tab === "daftar" ? "Masuk di sini" : "Daftar di sini" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-2xl border border-border bg-surface p-3", children: [
          /* @__PURE__ */ jsx("span", { className: "grid size-9 place-items-center rounded-xl bg-success-soft text-success", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "size-5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold", children: "Higiene" }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: "Terjamin" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-2xl border border-border bg-surface p-3", children: [
          /* @__PURE__ */ jsx("span", { className: "grid size-9 place-items-center rounded-xl bg-success-soft text-success", children: /* @__PURE__ */ jsx(Leaf, { className: "size-5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold", children: "Gizi" }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: "Seimbang" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  AuthPage as component
};
