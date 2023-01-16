import { ChainConfig } from "@darwinia/app-types";

export const testNet: ChainConfig = {
  name: "Pangolin",
  displayName: "TestNet",
  kton: {
    address: "0x0000000000000000000000000000000000000402",
    symbol: "PKTON",
    decimals: 9,
  },
  ring: {
    name: "PRING",
    symbol: "PRING",
    decimals: 9,
  },
  chainId: 43,
  substrate: {
    graphQlURL: "https://subql.darwinia.network/subql-apps-crab/",
    wssURL: "wss://pangolin-rpc.darwinia.network/",
    httpsURL: "https://pangolin-rpc.darwinia.network",
  },
};
