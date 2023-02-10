import { forwardRef, useImperativeHandle, useState } from "react";
import { ModalEnhanced, Tooltip } from "@darwinia/ui";
import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import { useWallet } from "@darwinia/app-providers";
import Identicon from "@polkadot/react-identicon";
import { CustomInjectedAccountWithMeta } from "@darwinia/app-types";
import { prettifyNumber, prettifyTooltipNumber } from "@darwinia/app-utils";

export interface SelectAccountModalRef {
  toggle: () => void;
}

const SelectAccountModal = forwardRef<SelectAccountModalRef>((props, ref) => {
  const [isVisible, setVisible] = useState<boolean>(false);
  const { t } = useAppTranslation();
  const { injectedAccounts, selectedAccount, selectedNetwork, setSelectedAccount } = useWallet();

  const toggle = () => {
    setVisible((oldValue) => !oldValue);
  };

  const onCloseModal = () => {
    setVisible(false);
  };

  useImperativeHandle(ref, () => {
    return {
      toggle: toggle,
    };
  });

  const onSelectAccount = (account: CustomInjectedAccountWithMeta) => {
    setSelectedAccount(account);
    onCloseModal();
  };

  return (
    <ModalEnhanced
      contentClassName={"!pr-[5px]"}
      isVisible={isVisible}
      onClose={onCloseModal}
      modalTitle={t(localeKeys.selectAccount)}
    >
      <div className={"dw-custom-scrollbar max-h-[360px] pr-[10px] flex flex-col gap-[20px]"}>
        {injectedAccounts?.map((account) => {
          const selectedAccountClass = account.address === selectedAccount?.address ? "!border-primary" : "";
          return (
            <div
              onClick={() => {
                onSelectAccount(account);
              }}
              key={account.address}
              className={`flex cursor-pointer border divider ${selectedAccountClass} py-[10px] px-[20px] gap-[20px]`}
            >
              <Identicon
                value={account.address}
                size={36}
                className={"rounded-full self-start bg-white shrink-0"}
                theme={"polkadot"}
              />
              <div className={"flex flex-col gap-[5px] flex-ellipsis"}>
                <div className={"text-18-bold"}>{account.prettyName}</div>
                <div className={"text-14"}>{account.address}</div>
                <div className={"flex gap-[10px] text-12 text-halfWhite"}>
                  <div className={"flex gap-[5px]"}>
                    <Tooltip message={<div>{prettifyTooltipNumber(account.balance.ring)}</div>}>
                      {prettifyNumber({
                        number: account.balance.ring,
                        shouldFormatToEther: true,
                      })}
                    </Tooltip>{" "}
                    {selectedNetwork?.ring.symbol.toUpperCase()}
                  </div>
                  <div>|</div>
                  <div className={"flex"}>
                    <Tooltip message={<div>{prettifyTooltipNumber(account.balance.kton)}</div>}>
                      {prettifyNumber({
                        number: account.balance.kton,
                        shouldFormatToEther: true,
                      })}
                    </Tooltip>{" "}
                    {selectedNetwork?.kton.symbol.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ModalEnhanced>
  );
});

SelectAccountModal.displayName = "SelectAccountModal";

export default SelectAccountModal;
