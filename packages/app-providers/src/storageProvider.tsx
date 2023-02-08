import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { StorageCtx } from "@darwinia/app-types";
import { useWallet } from "./walletProvider";
import { WsProvider, ApiPromise } from "@polkadot/api";
import useLedger from "./hooks/useLedger";
import { keyring } from "@polkadot/ui-keyring";

const initialState: StorageCtx = {
  migrationAssetDistribution: undefined,
  isLoadingLedger: undefined,
  isLoadingMigratedLedger: false,
  retrieveMigratedAsset: (sourceAccountId: string, parentBlockHash: string) => {
    //ignore
  },
  migratedAssetDistribution: undefined,
};

export type UnSubscription = () => void;

const StorageContext = createContext(initialState);

export const StorageProvider = ({ children }: PropsWithChildren) => {
  const { selectedNetwork, selectedAccount } = useWallet();
  const [apiPromise, setApiPromise] = useState<ApiPromise>();

  const {
    isLoadingLedger,
    stakedAssetDistribution: migrationAssetDistribution,
    isLoadingMigratedLedger,
    retrieveMigratedAsset,
    migratedAssetDistribution,
  } = useLedger({
    apiPromise,
    selectedAccount: selectedAccount?.address,
  });

  const isKeyringInitialized = useRef<boolean>(false);

  /* This will help us to extract pretty names from the chain test accounts such as Alith,etc */
  useEffect(() => {
    try {
      if (selectedNetwork && !isKeyringInitialized.current) {
        isKeyringInitialized.current = true;
        keyring.loadAll({
          type: "ethereum",
          isDevelopment: selectedNetwork?.name === "Pangolin",
        });
      }
    } catch (e) {
      //ignore
    }
  }, [selectedNetwork]);

  const initStorageNetwork = async (rpcURL: string) => {
    try {
      const provider = new WsProvider(rpcURL);
      const api = new ApiPromise({
        provider,
      });

      api.on("connected", async () => {
        const readyAPI = await api.isReady;
        setApiPromise(readyAPI);
      });
      api.on("disconnected", () => {
        // console.log("disconnected");
      });
      api.on("error", () => {
        // console.log("error");
      });
    } catch (e) {
      //ignore
    }
  };

  useEffect(() => {
    if (!selectedNetwork) {
      return;
    }
    initStorageNetwork(selectedNetwork.substrate.wssURL);
  }, [selectedNetwork]);

  return (
    <StorageContext.Provider
      value={{
        migrationAssetDistribution,
        isLoadingLedger,
        isLoadingMigratedLedger,
        retrieveMigratedAsset,
        migratedAssetDistribution,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => useContext(StorageContext);
