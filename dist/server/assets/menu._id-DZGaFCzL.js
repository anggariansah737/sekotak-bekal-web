import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
const SplitNotFoundComponent = () => /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center px-4 text-center", children: /* @__PURE__ */ jsxs("div", { children: [
  /* @__PURE__ */ jsx("h1", { className: "font-display text-xl font-bold", children: "Menu tidak ditemukan" }),
  /* @__PURE__ */ jsx(Link, { to: "/", className: "mt-4 inline-block text-primary underline", children: "Kembali ke beranda" })
] }) });
export {
  SplitNotFoundComponent as notFoundComponent
};
