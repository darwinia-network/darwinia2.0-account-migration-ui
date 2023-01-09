import migrationIcon from "../../assets/images/migration.svg";
import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import successIcon from "../../assets/images/success.svg";
import copyIcon from "../../assets/images/copy.svg";
import clockIcon from "../../assets/images/clock.svg";
import ringIcon from "../../assets/images/ring.svg";
import ktonIcon from "../../assets/images/kton.svg";
import helpIcon from "../../assets/images/help.svg";
import { Tooltip } from "@darwinia/ui";
import { useWallet } from "@darwinia/app-providers";

const MigrationStatus = () => {
  const { t } = useAppTranslation();
  const { selectedNetwork } = useWallet();
  const getRingTooltipMessage = () => {
    return (
      <div className={"flex gap-[10px] text-12 flex-col"}>
        <div>{t(localeKeys.transferable)}: 2,174.973</div>
        <div>{t(localeKeys.locked)}: 0.000</div>
        <div>{t(localeKeys.bonded)}: 0.000</div>
        <div>{t(localeKeys.unbonded)}: 0.000</div>
        <div>{t(localeKeys.unbonding)}: 0.000</div>
        <div>{t(localeKeys.vested)}: 0.000</div>
      </div>
    );
  };

  const getKtonTooltipMessage = () => {
    return (
      <div className={"flex gap-[10px] text-12 flex-col"}>
        <div>{t(localeKeys.transferable)}: 2,174.973</div>
        <div>{t(localeKeys.bonded)}: 0.000</div>
        <div>{t(localeKeys.unbonded)}: 0.000</div>
        <div>{t(localeKeys.unbonding)}: 0.000</div>
      </div>
    );
  };
  return (
    <div className={"flex flex-col gap-[20px]"}>
      <div className={"flex flex-col gap-[20px]"}>
        <div className={"flex gap-[20px] items-center"}>
          <img className={"w-[40px]"} src={migrationIcon} alt="migration" />
          <div className={"text-24-bold"} dangerouslySetInnerHTML={{ __html: t(localeKeys.accountMigrationTitle) }} />
        </div>
        <div className={"text-12-bold leading-[24px]"}>
          <div>{t(localeKeys.accountMigratedSuccessfully)}</div>
          <div
            dangerouslySetInnerHTML={{
              __html: t(localeKeys.whereNextAfterMigration, {
                link: "https://www.baidu.com",
              }),
            }}
          />
        </div>
      </div>
      <div className={"card flex flex-col gap-[10px]"}>
        <div className={"flex justify-between py-[14px]"}>
          <div className={"min-w-[150px] lg:min-w-[200px]"}>{t(localeKeys.status)}</div>
          <div className={"flex-1 flex gap-[10px] items-center"}>
            <img className={"w-[18px] shrink-0"} src={successIcon} alt="image" />
            <div className={"text-success"}>Success</div>
          </div>
        </div>
        <div className={"flex justify-between py-[14px]"}>
          <div className={"min-w-[150px] lg:min-w-[200px]"}>{t(localeKeys.transactionHash)}</div>
          <div className={"flex-1 flex gap-[10px] items-center flex-ellipsis"}>
            <div className={"text-primary text-14-bold"}>
              0x433dd33c63a3f8a4a7f7483fe33b15a7963665d33c1ee60ba70075290d43cc87
            </div>
            <img className={"w-[16px] shrink-0 clickable"} src={copyIcon} alt="image" />
          </div>
        </div>
        <div className={"flex justify-between py-[14px] divider "}>
          <div className={"min-w-[150px] lg:min-w-[200px]"}>{t(localeKeys.timestamp)}</div>
          <div className={"flex-1 flex gap-[10px] items-center flex-ellipsis"}>
            <img className={"w-[18px] shrink-0"} src={clockIcon} alt="image" />
            <div>1 hrs 23 mins ago (Mar-24-2022 09:23:14 AM +UTC)</div>
          </div>
        </div>

        <div className={"divider border-b"} />

        <div className={"flex justify-between py-[14px]"}>
          <div className={"min-w-[150px] lg:min-w-[200px]"}>{t(localeKeys.migrateFrom)}</div>
          <div className={"flex-1 flex gap-[10px] items-center flex-ellipsis text-primary text-14-bold"}>
            <div>2tJaxND51vBbPwUDHuhVzndY4MeohvvHvn3D9uDejYNin73S </div>
          </div>
        </div>
        <div className={"flex justify-between py-[14px]"}>
          <div className={"min-w-[150px] lg:min-w-[200px]"}>{t(localeKeys.migrateTo)}</div>
          <div className={"flex-1 flex gap-[10px] items-center flex-ellipsis text-primary text-14-bold"}>
            <div>0xcb515340b4889807de6bb15403e9403680dc7302</div>
          </div>
        </div>

        <div className={"flex justify-between py-[14px]"}>
          <div className={"min-w-[150px] lg:min-w-[200px]"}>{t(localeKeys.value)}</div>
          <div className={"flex-1 flex flex-col gap-[10px] flex-ellipsis"}>
            <div className={"flex gap-[10px] items-center"}>
              <img className={"w-[18px] shrink-0"} src={ringIcon} alt="image" />
              <div>16,331.629 {selectedNetwork?.ring.symbol.toUpperCase()}</div>
              <Tooltip className={"shrink-0"} message={getRingTooltipMessage()}>
                <img className={"w-[16px] shrink-0 clickable"} src={helpIcon} alt="image" />
              </Tooltip>
            </div>
            <div className={"flex gap-[10px] items-center"}>
              <img className={"w-[18px] shrink-0"} src={ktonIcon} alt="image" />
              <div>16,331.629 {selectedNetwork?.kton.symbol.toUpperCase()}</div>
              <Tooltip className={"shrink-0"} message={getKtonTooltipMessage()}>
                <img className={"w-[16px] shrink-0 clickable"} src={helpIcon} alt="image" />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MigrationStatus;
