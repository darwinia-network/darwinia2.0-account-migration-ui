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
    wssURL: "ws://g1.dev.darwinia.network:20000",
    httpsURL: "https://pangolin-rpc.darwinia.network",
  },
};
