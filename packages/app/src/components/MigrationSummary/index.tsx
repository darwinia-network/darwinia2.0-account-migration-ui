import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import { useStorage, useWallet } from "@darwinia/app-providers";
import ringIcon from "../../assets/images/ring.svg";
import ktonIcon from "../../assets/images/kton.svg";
import crabIcon from "../../assets/images/crab.svg";
import cktonIcon from "../../assets/images/ckton.svg";
import helpIcon from "../../assets/images/help.svg";
import { Tooltip } from "@darwinia/ui";
import { prettifyNumber, prettifyTooltipNumber } from "@darwinia/app-utils";
import BigNumber from "bignumber.js";
import { useEffect } from "react";

interface Props {
  isCheckingMigrationStatus: boolean;
}

const MigrationSummary = ({ isCheckingMigrationStatus }: Props) => {
  const { t } = useAppTranslation();
  const { selectedNetwork, setTransactionStatus } = useWallet();
  const { migrationAssetDistribution, isLoadingLedger } = useStorage();

  useEffect(() => {
    setTransactionStatus(!!isLoadingLedger || isCheckingMigrationStatus);
  }, [isLoadingLedger, isCheckingMigrationStatus]);

  const ringTokenIcon = selectedNetwork?.name === "Crab" ? crabIcon : ringIcon;
  const ktonTokenIcon = selectedNetwork?.name === "Crab" ? cktonIcon : ktonIcon;

  return (
    <div className={"card flex gap-[20px] flex-col"}>
      <div className={"flex flex-col lg:flex-row gap-[20px]"}>
        <div className={"card bg-black flex-1 flex gap-[20px] flex-col"}>
          <div className={"flex pb-[20px] divider border-b"}>
            <div className={"flex flex-1 gap-[5px] justify-between items-center"}>
              <div className={"flex items-center gap-[5px]"}>
                <img className={"w-[30px] shrink-0"} src={ringTokenIcon} alt={"image"} />
                <div className={"text-18-bold"}>{selectedNetwork?.ring.symbol.toUpperCase()}</div>
              </div>
            </div>
          </div>
          <div className={"text-halfWhite text-12 flex flex-col gap-[10px]"}>
            <div className={"flex justify-between"}>
              <div>{t(localeKeys.transferable)}</div>
              <div>
                <Tooltip
                  message={
                    <div>{prettifyTooltipNumber(migrationAssetDistribution?.ring.transferable ?? BigNumber(0))}</div>
                  }
                >
                  {prettifyNumber({
                    number: migrationAssetDistribution?.ring.transferable ?? BigNumber(0),
                  })}
                </Tooltip>
              </div>
            </div>
            <div className={"flex justify-between"}>
              <div>{t(localeKeys.deposit)}</div>
              <div>
                <Tooltip
                  message={<div>{prettifyTooltipNumber(migrationAssetDistribution?.ring.deposit ?? BigNumber(0))}</div>}
                >
                  {prettifyNumber({
                    number: migrationAssetDistribution?.ring.deposit ?? BigNumber(0),
                  })}
                </Tooltip>
              </div>
            </div>
            <div className={"flex justify-between"}>
              <div>{t(localeKeys.bonded)}</div>
              <div>
                <Tooltip
                  message={<div>{prettifyTooltipNumber(migrationAssetDistribution?.ring.bonded ?? BigNumber(0))}</div>}
                >
                  {prettifyNumber({
                    number: migrationAssetDistribution?.ring.bonded ?? BigNumber(0),
                  })}
                </Tooltip>
              </div>
            </div>
            <div className={"flex justify-between"}>
              <div>{t(localeKeys.unbonded)}</div>
              <div>
                <Tooltip
                  message={
                    <div>{prettifyTooltipNumber(migrationAssetDistribution?.ring.unbonded ?? BigNumber(0))}</div>
                  }
                >
                  {prettifyNumber({
                    number: migrationAssetDistribution?.ring.unbonded ?? BigNumber(0),
                  })}
                </Tooltip>
              </div>
            </div>
            <div className={"flex justify-between"}>
              <div className={"flex items-center gap-[5px]"}>
                <div>{t(localeKeys.unbonding)}</div>
                <Tooltip message={<div>Ubonding Message</div>}>
                  <img className={"w-[11px]"} src={helpIcon} alt="image" />
                </Tooltip>
              </div>
              <div>
                <Tooltip
                  message={
                    <div>{prettifyTooltipNumber(migrationAssetDistribution?.ring.unbonding ?? BigNumber(0))}</div>
                  }
                >
                  {prettifyNumber({
                    number: migrationAssetDistribution?.ring.unbonding ?? BigNumber(0),
                  })}
                </Tooltip>
              </div>
            </div>
            <div className={"flex justify-between"}>
              <div className={"flex items-center gap-[5px]"}>
                <div>{t(localeKeys.vested)}</div>
                <Tooltip message={<div>Vested Message</div>}>
                  <img className={"w-[11px]"} src={helpIcon} alt="image" />
                </Tooltip>
              </div>
              <div>
                <Tooltip
                  message={<div>{prettifyTooltipNumber(migrationAssetDistribution?.ring.vested ?? BigNumber(0))}</div>}
                >
                  {prettifyNumber({
                    number: migrationAssetDistribution?.ring.vested ?? BigNumber(0),
                  })}
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        <div className={"card bg-black flex-1 flex gap-[20px] flex-col"}>
          <div className={"flex pb-[20px] divider border-b"}>
            <div className={"flex flex-1 gap-[5px] justify-between items-center"}>
              <div className={"flex items-center gap-[5px]"}>
                <img className={"w-[30px] shrink-0"} src={ktonTokenIcon} alt={"image"} />
                <div className={"text-18-bold"}>{selectedNetwork?.kton.symbol.toUpperCase()}</div>
              </div>
            </div>
          </div>
          <div className={"text-halfWhite text-12 flex flex-col gap-[10px]"}>
            <div className={"flex justify-between"}>
              <div>{t(localeKeys.transferable)}</div>
              <div>
                <Tooltip
                  message={
                    <div>{prettifyTooltipNumber(migrationAssetDistribution?.kton.transferable ?? BigNumber(0))}</div>
                  }
                >
                  {prettifyNumber({
                    number: migrationAssetDistribution?.kton.transferable ?? BigNumber(0),
                  })}
                </Tooltip>
              </div>
            </div>
            <div className={"flex justify-between"}>
              <div>{t(localeKeys.bonded)}</div>
              <div>
                <Tooltip
                  message={<div>{prettifyTooltipNumber(migrationAssetDistribution?.kton.bonded ?? BigNumber(0))}</div>}
                >
                  {prettifyNumber({
                    number: migrationAssetDistribution?.kton.bonded ?? BigNumber(0),
                  })}
                </Tooltip>
              </div>
            </div>
            <div className={"flex justify-between"}>
              <div>{t(localeKeys.unbonded)}</div>
              <div>
                <Tooltip
                  message={
                    <div>{prettifyTooltipNumber(migrationAssetDistribution?.kton.unbonded ?? BigNumber(0))}</div>
                  }
                >
                  {prettifyNumber({
                    number: migrationAssetDistribution?.kton.unbonded ?? BigNumber(0),
                  })}
                </Tooltip>
              </div>
            </div>
            <div className={"flex justify-between"}>
              <div className={"flex items-center gap-[5px]"}>
                <div>{t(localeKeys.unbonding)}</div>
                <Tooltip message={<div>Ubonding Message</div>}>
                  <img className={"w-[11px]"} src={helpIcon} alt="image" />
                </Tooltip>
              </div>
              <div>
                <Tooltip
                  message={
                    <div>{prettifyTooltipNumber(migrationAssetDistribution?.kton.unbonding ?? BigNumber(0))}</div>
                  }
                >
                  {prettifyNumber({
                    number: migrationAssetDistribution?.kton.unbonding ?? BigNumber(0),
                  })}
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={"text-12"}>{t(localeKeys.migrationSummaryInfo)}</div>
    </div>
  );
};

export default MigrationSummary;
