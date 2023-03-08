import { InjectedWindowProvider } from "@polkadot/extension-inject/types";
import type { WalletSource } from "@darwinia/app-types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export declare global {
  interface Window {
    injectedWeb3: Record<WalletSource, InjectedWindowProvider>;
  }
}
