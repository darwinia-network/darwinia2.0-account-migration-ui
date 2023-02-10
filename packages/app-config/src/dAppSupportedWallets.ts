import polkadotJSExtensionLogo from "./assets/images/polkadot.png";
import { WalletConfig } from "@darwinia/app-types";

export const dAppSupportedWallets: WalletConfig[] = [
  {
    name: "Polkadot JS Extension",
    logo: polkadotJSExtensionLogo,
    extensions: [
      {
        browser: "Chrome",
        downloadURL: "https://polkadot.js.org/extension/",
      },
      {
        browser: "Firefox",
        downloadURL: "https://polkadot.js.org/extension/",
      },
      {
        browser: "Brave",
        downloadURL: "https://polkadot.js.org/extension/",
      },
      {
        browser: "Edge",
        downloadURL: "https://polkadot.js.org/extension/",
      },
      {
        browser: "Opera",
        downloadURL: "https://polkadot.js.org/extension/",
      },
    ],
  },
];
