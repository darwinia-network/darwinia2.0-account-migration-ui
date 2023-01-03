import { InjectedWindowProvider } from "@polkadot/extension-inject/types";

export interface Ethereum {
  isEthereum: boolean;
  request: <T>(requestParams: { method: string; params?: unknown }) => Promise<T>;
  on: <T = unknown>(event: string, callback: (data: T) => void) => void;
  removeListener: <T = unknown>(event: string, callback: (data: T) => void) => void;
}

interface InjectedWallet {
  [key: string]: InjectedWindowProvider;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export declare global {
  interface Window {
    ethereum: Ethereum;
    injectedWeb3: InjectedWallet;
  }
}
