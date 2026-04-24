import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { User, LogOut, LogIn, Heart, MapPin, Bell, HelpCircle, ChevronRight } from "lucide-react";
import { u as useAuth } from "./router-VI3ubcTf.js";
import { B as BottomNav } from "./BottomNav-WJ5dXbLh.js";
import { toast } from "sonner";
import "react";
import "@supabase/supabase-js";
import "./utils-FX9JXj3v.js";
import "clsx";
import "tailwind-merge";
const menuItems = [{
  icon: Heart,
  label: "Menu Favorit"
}, {
  icon: MapPin,
  label: "Alamat Pengiriman"
}, {
  icon: Bell,
  label: "Notifikasi"
}, {
  icon: HelpCircle,
  label: "Bantuan"
}];
function ProfilePage() {
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Berhasil keluar");
      navigate({
        to: "/"
      });
    } catch (err) {
      toast.error("Gagal keluar");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pb-28", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-border bg-background px-4 py-4", children: /* @__PURE__ */ jsx("h1", { className: "font-display text-xl font-bold", children: "Profil" }) }),
    /* @__PURE__ */ jsx("section", { className: "px-4 pt-5", children: /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-border bg-surface p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "grid size-14 place-items-center rounded-full bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(User, { className: "size-7" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: user ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("p", { className: "font-display text-base font-bold", children: user.name }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: user.phone })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("p", { className: "font-display text-base font-bold", children: "Tamu" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Masuk untuk pengalaman lebih lengkap" })
      ] }) }),
      user ? /* @__PURE__ */ jsxs("button", { type: "button", onClick: handleLogout, className: "inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive", children: [
        /* @__PURE__ */ jsx(LogOut, { className: "size-3.5" }),
        " Keluar"
      ] }) : /* @__PURE__ */ jsxs(Link, { to: "/auth", className: "inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground", children: [
        /* @__PURE__ */ jsx(LogIn, { className: "size-3.5" }),
        " Masuk"
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "px-4 pt-4", children: /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface", children: menuItems.map(({
      icon: Icon,
      label
    }) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", { type: "button", className: "flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/50", children: [
      /* @__PURE__ */ jsx("span", { className: "grid size-9 place-items-center rounded-xl bg-primary-soft text-primary", children: /* @__PURE__ */ jsx(Icon, { className: "size-4" }) }),
      /* @__PURE__ */ jsx("span", { className: "flex-1 text-sm font-medium", children: label }),
      /* @__PURE__ */ jsx(ChevronRight, { className: "size-4 text-muted-foreground" })
    ] }) }, label)) }) }),
    /* @__PURE__ */ jsx("p", { className: "mt-8 text-center text-[11px] text-muted-foreground", children: "Sekotak Bekal v1.0 · Dibuat dengan ♥" }),
    /* @__PURE__ */ jsx(BottomNav, {})
  ] });
}
export {
  ProfilePage as component
};
