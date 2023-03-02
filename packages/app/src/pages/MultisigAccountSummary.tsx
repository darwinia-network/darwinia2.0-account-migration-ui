import Identicon from "@polkadot/react-identicon";
import { useLocation } from "react-router-dom";
import { Button, SlideDownUp } from "@darwinia/ui";
import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import copyIcon from "../assets/images/copy.svg";
import caretIcon from "../assets/images/caret-down.svg";
import { useState } from "react";
import { useWallet } from "@darwinia/app-providers";

const MultisigAccountSummary = () => {
  const { t } = useAppTranslation();
  const { injectedAccounts } = useWallet();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const address = params.get("address");
  const members = (params.get("who") ?? "").split(",");
  const name = params.get("name");
  const threshold = params.get("threshold");
  const [isMemberSectionVisible, setMemberSectionVisible] = useState<boolean>(true);

  const toggleMemberSections = () => {
    setMemberSectionVisible((isVisible) => !isVisible);
  };

  return (
    <div className={"flex flex-col gap-[20px]"}>
      <div className={"card"}>
        <div className={"flex flex-col gap-[20px]"}>
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
            <Button>{t(localeKeys.migrate)}</Button>
          </div>
          <div className={"flex gap-[20px] items-center"}>
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
          <SlideDownUp isVisible={isMemberSectionVisible}>
            <div>
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
      <div className={"card"}>
        <div className={"flex flex-col lg:flex-row gap-[20px]"}>
          <div className={"flex-1 shrink-0 bg-black"}>Card1</div>
          <div className={"flex-1 shrink-0 bg-black"}>Card2</div>
        </div>
      </div>
    </div>
  );
};

export default MultisigAccountSummary;
