import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AssetBalance, StakingAsset, StorageCtx } from "@darwinia/app-types";
import { useWallet } from "./walletProvider";
import { WsProvider, ApiPromise } from "@polkadot/api";
import { FrameSystemAccountInfo } from "@darwinia/api-derive/accounts/types";
import useLedger from "./hooks/useLedger";
import BigNumber from "bignumber.js";
import useCollators from "./hooks/useCollators";
import { keyring } from "@polkadot/ui-keyring";

const initialState: StorageCtx = {
  migrationAssetDistribution: undefined,
  isLoadingLedger: undefined,
};

export type UnSubscription = () => void;

const StorageContext = createContext(initialState);

export const StorageProvider = ({ children }: PropsWithChildren) => {
  const { selectedNetwork, selectedAccount } = useWallet();
  const [apiPromise, setApiPromise] = useState<ApiPromise>();
  const [balance, setBalance] = useState<AssetBalance>({
    kton: BigNumber(0),
    ring: BigNumber(0),
  });

  const {
    stakingAsset,
    isLoadingLedger,
    deposits,
    stakedDepositsIds,
    stakedAssetDistribution: migrationAssetDistribution,
    ktonBalance,
  } = useLedger({
    apiPromise,
    selectedAccount: selectedAccount?.address,
  });

  const isKeyringInitialized = useRef<boolean>(false);

  useEffect(() => {
    setBalance((old) => {
      return {
        ...old,
        kton: ktonBalance,
      };
    });
  }, [ktonBalance]);

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

  const { collators } = useCollators(apiPromise);

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

  /*Monitor account balance*/
  useEffect(() => {
    let unsubscription: UnSubscription | undefined;
    const getBalance = async () => {
      if (!selectedAccount || !apiPromise) {
        return;
      }
      try {
        const res = await apiPromise?.query.system.account(selectedAccount, (accountInfo: FrameSystemAccountInfo) => {
          setBalance((old) => {
            return {
              ...old,
              ring: BigNumber(accountInfo.data.free.toString()),
            };
          });
        });
        unsubscription = res as unknown as UnSubscription;
      } catch (e) {
        // ignore
      }
    };

    getBalance().catch(() => {
      //do nothing
    });

    return () => {
      if (unsubscription) {
        unsubscription();
      }
    };
  }, [apiPromise, selectedAccount]);

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
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => useContext(StorageContext);
