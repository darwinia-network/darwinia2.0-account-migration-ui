import { ChainConfig } from "@darwinia/app-types";

export const darwinia: ChainConfig = {
  name: "Darwinia",
  displayName: "Darwinia",
  kton: {
    address: "0x0000000000000000000000000000000000000402",
    symbol: "KTON",
    decimals: 18,
  },
  ring: {
    name: "RING",
    symbol: "RING",
    decimals: 18,
  },
  chainId: 46,
  prefix: 18,
  substrate: {
    graphQlURL: "https://subql.darwinia.network/subql-apps-darwinia/",
    wssURL: "wss://rpc.darwinia.network",
  },
};
