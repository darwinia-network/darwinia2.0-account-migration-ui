import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import TokensBalanceSummary from "../components/TokensBalanceSummary";
import MultisigAccountInfo from "../components/MultisigAccountInfo";

const MultisigAccountSummary = () => {
  const { t } = useAppTranslation();

  return (
    <div className={"flex flex-col gap-[20px]"}>
      <MultisigAccountInfo />
      <div className={"card"}>
        <TokensBalanceSummary asset={undefined} />
      </div>
    </div>
  );
};

export default MultisigAccountSummary;
