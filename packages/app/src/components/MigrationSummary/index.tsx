import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import { useWallet } from "@darwinia/app-providers";
import ringIcon from "../../assets/images/ring.svg";
import ktonIcon from "../../assets/images/kton.svg";
import helpIcon from "../../assets/images/help.svg";
import { Tooltip } from "@darwinia/ui";

const MigrationSummary = () => {
  const { t } = useAppTranslation();
  const { selectedNetwork } = useWallet();
  return (
    <div className={"card flex gap-[20px] flex-col"}>
      <div className={"flex flex-col lg:flex-row gap-[20px]"}>
        <div className={"card bg-black flex-1 flex gap-[20px] flex-col"}>
          <div className={"flex pb-[20px] divider border-b"}>
            <div className={"flex flex-1 gap-[5px] justify-between items-center"}>
              <div className={"flex items-center gap-[5px]"}>
                <img className={"w-[30px] shrink-0"} src={ringIcon} alt={"image"} />
                <div className={"text-18-bold"}>{selectedNetwork?.ring.symbol.toUpperCase()}</div>
              </div>
              <div className={"text-18-bold"}>0</div>
            </div>
          </div>
          <div className={"text-halfWhite text-12 flex flex-col gap-[10px]"}>
            <div className={"flex justify-between"}>
              <div>{t(localeKeys.transferable)}</div>
              <div>0</div>
            </div>
            <div className={"flex justify-between"}>
              <div>{t(localeKeys.locked)}</div>
              <div>0</div>
            </div>
            <div className={"flex justify-between"}>
              <div>{t(localeKeys.bonded)}</div>
              <div>0</div>
            </div>
            <div className={"flex justify-between"}>
              <div>{t(localeKeys.unbonded)}</div>
              <div>0</div>
            </div>
            <div className={"flex justify-between"}>
              <div className={"flex items-center gap-[5px]"}>
                <div>{t(localeKeys.unbonding)}</div>
                <Tooltip message={<div>Ubonding Message</div>}>
                  <img className={"w-[11px]"} src={helpIcon} alt="image" />
                </Tooltip>
              </div>
              <div>0</div>
            </div>
            <div className={"flex justify-between"}>
              <div className={"flex items-center gap-[5px]"}>
                <div>{t(localeKeys.vested)}</div>
                <Tooltip message={<div>Vested Message</div>}>
                  <img className={"w-[11px]"} src={helpIcon} alt="image" />
                </Tooltip>
              </div>
              <div>0</div>
            </div>
          </div>
        </div>
        <div className={"card bg-black flex-1 flex gap-[20px] flex-col"}>
          <div className={"flex pb-[20px] divider border-b"}>
            <div className={"flex flex-1 gap-[5px] justify-between items-center"}>
              <div className={"flex items-center gap-[5px]"}>
                <img className={"w-[30px] shrink-0"} src={ktonIcon} alt={"image"} />
                <div className={"text-18-bold"}>{selectedNetwork?.kton.symbol.toUpperCase()}</div>
              </div>
              <div className={"text-18-bold"}>0</div>
            </div>
          </div>
          <div className={"text-halfWhite text-12 flex flex-col gap-[10px]"}>
            <div className={"flex justify-between"}>
              <div>{t(localeKeys.transferable)}</div>
              <div>0</div>
            </div>
            <div className={"flex justify-between"}>
              <div>{t(localeKeys.bonded)}</div>
              <div>0</div>
            </div>
            <div className={"flex justify-between"}>
              <div>{t(localeKeys.unbonded)}</div>
              <div>0</div>
            </div>
            <div className={"flex justify-between"}>
              <div className={"flex items-center gap-[5px]"}>
                <div>{t(localeKeys.unbonding)}</div>
                <Tooltip message={<div>Ubonding Message</div>}>
                  <img className={"w-[11px]"} src={helpIcon} alt="image" />
                </Tooltip>
              </div>
              <div>0</div>
            </div>
          </div>
        </div>
      </div>
      <div className={"text-12"}>{t(localeKeys.migrationSummaryInfo)}</div>
    </div>
  );
};

export default MigrationSummary;
