import { useWallet } from "@darwinia/app-providers";
import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import Identicon from "@polkadot/react-identicon";
import MigrationSummary from "../MigrationSummary";
import MigrationForm from "../MigrationForm";

interface Props {
  isCheckingMigrationStatus: boolean;
}

const MigrationProcess = ({ isCheckingMigrationStatus }: Props) => {
  const { selectedAccount } = useWallet();
  const { t } = useAppTranslation();

  const footerLinks = [
    {
      title: t(localeKeys.howToMigrate),
      url: "https://www.baidu.com",
    },
    {
      title: t(localeKeys.darwiniaMergeOverview),
      url: "https://www.baidu.com",
    },
    {
      title: t(localeKeys.darwiniaDataMigration),
      url: "https://www.baidu.com",
    },
  ];

  return (
    <div className={"flex flex-col gap-[30px]"}>
      <div className={"flex items-center card gap-[20px]"}>
        <Identicon
          value={selectedAccount?.address}
          size={30}
          className={"rounded-full bg-white self-start lg:self-center shrink-0"}
          theme={"polkadot"}
        />
        <div className={"flex flex-col lg:flex-row lg:items-center flex-ellipsis gap-[8px]"}>
          <div>{selectedAccount?.prettyName}</div>
          <div className={"hidden lg:flex"}>-</div>
          <div>{selectedAccount?.address}</div>
        </div>
      </div>
      <MigrationSummary isCheckingMigrationStatus={isCheckingMigrationStatus} />
      <MigrationForm />
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
    </div>
  );
};

export default MigrationProcess;
