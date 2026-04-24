import { jsx, jsxs } from "react/jsx-runtime";
import { useRouter } from "@tanstack/react-router";
const SplitErrorComponent = ({
  error,
  reset
}) => {
  const router = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center px-4 text-center", children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { className: "font-display text-xl font-bold", children: "Terjadi kesalahan" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsx("button", { onClick: () => {
      router.invalidate();
      reset();
    }, className: "mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground", children: "Coba lagi" })
  ] }) });
};
export {
  SplitErrorComponent as errorComponent
};
