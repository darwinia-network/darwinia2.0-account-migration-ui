import { useStorage, useWallet } from "@darwinia/app-providers";
import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import Identicon from "@polkadot/react-identicon";
import MigrationSummary from "../MigrationSummary";
import MigrationForm from "../MigrationForm";
import { useCallback, useEffect, useRef, useState } from "react";
import BigNumber from "bignumber.js";
import { Button, Column, Input, ModalEnhanced, notification, OptionProps, Select, Table, Tooltip } from "@darwinia/ui";
import { CustomInjectedAccountWithMeta, MultisigAccount } from "@darwinia/app-types";
import noDataIcon from "../../assets/images/no-data.svg";
import helpIcon from "../../assets/images/help.svg";
import trashIcon from "../../assets/images/trash-bin.svg";
import { getStore, prettifyNumber, setStore } from "@darwinia/app-utils";
import { useLocation, useNavigate } from "react-router-dom";

interface Asset {
  ring: BigNumber;
  kton: BigNumber;
}

interface MultisigAccountData {
  id: string;
  address: string;
  name: string;
  who: string[];
  asset: Asset;
  threshold: number;
}

const MultisigMigrationProcess = () => {
  const { selectedAccount, injectedAccounts, checkDarwiniaOneMultisigAccount, selectedNetwork } = useWallet();
  const { migrationAssetDistribution, isLoadingLedger } = useStorage();
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMigrationForm, setShowMigrationForm] = useState<boolean>(false);
  const currentAccount = useRef<CustomInjectedAccountWithMeta>();
  const canShowAccountNotification = useRef(false);
  const [isAddMultisigModalVisible, setAddMultisigModalVisibility] = useState<boolean>(false);
  const accountsOptions: OptionProps[] = (injectedAccounts?.map((item, index) => {
    return {
      id: index,
      value: item.address,
      label: item.address,
    };
  }) ?? []) as unknown as OptionProps[];

  const [memberAddresses, setMemberAddresses] = useState<{ address: string; id: number }[]>([
    { id: new Date().getTime(), address: "" },
  ]);
  const [threshold, setThreshold] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [isCheckingAccountExistence, setCheckingAccountExistence] = useState<boolean>(false);
  const [multisigAccountsList, setMultisigAccountsList] = useState<MultisigAccountData[]>([]);

  const columns: Column<MultisigAccountData>[] = [
    {
      id: "1",
      title: <div>{t(localeKeys.name)}</div>,
      key: "name",
      width: "200px",
      render: (row) => {
        return (
          <div className={"flex items-center gap-[5px] flex-ellipsis"}>
            <Identicon
              value={row.address}
              size={30}
              className={"rounded-full self-start bg-white shrink-0"}
              theme={"polkadot"}
            />
            <div>{row.name}</div>
          </div>
        );
      },
    },
    {
      id: "2",
      title: <div>{t(localeKeys.address)}</div>,
      key: "address",
      width: "480px",
      render: (row) => {
        return (
          <div className={"flex flex-ellipsis"}>
            <div>{row.address}</div>
          </div>
        );
      },
    },
    {
      id: "3",
      title: <div>{t(localeKeys.asset)}</div>,
      key: "asset",
      render: (row) => {
        return (
          <div className={"flex flex-col"}>
            <div>
              {t(localeKeys.balanceAmount, {
                amount: prettifyNumber({
                  number: row.asset.ring,
                }),
                tokenSymbol: selectedNetwork?.ring.symbol,
              })}
            </div>
            <div>
              {t(localeKeys.balanceAmount, {
                amount: prettifyNumber({
                  number: row.asset.kton,
                }),
                tokenSymbol: selectedNetwork?.kton.symbol,
              })}
            </div>
          </div>
        );
      },
    },
    {
      id: "4",
      title: <div>{t(localeKeys.actions)}</div>,
      key: "name",
      width: "200px",
      render: (row) => {
        return (
          <div>
            <Button
              onClick={() => {
                onInitializeMigration(row);
              }}
              className={"!h-[30px]"}
              btnType={"secondary"}
            >
              Migrate
            </Button>
          </div>
        );
      },
    },
  ];

  const onInitializeMigration = useCallback(
    (item: MultisigAccountData) => {
      const params = new URLSearchParams(location.search);
      params.set("address", item.address);
      params.set("name", item.name);
      params.set("who", item.who.join(","));
      params.set("threshold", item.threshold.toString());
      navigate(`/multisig-account-migration-summary?${params.toString()}`);
    },
    [location]
  );

  const prepareMultisigAccountData = (accountList: MultisigAccount[]) => {
    const data: MultisigAccountData[] = [];
    for (let i = 0; i < accountList.length; i++) {
      const accountItem = accountList[i];
      const item: MultisigAccountData = {
        id: accountItem.address,
        address: accountItem.address,
        name: accountItem.meta.name,
        asset: {
          ring: BigNumber(0),
          kton: BigNumber(0),
        },
        who: [...accountItem.meta.who],
        threshold: accountItem.meta.threshold,
      };
      data.push(item);
    }
    return data;
  };

  useEffect(() => {
    const multisigAccounts: MultisigAccount[] = getStore("multisigAccounts") ?? [];
    const data = prepareMultisigAccountData(multisigAccounts);
    setMultisigAccountsList(data);
  }, []);

  useEffect(() => {
    console.log("list changed");
  }, [multisigAccountsList]);

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

  const onCreateMultisigAccount = async () => {
    try {
      setCheckingAccountExistence(true);
      const signatories = memberAddresses.map((item) => item.address);
      signatories.unshift(selectedAddress);
      const thresholdNumber = Number(threshold);
      const account = await checkDarwiniaOneMultisigAccount(signatories, thresholdNumber, { name });
      setCheckingAccountExistence(false);
      console.log(account);
      if (typeof account === "undefined") {
        notification.success({
          message: <div>{t(localeKeys.multisigCreationFailed)}</div>,
          duration: 10000,
        });
        return;
      }
      const multisigAccounts: MultisigAccount[] = getStore("multisigAccounts") ?? [];
      //remove the account is it was already available in the local storage
      const filteredAccounts = multisigAccounts.filter((account) => account.address !== account.address);
      filteredAccounts.push(account);
      setStore("multisigAccounts", filteredAccounts);
      const data = prepareMultisigAccountData([account]);
      setMultisigAccountsList((old) => {
        return [...old, ...data];
      });
    } catch (e) {
      setCheckingAccountExistence(false);
      //ignore
    }
  };

  const accountSelectionChanged = (value: string | string[]) => {
    if (!Array.isArray(value)) {
      setSelectedAddress(value);
      console.log(value);
    }
  };

  const onMemberAddressChanged = (index: number, value: string) => {
    const members = [...memberAddresses];
    members[index].address = value;
    setMemberAddresses(() => members);
  };

  const onThresholdChanged = (value: string) => {
    setThreshold(value);
  };

  const onNameChanged = (value: string) => {
    setName(value);
  };

  const onDeleteMemberAddress = (index: number) => {
    const addresses = [...memberAddresses];
    addresses.splice(index, 1);
    setMemberAddresses(addresses);
  };

  const onAddNewMemberAddress = () => {
    setMemberAddresses((old) => {
      return [
        ...old,
        {
          id: new Date().getTime(),
          address: "",
        },
      ];
    });
  };

  return (
    <div className={"flex flex-1 flex-col gap-[30px]"}>
      <div className={"flex flex-col flex-1 card gap-[20px]"}>
        <div className={"w-full"}>
          <div className={"divider border-b pb-[10px] flex justify-between items-center"}>
            <div>{t(localeKeys.multisig)}</div>
            <Button onClick={onShowAddAccountModal} className={"min-w-[150px]"}>
              {t(localeKeys.addMultisigAccount)}
            </Button>
          </div>
        </div>

        {multisigAccountsList.length > 0 ? (
          <Table dataSource={multisigAccountsList} columns={columns} />
        ) : (
          <div className={"flex-1 flex justify-center items-center"}>
            <div className={"flex flex-col items-center gap-[10px]"}>
              <img className={"w-[50px]"} src={noDataIcon} alt="noDataIcon" />
              <div>{t(localeKeys.noMultisigAccounts)}</div>
              <Button onClick={onShowAddAccountModal} className={"min-w-[150px]"}>
                {t(localeKeys.addMultisigAccount)}
              </Button>
            </div>
          </div>
        )}
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
        modalTitle={t(localeKeys.createWallet)}
        onConfirm={onCreateMultisigAccount}
        confirmText={t(localeKeys.createMultisig)}
        onCancel={onCloseAddAccountModal}
        cancelText={t(localeKeys.cancel)}
        isLoading={isCheckingAccountExistence}
      >
        <div className={"flex flex-col gap-[20px] dw-custom-scrollbar max-h-[430px]"}>
          <div className={"flex flex-col gap-[10px]"}>
            <div className={"flex items-center gap-[6px]"}>
              <div>{t(localeKeys.name)}</div>
              <Tooltip message={t(localeKeys.multisigNameTip)}>
                <img className={"w-[16px]"} src={helpIcon} alt="image" />
              </Tooltip>
            </div>
            <Input
              value={name}
              placeholder={""}
              onChange={(e) => {
                onNameChanged(e.target.value);
              }}
              leftIcon={null}
            />
          </div>

          <div className={"flex flex-col gap-[10px]"}>
            <div className={"flex items-center gap-[6px]"}>
              <div>{t(localeKeys.threshold)}</div>
              <Tooltip message={t(localeKeys.multisigThresholdTip)}>
                <img className={"w-[16px]"} src={helpIcon} alt="image" />
              </Tooltip>
            </div>
            <Input
              value={threshold}
              placeholder={""}
              onChange={(e) => {
                onThresholdChanged(e.target.value);
              }}
              leftIcon={null}
            />
          </div>

          <div className={"flex flex-col gap-[10px]"}>
            <div className={"flex items-center gap-[6px]"}>
              <div>{t(localeKeys.yourAddress)}</div>
            </div>
            <Select value={selectedAddress} onChange={accountSelectionChanged} options={accountsOptions} />
          </div>

          <div className={"flex flex-col gap-[10px]"}>
            <div className={"flex items-center gap-[6px]"}>
              <div>{t(localeKeys.membersAddress)}</div>
            </div>
            <div className={"flex flex-col gap-[10px]"}>
              {memberAddresses.map((item, index) => {
                return (
                  <div key={`${item.id}-${index}`} className={"flex gap-[12px] items-center"}>
                    <div className={"flex-1"}>
                      <Input
                        onChange={(event) => {
                          onMemberAddressChanged(index, event.target.value);
                        }}
                        value={item.address}
                        placeholder={t(localeKeys.memberAddress)}
                        leftIcon={null}
                      />
                    </div>
                    <img
                      onClick={() => {
                        onDeleteMemberAddress(index);
                      }}
                      className={"w-[21px] h-[21px] cursor-pointer"}
                      src={trashIcon}
                      alt="image"
                    />
                  </div>
                );
              })}
            </div>
            <div>
              <Button onClick={onAddNewMemberAddress} btnType={"secondary"}>
                {t(localeKeys.addMembers)}
              </Button>
            </div>
          </div>
        </div>
      </ModalEnhanced>
    </div>
  );
};

export default MultisigMigrationProcess;
