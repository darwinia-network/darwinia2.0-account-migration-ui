import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import TokensBalanceSummary from "../components/TokensBalanceSummary";
import MultisigAccountInfo from "../components/MultisigAccountInfo";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const MultisigAccountMigrationSummary = () => {
  const { t } = useAppTranslation();
  const [isAccountMigrationInitialized, setAccountMigrationInitialized] = useState<boolean>(true);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const address = params.get("address");
  const members = (params.get("who") ?? "").split(",");
  const name = params.get("name");
  const threshold = params.get("threshold");

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

  return (
    <div className={"flex flex-col gap-[20px]"}>
      <MultisigAccountInfo />
      {isAccountMigrationInitialized ? (
        <div>Account migration initilized</div>
      ) : (
        <div className={"card"}>
          <TokensBalanceSummary asset={undefined} />
        </div>
      )}
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

export default MultisigAccountMigrationSummary;
