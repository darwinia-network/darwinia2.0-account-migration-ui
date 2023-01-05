import { ChainConfig } from "@darwinia/app-types";
import stakingABI from "../abi/testNet/stake.json";
import depositABI from "../abi/testNet/deposit.json";
// import myTest from "../abi/testNet/myTest.json";

export const testNet: ChainConfig = {
  name: "Pangolin",
  displayName: "TestNet",
  explorerURLs: ["https://pangolin.subscan.io/"],
  httpsURLs: ["https://cors.kahub.in/http://g1.dev.darwinia.network:10000"],
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
  contractAddresses: {
    staking: "0x0000000000000000000000000000000000000601",
    deposit: "0x0000000000000000000000000000000000000600",
  },
  contractInterface: {
    staking: stakingABI,
    deposit: depositABI,
  },
  chainId: 43,
  substrate: {
    graphQlURL: "https://subql.darwinia.network/subql-apps-crab/",
    wssURL: "wss://pangolin-rpc.darwinia.network/",
    httpsURL: "https://pangolin-rpc.darwinia.network",
  },
};
