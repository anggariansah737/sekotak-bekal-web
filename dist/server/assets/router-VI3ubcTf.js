import { jsx, jsxs } from "react/jsx-runtime";
import { createRootRoute, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter, useRouter } from "@tanstack/react-router";
import { Toaster as Toaster$1 } from "sonner";
import { useState, useEffect, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const supabaseUrl = "https://foicodenxgbbgwgnrkez.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvaWNvZGVueGdiYmd3Z25ya2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NzY1MDMsImV4cCI6MjA2MTA1MjUwM30.JBxodaj49EykDUkSi4FqIgKBi0niQcoI2UEqbfMaDOM";
const supabase = createClient(supabaseUrl, supabaseKey);
function formatPhone(phone) {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "62" + cleaned.slice(1);
  else if (!cleaned.startsWith("62")) cleaned = "62" + cleaned;
  return cleaned;
}
const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkSession = async () => {
      const savedUserId = localStorage.getItem("sekotak_user_id");
      if (savedUserId) {
        const { data: customer } = await supabase.from("customers").select("*").eq("id", savedUserId).single();
        setUser(customer || null);
      }
      setLoading(false);
    };
    checkSession();
  }, []);
  const register = async (name, phone, password) => {
    const normalizedPhone = formatPhone(phone);
    const { data: existing } = await supabase.from("customers").select("id").eq("phone", normalizedPhone).single();
    if (existing) {
      throw new Error("Nomor HP sudah terdaftar");
    }
    const passwordHash = await hashPassword(password);
    const customerId = crypto.randomUUID();
    const { data: newCustomer, error } = await supabase.from("customers").insert([
      {
        id: customerId,
        name,
        phone: normalizedPhone,
        password_hash: passwordHash
      }
    ]).select().single();
    if (error) throw error;
    localStorage.setItem("sekotak_user_id", newCustomer.id);
    setUser(newCustomer);
  };
  const login = async (phone, password) => {
    const normalizedPhone = formatPhone(phone);
    const { data: customer, error } = await supabase.from("customers").select("*").eq("phone", normalizedPhone).single();
    if (error || !customer) {
      throw new Error("Nomor HP tidak ditemukan");
    }
    const isValid = await verifyPassword(
      password,
      customer.password_hash || ""
    );
    if (!isValid) {
      throw new Error("Password salah");
    }
    localStorage.setItem("sekotak_user_id", customer.id);
    setUser(customer);
  };
  const logout = async () => {
    localStorage.removeItem("sekotak_user_id");
    setUser(null);
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value: { user, loading, register, login, logout }, children });
}
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function verifyPassword(password, hash) {
  const newHash = await hashPassword(password);
  return newHash === hash;
}
const appCss = "/assets/styles-Cb-5LHoY.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Halaman tidak ditemukan" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Halaman yang kamu cari tidak ada atau sudah dipindahkan." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Kembali ke Menu"
      }
    ) })
  ] }) });
}
const Route$6 = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=1"
      },
      { title: "Sekotak Bekal — Catering Sehat Harian" },
      {
        name: "description",
        content: "Sekotak Bekal: aplikasi catering sehat dengan menu harian segar, gizi seimbang, dan pengantaran tepat waktu."
      },
      { name: "author", content: "Sekotak Bekal" },
      {
        property: "og:title",
        content: "Sekotak Bekal — Catering Sehat Harian"
      },
      {
        property: "og:description",
        content: "Pesan menu sehat harian dengan mudah lewat aplikasi Sekotak Bekal."
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "id", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  return /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto min-h-screen w-full max-w-[480px] bg-background shadow-xl", children: [
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(Toaster, { position: "top-center", richColors: true })
  ] }) }) });
}
const $$splitComponentImporter$5 = () => import("./profile-LlJCiawH.js");
const Route$5 = createFileRoute("/profile")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component"),
  head: () => ({
    meta: [{
      title: "Profil — Sekotak Bekal"
    }]
  })
});
const $$splitComponentImporter$4 = () => import("./orders-CO5thLWG.js");
const Route$4 = createFileRoute("/orders")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component"),
  head: () => ({
    meta: [{
      title: "Pesanan — Sekotak Bekal"
    }]
  })
});
const $$splitComponentImporter$3 = () => import("./cart-DXYinDuW.js");
const Route$3 = createFileRoute("/cart")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component"),
  head: () => ({
    meta: [{
      title: "Keranjang Pesanan — Sekotak Bekal"
    }]
  })
});
const $$splitComponentImporter$2 = () => import("./auth-Zng15SwZ.js");
const Route$2 = createFileRoute("/auth")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
  head: () => ({
    meta: [{
      title: "Daftar / Masuk — Sekotak Bekal"
    }]
  })
});
const $$splitComponentImporter$1 = () => import("./index-Dmh0M7O8.js");
const Route$1 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitErrorComponentImporter = () => import("./menu._id-0eY45Rcq.js");
const $$splitNotFoundComponentImporter = () => import("./menu._id-DZGaFCzL.js");
const $$splitComponentImporter = () => import("./menu._id-By-9Plwp.js");
const Route = createFileRoute("/menu/$id")({
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
const ProfileRoute = Route$5.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$6
});
const OrdersRoute = Route$4.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => Route$6
});
const CartRoute = Route$3.update({
  id: "/cart",
  path: "/cart",
  getParentRoute: () => Route$6
});
const AuthRoute = Route$2.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$6
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$6
});
const MenuIdRoute = Route.update({
  id: "/menu/$id",
  path: "/menu/$id",
  getParentRoute: () => Route$6
});
const rootRouteChildren = {
  IndexRoute,
  AuthRoute,
  CartRoute,
  OrdersRoute,
  ProfileRoute,
  MenuIdRoute
};
const routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({
  error,
  reset
}) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route as R,
  router as r,
  supabase as s,
  useAuth as u
};
