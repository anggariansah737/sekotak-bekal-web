import { M as useRouter, U as jsxRuntimeExports } from "./worker-entry-CDJnMFZv.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const SplitErrorComponent = ({
  error,
  reset
}) => {
  const router = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center px-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold", children: "Terjadi kesalahan" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
      router.invalidate();
      reset();
    }, className: "mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground", children: "Coba lagi" })
  ] }) });
};
export {
  SplitErrorComponent as errorComponent
};
