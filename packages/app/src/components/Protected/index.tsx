import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useWallet } from "@darwinia/app-providers";

const Protected = ({ children }: PropsWithChildren) => {
  const { isWalletConnected, isRequestingWalletConnection } = useWallet();
  const location = useLocation();
  //if the user isn't connected to the wallet, redirect to the homepage
  const path = location.pathname.includes("/multisig") ? `/multisig-home` : `/`;
  if (!isWalletConnected && !isRequestingWalletConnection) {
    return <Navigate to={`${path}${location.search}`} replace={true} state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default Protected;
