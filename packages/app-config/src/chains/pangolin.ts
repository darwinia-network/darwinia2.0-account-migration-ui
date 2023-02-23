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
  substrate: {
    graphQlURL: "https://api.subquery.network/sq/isunaslabs/pangolin2",
    wssURL: "wss://pangolin-rpc.darwinia.network/",
    httpsURL: "https://pangolin-rpc.darwinia.network",
  },
};
