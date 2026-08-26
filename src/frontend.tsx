// 1. Import and set up the Buffer polyfill at the very top
import * as buffer from "buffer";
if (!window.Buffer) {
  window.Buffer = buffer.Buffer;
}

// 2. Your existing imports continue below
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { WalletProvider } from "./context/walletContext";

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <WalletProvider>
      <App />
    </WalletProvider>
  </StrictMode>
);

if (import.meta.hot) {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  // The hot module reloading API is not available in production.
  createRoot(elem).render(app);
}
