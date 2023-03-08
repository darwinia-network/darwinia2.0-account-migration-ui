import { Tabs, Tab } from "@darwinia/ui";
import { useAppTranslation } from "@darwinia/app-locale";
import { useState } from "react";

const MultisigMigrationProgressTabs = () => {
  const { t } = useAppTranslation();
  const tabs: Tab[] = [
    {
      id: "1",
      title: "aaa",
    },
    {
      id: "2",
      title: "bbb",
    },
    {
      id: "3",
      title: "ccc",
    },
  ];
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[0]);
  const onTabsChange = (selectedTab: Tab) => {
    setSelectedTab(selectedTab);
  };
  return (
    <div>
      <Tabs onChange={onTabsChange} tabs={tabs} activeTabId={selectedTab.id} />
    </div>
  );
};

export default MultisigMigrationProgressTabs;
