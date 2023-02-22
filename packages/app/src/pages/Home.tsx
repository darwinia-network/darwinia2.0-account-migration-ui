import polkadotLogo from "../assets/images/polkadot.png";
import { Button } from "@darwinia/ui";
import { useAppTranslation, localeKeys } from "@darwinia/app-locale";
import { useWallet } from "@darwinia/app-providers";
import migrationIcon from "../assets/images/migration.svg";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const { t } = useAppTranslation();
  const { connectWallet, selectedNetwork } = useWallet();
  const { search: urlParams } = useLocation();

  return (
    <div className={"flex flex-1 flex-col gap-[20px]"}>
      <div className={"flex flex-col gap-[20px]"}>
        <div className={"flex gap-[20px] items-center"}>
          <img className={"w-[40px]"} src={migrationIcon} alt="migration" />
          <div className={"text-24-bold"} dangerouslySetInnerHTML={{ __html: t(localeKeys.accountMigrationTitle) }} />
        </div>
        <div
          className={"text-12-bold leading-[24px]"}
          dangerouslySetInnerHTML={{
            __html: t(localeKeys.accountMigrationInfo, {
              ringSymbol: selectedNetwork?.ring.symbol,
              ktonSymbol: selectedNetwork?.kton.symbol,
              multisigLink: `/#/multisig-home${urlParams}`,
            }),
          }}
        />
      </div>
      <div className={"flex flex-col flex-1 bg-blackSecondary items-center justify-center"}>
        <div className={"flex flex-col gap-[20px] items-center max-w-[550px]"}>
          <img className={"w-[65px]"} src={polkadotLogo} alt="image" />
          <Button
            onClick={() => {
              connectWallet();
            }}
          >
            {t(localeKeys.connectWallet)}
            <span>{" >"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
