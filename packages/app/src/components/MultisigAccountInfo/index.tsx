import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import { useWallet } from "@darwinia/app-providers";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import Identicon from "@polkadot/react-identicon";
import copyIcon from "../../assets/images/copy.svg";
import { Button, ModalEnhanced, SlideDownUp } from "@darwinia/ui";
import caretIcon from "../../assets/images/caret-down.svg";

const MultisigAccountInfo = () => {
  const { t } = useAppTranslation();
  const { injectedAccounts } = useWallet();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const address = params.get("address");
  const members = (params.get("who") ?? "").split(",");
  const name = params.get("name");
  const threshold = params.get("threshold");
  const [isMemberSectionVisible, setMemberSectionVisible] = useState<boolean>(true);
  const [isMigrateModalVisible, setMigrationModalVisible] = useState<boolean>(false);

  const toggleMemberSections = () => {
    setMemberSectionVisible((isVisible) => !isVisible);
  };

  const onShowMigrateModal = () => {
    setMigrationModalVisible(true);
    console.log("here===");
  };

  const onCloseModal = () => {};

  return (
    <div>
      <div className={"card"}>
        <div className={"flex flex-col"}>
          <div className={"flex justify-between items-center border-b divider pb-[20px]"}>
            <div className={"flex items-center gap-[20px] flex-ellipsis"}>
              <Identicon
                value={address}
                size={30}
                className={"rounded-full self-start bg-white shrink-0"}
                theme={"polkadot"}
              />
              <div className={"flex gap-[5px]"}>
                <div>{name}</div>
                <div className={"rounded-[30px] text-12 inline-block py-[4px] px-[5px] bg-[rgba(255,0,131,0.5)]"}>
                  {t(localeKeys.multisig)}
                </div>
              </div>
              <div className={"flex items-center gap-[5px]"}>
                <div>{address}</div>
                <img className={"clickable shrink-0"} src={copyIcon} alt="image" />
              </div>
            </div>
            <Button onClick={onShowMigrateModal}>{t(localeKeys.migrate)}</Button>
          </div>
          <div className={"flex gap-[20px] items-center mt-[20px]"}>
            <div className={"flex gap-[10px]"}>
              <div>{t(localeKeys.threshold)}</div>
              <div>{threshold}</div>
            </div>
            <div className={"flex gap-[10px]"}>
              <div>{t(localeKeys.members)}</div>
              <div>{members.length}</div>
            </div>
            <div>
              <img
                onClick={toggleMemberSections}
                className={`w-[20px] clickable transition ${isMemberSectionVisible ? "rotate-180" : "rotate-0"} `}
                src={caretIcon}
                alt="caretIcon"
              />
            </div>
          </div>
          <div>
            <SlideDownUp isVisible={isMemberSectionVisible}>
              <div className={"pt-[20px]"}>
                {members.map((member, index) => {
                  const isMyAccount = !!injectedAccounts?.find(
                    (account) => account.address.toLowerCase() === member.toLowerCase()
                  );
                  return (
                    <div className={"flex border-b divider bg-black px-[10px] py-[12px]"} key={`${member}-${index}`}>
                      <div className={"min-w-[170px]"}>
                        {isMyAccount ? t(localeKeys.memberYou) : t(localeKeys.member)}
                      </div>
                      <div>{member}</div>
                    </div>
                  );
                })}
              </div>
            </SlideDownUp>
          </div>
        </div>
      </div>
      <ModalEnhanced isVisible={isMigrateModalVisible} onClose={onCloseModal} modalTitle={t(localeKeys.migration)}>
        <div>
          <div className={"flex flex-col gap-[10px] border-b divider pb-[20px]"}>
            <div>{t(localeKeys.fromSubstrateMultisig)}</div>
            <div className={"flex flex-ellipsis items-center gap-[10px] border border-white py-[7px] px-[10px]"}>
              <Identicon
                value={address}
                size={26}
                className={"rounded-full self-start bg-white shrink-0"}
                theme={"polkadot"}
              />
              <div>{address}</div>
            </div>
          </div>
        </div>
      </ModalEnhanced>
    </div>
  );
};

export default MultisigAccountInfo;
