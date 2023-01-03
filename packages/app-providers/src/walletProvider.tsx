import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react";
import { dAppSupportedWallets } from "@darwinia/app-config";
import {
  ChainConfig,
  WalletCtx,
  WalletError,
  SupportedWallet,
  WalletConfig,
  CustomInjectedAccountWithMeta,
} from "@darwinia/app-types";
import { Contract } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { Signer } from "@polkadot/api/types";
import useAccountPrettyName from "./hooks/useAccountPrettyName";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { keyring } from "@polkadot/ui-keyring";

/*This is just a blueprint, no value will be stored in here*/
const initialState: WalletCtx = {
  provider: undefined,
  signer: undefined,
  isRequestingWalletConnection: false,
  isWalletConnected: false,
  error: undefined,
  selectedAccount: undefined,
  injectedAccounts: undefined,
  depositContract: undefined,
  stakingContract: undefined,
  selectedNetwork: undefined,
  isLoadingTransaction: undefined,
  changeSelectedNetwork: () => {
    // do nothing
  },
  connectWallet: () => {
    //do nothing
  },
  disconnectWallet: () => {
    //do nothing
  },
  forceSetAccountAddress: (address: string) => {
    //do nothing
  },
  setTransactionStatus: (isLoading: boolean) => {
    //do nothing
  },
};

const WalletContext = createContext<WalletCtx>(initialState);

export const WalletProvider = ({ children }: PropsWithChildren) => {
  const [provider, setProvider] = useState<Web3Provider>();
  const [signer, setSigner] = useState<Signer>();
  const [depositContract, setDepositContract] = useState<Contract>();
  const [stakingContract, setStakingContract] = useState<Contract>();
  const [isRequestingWalletConnection, setRequestingWalletConnection] = useState<boolean>(false);
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<CustomInjectedAccountWithMeta>();
  const [injectedAccounts, setInjectedAccounts] = useState<CustomInjectedAccountWithMeta[]>();
  const injectedAccountsRef = useRef<InjectedAccountWithMeta[]>([]);
  const forcedAccountAddress = useRef<string>();
  const [error, setError] = useState<WalletError | undefined>(undefined);
  const [selectedNetwork, setSelectedNetwork] = useState<ChainConfig>();
  const [selectedWallet] = useState<SupportedWallet>("MetaMask");
  const [walletConfig, setWalletConfig] = useState<WalletConfig>();
  const [isLoadingTransaction, setLoadingTransaction] = useState<boolean>(false);
  const [apiPromise, setApiPromise] = useState<ApiPromise>();
  const { getPrettyName } = useAccountPrettyName(apiPromise);
  const DARWINIA_APPS = "darwinia/apps";
  const isKeyringInitialized = useRef<boolean>(false);

  const isWalletInstalled = () => {
    const injectedWallet = window.injectedWeb3;
    return !!(injectedWallet && injectedWallet["polkadot-js"]);
  };

  useEffect(() => {
    const walletConfig = dAppSupportedWallets.find((walletConfig) => walletConfig.name === selectedWallet);
    if (walletConfig) {
      setWalletConfig(walletConfig);
    }
  }, [selectedWallet]);

  /* This will help us to extract pretty names from the chain test accounts such as Alith,etc */
  useEffect(() => {
    try {
      if (selectedNetwork && !isKeyringInitialized.current) {
        isKeyringInitialized.current = true;
        keyring.loadAll({
          type: "sr25519",
          isDevelopment: selectedNetwork?.name === "Pangolin",
        });
      }
    } catch (e) {
      //ignore
    }
  }, [selectedNetwork]);

  const disconnectWallet = useCallback(() => {
    setSelectedAccount(undefined);
    setProvider(undefined);
    setDepositContract(undefined);
    setStakingContract(undefined);
    setWalletConnected(false);
  }, []);

  useEffect(() => {
    const parseAccounts = async () => {
      const customAccounts: CustomInjectedAccountWithMeta[] = [];

      const accounts = injectedAccountsRef.current;
      for (let i = 0; i < accounts.length; i++) {
        const prettyName = await getPrettyName(accounts[i].address);
        customAccounts.push({
          ...accounts[i],
          prettyName,
        });
      }
      if (customAccounts.length > 0) {
        setSelectedAccount(customAccounts[0]);
      }
      setInjectedAccounts(customAccounts);
    };

    parseAccounts().catch(() => {
      //ignore
    });
  }, [injectedAccountsRef.current, apiPromise]);

  /*Connect to MetaMask*/
  const connectWallet = useCallback(async () => {
    if (!selectedNetwork || isRequestingWalletConnection) {
      return;
    }

    try {
      if (!isWalletInstalled()) {
        setError({
          code: 1,
          message: "Please Install Polkadot JS Extension",
        });
        return;
      }
      setWalletConnected(false);
      const provider = new WsProvider(selectedNetwork.substrate.wssURL);
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

      const injectedWallet = window.injectedWeb3;
      const wallet = injectedWallet["polkadot-js"];
      if (!wallet.enable) {
        return;
      }
      const res = await wallet.enable(DARWINIA_APPS);
      if (res) {
        /*web3Enable MUST be called before calling anything related to the Polkadot Extension*/
        const enabledExtensions = await web3Enable("anything you want");

        if (enabledExtensions.length === 0) {
          return;
        }
        /* this is the signer that needs to be used when we sign a transaction */
        setSigner(enabledExtensions[0].signer);
        /* this will return a list of all the accounts that are in the Polkadot extension */
        const accounts = await web3Accounts();
        accounts.forEach((account) => {
          keyring.saveAddress(account.address, account.meta);
        });
        injectedAccountsRef.current = accounts;

        if (accounts.length > 0) {
          /* we default using the first account */
          setWalletConnected(true);
          setRequestingWalletConnection(false);
        }
      }
    } catch (e) {
      //ignore
    }
  }, [isWalletInstalled, selectedNetwork, isRequestingWalletConnection, apiPromise, getPrettyName]);

  const changeSelectedNetwork = useCallback(
    (network: ChainConfig) => {
      setSelectedNetwork(network);
    },
    [selectedNetwork]
  );

  const forceSetAccountAddress = useCallback((accountAddress: string) => {
    forcedAccountAddress.current = accountAddress;
  }, []);

  const setTransactionStatus = useCallback((isLoading: boolean) => {
    setLoadingTransaction(isLoading);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isLoadingTransaction,
        setTransactionStatus,
        disconnectWallet,
        provider,
        isWalletConnected,
        depositContract,
        stakingContract,
        signer,
        selectedAccount,
        injectedAccounts,
        isRequestingWalletConnection,
        connectWallet,
        error,
        changeSelectedNetwork,
        selectedNetwork,
        forceSetAccountAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
