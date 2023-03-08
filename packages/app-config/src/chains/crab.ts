import { ChainConfig } from "@darwinia/app-types";

export const crab: ChainConfig = {
  name: "Crab",
  displayName: "Crab",
  kton: {
    address: "0x0000000000000000000000000000000000000402",
    symbol: "CKTON",
    decimals: 9,
  },
  ring: {
    name: "CRAB",
    symbol: "CRAB",
    decimals: 9,
  },
  chainId: 44,
  prefix: 42,
  substrate: {
    graphQlURL: "https://subql.darwinia.network/subql-apps-crab-dev",
    wssURL: "ws://g1.dev.darwinia.network:20000",
  },
};

//Live NET
/*
graphQlURL: "https://subql.darwinia.network/subql-apps-crab/",
wssURL: "wss://crab-rpc.darwinia.network",
* */
