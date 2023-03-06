import { ChainConfig } from "@darwinia/app-types";

export const pangolin: ChainConfig = {
  name: "Pangolin",
  displayName: "Pangolin",
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
  prefix: 42,
  substrate: {
    graphQlURL: "https://subql.darwinia.network/subql-apps-pangolin",
    wssURL: "wss://pangolin-rpc.darwinia.network/",
  },
};
