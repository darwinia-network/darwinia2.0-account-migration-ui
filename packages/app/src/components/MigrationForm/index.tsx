import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import helpIcon from "../../assets/images/help.svg";
import { Button, CheckboxGroup, Input, ModalEnhanced, Tooltip } from "@darwinia/ui";
import { ChangeEvent, useState } from "react";
import { useWallet } from "@darwinia/app-providers";
import Identicon from "@polkadot/react-identicon";
import JazzIcon from "../JazzIcon";
import { isEthereumAddress } from "@darwinia/app-utils";
import { FIND_MIGRATION_BY_DESTINATION_ADDRESS } from "@darwinia/app-config";
import { useQuery } from "@apollo/client";

interface Tip {
  id: number;
  title: string;
}

interface MigrationQuery {
  accountAddress: string;
}

export interface DestinationAccount {
  id: string;
  source: string;
}

interface MigrationResult {
  destinationAccount?: DestinationAccount;
}

const MigrationForm = () => {
  const { t } = useAppTranslation();
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [isAttentionModalVisible, setAttentionModalVisibility] = useState<boolean>(false);
  const [isConfirmationModalVisible, setConfirmationModalVisibility] = useState<boolean>(false);
  const [addressError, setAddressError] = useState<string>();
  const [checkedTips, setCheckedTips] = useState<Tip[]>([]);
  const { selectedNetwork, selectedAccount, onInitMigration } = useWallet();
  const [isProcessingMigration, setProcessingMigration] = useState<boolean>(false);

  const onDestinationAddressChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setAddressError(undefined);
    setDestinationAddress(e.target.value);
  };

  const { data: migrationData, loading: isCheckingDestinationStatus } = useQuery<MigrationResult, MigrationQuery>(
    FIND_MIGRATION_BY_DESTINATION_ADDRESS,
    {
      variables: {
        accountAddress: destinationAddress,
      },
    }
  );

  console.log("migrationData=====🚆", migrationData, isCheckingDestinationStatus);

  const attentionTips: Tip[] = [
    {
      id: 1,
      title: t(localeKeys.iamMigratingFromOneDarwiniaToTwo),
    },
    {
      id: 2,
      title: t(localeKeys.iHaveConfirmedIsNewAddress),
    },
    {
      id: 3,
      title: t(localeKeys.iHavePrivateKeys),
    },
    {
      id: 4,
      title: t(localeKeys.evmAccountNotExchange),
    },
    {
      id: 5,
      title: t(localeKeys.evmAccountSafe, { link: "https://www.baidu.com" }),
    },
  ];

  const onMigrate = () => {
    if (!isEthereumAddress(destinationAddress)) {
      setAddressError(t(localeKeys.evmAccountIncorrect));
      return;
    }
    if (migrationData?.destinationAccount) {
      setAddressError(t(localeKeys.evmAccountAlreadyUsedInMigration));
      return;
    }
    /*if (address.length === 2) {
      setAddressError(t(localeKeys.evmAccountAlreadyUsedInDarwinia1));
      return;
    }*/
    onShowAttentionModal();
  };

  const onAttentionTipChecked = (checkedTip: Tip, allCheckedTips: Tip[]) => {
    setCheckedTips(allCheckedTips);
  };

  const onShowAttentionModal = () => {
    setAttentionModalVisibility(true);
  };

  const onCloseAttentionModal = () => {
    setAttentionModalVisibility(false);
  };

  const onTermsAgreeing = () => {
    setAttentionModalVisibility(false);
    setConfirmationModalVisibility(true);
  };

  const onCloseConfirmationModal = () => {
    setConfirmationModalVisibility(false);
  };

  const getAddressError = () => {
    if (!addressError) {
      return null;
    }
    return <div>{addressError}</div>;
  };

  const onConfirmAndMigrate = async () => {
    if (!selectedAccount) {
      return;
    }
    try {
      setProcessingMigration(true);
      onInitMigration(selectedAccount.address, destinationAddress, (isSuccessful) => {
        setProcessingMigration(isSuccessful);
      });
    } catch (e) {
      setProcessingMigration(false);
    }
  };

  const getTipOption = (option: Tip) => {
    return <div dangerouslySetInnerHTML={{ __html: option.title }} />;
  };

  return (
    <div className={"card flex gap-[20px] flex-col"}>
      <div className={"flex flex-col gap-[10px] divider border-b pb-[20px]"}>
        <div className={"flex gap-[5px] items-center"}>
          <div className={"text-12-bold"}>{t(localeKeys.migrateToEVMAccount)}</div>
          <Tooltip message={<div>{t(localeKeys.migrateToEVMMessage)}</div>}>
            <img className={"w-[11px]"} src={helpIcon} alt="image" />
          </Tooltip>
        </div>
        <div>
          <Input
            error={getAddressError()}
            value={destinationAddress}
            onChange={onDestinationAddressChanged}
            leftIcon={null}
            placeholder={t(localeKeys.migrateToEVMAccountPlaceholder)}
          />
        </div>
      </div>
      <div className={"text-12"}>{t(localeKeys.migrationFormInfo)}</div>
      <Button
        onClick={onMigrate}
        disabled={destinationAddress.trim().length === 0 || isCheckingDestinationStatus}
        className={"min-w-[150px]"}
      >
        {t(localeKeys.migrate)}
      </Button>
      <ModalEnhanced
        isVisible={isAttentionModalVisible}
        onClose={onCloseAttentionModal}
        modalTitle={t(localeKeys.attention)}
        isCancellable={true}
        onConfirm={onTermsAgreeing}
        confirmText={t(localeKeys.agreeAndContinue)}
        confirmDisabled={checkedTips.length < attentionTips.length}
        onCancel={onCloseAttentionModal}
        cancelText={t(localeKeys.cancel)}
      >
        <div>
          <CheckboxGroup
            className={"flex-start"}
            render={getTipOption}
            onChange={onAttentionTipChecked}
            selectedOptions={checkedTips}
            options={attentionTips}
          />
        </div>
      </ModalEnhanced>

      <ModalEnhanced
        isVisible={isConfirmationModalVisible}
        onClose={onCloseConfirmationModal}
        modalTitle={t(localeKeys.migrationConfirmation)}
        confirmText={t(localeKeys.confirmAndMigrate)}
        onConfirm={onConfirmAndMigrate}
        onCancel={onCloseConfirmationModal}
        cancelText={t(localeKeys.cancel)}
        isLoading={isProcessingMigration}
        isCancellable={true}
      >
        <div className={"flex flex-col gap-[20px] pb-[20px] divider border-b"}>
          {/*Origin*/}
          <div className={"flex flex-col gap-[10px]"}>
            <div className={"text-12-bold"}>
              {t(localeKeys.fromTheSubstrateAccount, { name: selectedNetwork?.name })}
            </div>
            <div className={"bg-[rgba(255,255,255,0.2)] flex-ellipsis flex items-center gap-[10px] py-[7px] px-[10px]"}>
              <Identicon
                value={selectedAccount?.address}
                size={26}
                className={"rounded-full bg-white shrink-0"}
                theme={"polkadot"}
              />
              <div>{selectedAccount?.address}</div>
            </div>
          </div>
          {/*Destination*/}
          <div className={"flex flex-col gap-[10px]"}>
            <div className={"text-12-bold"}>{t(localeKeys.toEVMAccount, { name: selectedNetwork?.name })}</div>
            <div className={"bg-[rgba(255,255,255,0.2)] flex-ellipsis flex items-center gap-[10px] py-[7px] px-[10px]"}>
              <div className={"w-[26px] shrink-0"}>
                <JazzIcon address={destinationAddress} size={26} />
              </div>
              <div>{destinationAddress}</div>
            </div>
          </div>
        </div>
      </ModalEnhanced>
    </div>
  );
};

export default MigrationForm;
