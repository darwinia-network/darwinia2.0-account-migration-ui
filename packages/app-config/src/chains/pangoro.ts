import { ChainConfig } from "@darwinia/app-types";

export const pangoro: ChainConfig = {
  name: "Pangoro",
  displayName: "Pangoro",
  kton: {
    address: "0x0000000000000000000000000000000000000402",
    symbol: "OKTON",
    name: "OKTON",
    decimals: 9,
  },
  ring: {
    name: "ORING",
    symbol: "ORING",
    decimals: 9,
  },
  chainId: 43,
  substrate: {
    graphQlURL: "https://api.subquery.network/sq/isunaslabs/pangolin2",
    wssURL: "ws://g1.dev.darwinia.network:20000",
    httpsURL: "https://pangolin-rpc.darwinia.network",
  },
};
