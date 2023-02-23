import { useStorage, useWallet } from "@darwinia/app-providers";
import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import Identicon from "@polkadot/react-identicon";
import MigrationSummary from "../MigrationSummary";
import MigrationForm from "../MigrationForm";
import { useEffect, useRef, useState } from "react";
import BigNumber from "bignumber.js";
import { Button, ModalEnhanced, notification } from "@darwinia/ui";
import { CustomInjectedAccountWithMeta } from "@darwinia/app-types";
import noDataIcon from "../../assets/images/no-data.svg";

interface Props {
  isCheckingMigrationStatus: boolean;
}

const MultisigMigrationProcess = ({ isCheckingMigrationStatus }: Props) => {
  const { selectedAccount } = useWallet();
  const { migrationAssetDistribution, isLoadingLedger } = useStorage();
  const { t } = useAppTranslation();
  const [showMigrationForm, setShowMigrationForm] = useState<boolean>(false);
  const currentAccount = useRef<CustomInjectedAccountWithMeta>();
  const canShowAccountNotification = useRef(false);
  const [isAddMultisigModalVisible, setAddMultisigModalVisibility] = useState<boolean>(false);

  useEffect(() => {
    if (currentAccount.current?.address !== selectedAccount?.address) {
      currentAccount.current = selectedAccount;
      canShowAccountNotification.current = true;
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (migrationAssetDistribution && !isLoadingLedger) {
      const hasRingAmount =
        migrationAssetDistribution.ring.transferable.gt(0) ||
        migrationAssetDistribution.ring.deposit?.gt(0) ||
        migrationAssetDistribution.ring.bonded.gt(0) ||
        migrationAssetDistribution.ring.unbonded.gt(0) ||
        migrationAssetDistribution.ring.unbonding.gt(0) ||
        migrationAssetDistribution.ring.vested?.gt(0);
      const hasKtonAmount =
        migrationAssetDistribution.kton.transferable.gt(0) ||
        migrationAssetDistribution.kton.bonded.gt(0) ||
        migrationAssetDistribution.kton.unbonded.gt(0) ||
        migrationAssetDistribution.kton.unbonding.gt(0);
      if (hasRingAmount || hasKtonAmount) {
        setShowMigrationForm(true);
      } else {
        // makes sure that the prompt is only shown once when the selected account changes
        if (canShowAccountNotification.current) {
          canShowAccountNotification.current = false;
          notification.error({
            message: <div>{t(localeKeys.noTokensToMigrate)}</div>,
          });
        }
        setShowMigrationForm(false);
      }
    }
  }, [migrationAssetDistribution, isLoadingLedger]);

  const footerLinks = [
    {
      title: t(localeKeys.howToMigrate),
      url: "https://www.baidu.com",
    },
    {
      title: t(localeKeys.darwiniaMergeOverview),
      url: "https://medium.com/darwinianetwork/darwinia-2-0-merge-overview-96af96d668aa",
    },
    {
      title: t(localeKeys.darwiniaDataMigration),
      url: "https://medium.com/darwinianetwork/darwinia-2-0-blockchain-data-migration-c1186338c743",
    },
  ];

  const onShowAddAccountModal = () => {
    setAddMultisigModalVisibility(true);
  };

  const onCloseAddAccountModal = () => {
    setAddMultisigModalVisibility(false);
  };

  const onCreateMultisigAccount = () => {
    console.log("create multi sig");
  };

  return (
    <div className={"flex flex-1 flex-col gap-[30px]"}>
      <div className={"flex flex-col flex-1 card gap-[20px]"}>
        <div className={"w-full"}>
          <div className={"divider border-b pb-[10px]"}>{t(localeKeys.multisig)}</div>
        </div>
        <div className={"flex-1 flex justify-center items-center"}>
          <div className={"flex flex-col items-center gap-[10px]"}>
            <img className={"w-[50px]"} src={noDataIcon} alt="noDataIcon" />
            <div>{t(localeKeys.noMultisigAccounts)}</div>
            <Button onClick={onShowAddAccountModal} className={"min-w-[150px]"}>
              {t(localeKeys.addMultisigAccount)}
            </Button>
          </div>
        </div>
      </div>
      <div className={"flex flex-col lg:flex-row justify-between"}>
        {footerLinks.map((item, index) => {
          return (
            <a
              key={index}
              className={"text-14-bold link link-primary"}
              href={item.url}
              rel={"noreferrer"}
              target={"_blank"}
            >
              {item.title}
            </a>
          );
        })}
      </div>
      <ModalEnhanced
        isVisible={isAddMultisigModalVisible}
        onClose={onCloseAddAccountModal}
        modalTitle={"twende"}
        onConfirm={onCreateMultisigAccount}
        confirmDisabled={true}
        onCancel={onCloseAddAccountModal}
        cancelText={t(localeKeys.cancel)}
      >
        <div>Hello</div>
      </ModalEnhanced>
    </div>
  );
};

export default MultisigMigrationProcess;
