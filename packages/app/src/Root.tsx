import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { notification, Spinner } from "@darwinia/ui";
import { useWallet } from "@darwinia/app-providers";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getStore, setStore } from "@darwinia/app-utils";
import { localeKeys, useAppTranslation } from "@darwinia/app-locale";

const Root = () => {
  const {
    isRequestingWalletConnection,
    error,
    connectWallet,
    isWalletConnected,
    selectedNetwork,
    isLoadingTransaction,
    walletConfig,
    setMultisig,
  } = useWallet();
  const [loading, setLoading] = useState<boolean | undefined>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useAppTranslation();

  useEffect(() => {
    setLoading(isRequestingWalletConnection || isLoadingTransaction);
  }, [isRequestingWalletConnection, isWalletConnected, isLoadingTransaction]);

  const redirect = useCallback(() => {
    setStore("isConnectedToWallet", true);
    if (location.pathname === "/") {
      if (setMultisig) {
        setMultisig(false);
      }
      navigate(`/migration${location.search}`, { replace: true });
      return;
    }

    if (location.pathname === "/multisig-home") {
      if (setMultisig) {
        setMultisig(true);
      }
      navigate(`/multisig-migration${location.search}`, { replace: true });
      return;
    }

    /* only navigate if the user is supposed to be redirected to another URL */
    if (location.state && location.state.from) {
      const nextPath = location.state.from.pathname ? location.state.from.pathname : "/migration";
      navigate(`${nextPath}${location.search}`, { replace: true });
    }
  }, [location, navigate, setMultisig]);

  /*Monitor wallet connection and redirect to the required location */
  useEffect(() => {
    if (isWalletConnected) {
      redirect();
    } else {
      // the wallet isn't connected
      if (location.pathname === "/") {
        if (setMultisig) {
          setMultisig(false);
        }
      } else if (location.pathname === "/multisig-home") {
        if (setMultisig) {
          setMultisig(true);
        }
      }
    }
  }, [isWalletConnected, location]);

  useEffect(() => {
    if (error) {
      switch (error.code) {
        case 1: {
          /*The user has not installed the wallet*/
          notification.error({
            message: (
              <div
                dangerouslySetInnerHTML={{
                  __html: t(localeKeys.installWalletReminder, {
                    walletName: walletConfig?.name,
                    downloadURL: walletConfig?.extensions[0].downloadURL,
                  }),
                }}
              />
            ),
            duration: 10000,
          });
          break;
        }
        default: {
          notification.error({
            message: <div>{error.message}</div>,
          });
        }
      }
    }
  }, [error, walletConfig]);

  //check if it should auto connect to wallet or wait for the user to click the connect wallet button
  useEffect(() => {
    const shouldAutoConnect = getStore<boolean>("isConnectedToWallet");
    if (shouldAutoConnect) {
      connectWallet();
    }
  }, [selectedNetwork]);

  return (
    <Spinner isLoading={!!loading} maskClassName={"!fixed !z-[99]"}>
      <div className={"w-full"}>
        <Header />
        <div className={"flex flex-col min-h-screen justify-center flex-1 pt-[80px] lg:pt-[90px]"}>
          {/*apply padding*/}
          <div className={"flex flex-1 flex-col wrapper-padding items-center"}>
            {/*apply max-width*/}
            <div className={"flex flex-col flex-1 app-container w-full"}>
              <Outlet />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </Spinner>
  );
};

export default Root;
