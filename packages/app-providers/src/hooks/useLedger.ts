import { useEffect, useRef, useState } from "react";

import {
  AssetDistribution,
  DarwiniaStakingLedgerEncoded,
  DarwiniaStakingLedger,
  Deposit,
  DepositEncoded,
  PalletVestingVestingInfo,
} from "@darwinia/app-types";
import BigNumber from "bignumber.js";
import { ApiPromise } from "@polkadot/api";
import { UnSubscription } from "../storageProvider";
import useBlock from "./useBlock";
import { Vec, Option } from "@polkadot/types";
import { FrameSystemAccountInfo } from "@darwinia/api-derive/accounts/types";

interface Params {
  apiPromise: ApiPromise | undefined;
  selectedAccount: string | undefined;
}

const useLedger = ({ apiPromise, selectedAccount }: Params) => {
  const [isLoadingLedger, setLoadingLedger] = useState<boolean>(true);
  const isInitialLoad = useRef<boolean>(true);
  /*staking asset distribution*/
  const [stakedAssetDistribution, setStakedAssetDistribution] = useState<AssetDistribution>();
  const { currentBlock } = useBlock(apiPromise);

  /*Get staking ledger and deposits. The data that comes back from the server needs a lot of decoding */
  useEffect(() => {
    let depositsUnsubscription: UnSubscription | undefined;
    let accountUnsubscription: UnSubscription | undefined;
    let ledgerUnsubscription: UnSubscription | undefined;
    let vestedUnsubscription: UnSubscription | undefined;
    const getStakingLedgerAndDeposits = async () => {
      if (!selectedAccount || !apiPromise || !currentBlock) {
        return;
      }
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        setLoadingLedger(true);
      }
      let ledgerInfo: Option<DarwiniaStakingLedgerEncoded> | undefined;
      let depositsInfo: Option<Vec<DepositEncoded>> | undefined;
      let vestedAmountRing = BigNumber(0);
      let totalBalance = BigNumber(0);

      const parseData = (
        ledgerOption: Option<DarwiniaStakingLedgerEncoded> | undefined,
        depositsOption: Option<Vec<DepositEncoded>> | undefined
      ) => {
        if (!ledgerOption || !depositsOption) {
          return;
        }

        let totalDepositsAmount = BigNumber(0);

        if (depositsOption.isSome) {
          const unwrappedDeposits = depositsOption.unwrap();
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const depositsData = unwrappedDeposits.toHuman() as Deposit[];
          /*depositsData here is not a real Deposit[], it's just a casting hack */
          depositsData.forEach((item) => {
            const amount = BigNumber(item.value.toString().replaceAll(",", ""));
            totalDepositsAmount = totalDepositsAmount.plus(amount);
          });
        }

        if (ledgerOption.isSome) {
          const unwrappedLedger = ledgerOption.unwrap();
          /*ledgerData here is not a real DarwiniaStakingLedger, it's just a casting hack */
          const ledgerData = unwrappedLedger.toHuman() as unknown as DarwiniaStakingLedger;
          /*These are the IDs of the deposits that have been used in staking*/
          const stakedDepositsIdsList: number[] = [];
          ledgerData.stakedDeposits?.forEach((item) => {
            const depositId = item.toString().replaceAll(",", "");
            stakedDepositsIdsList.push(Number(depositId));
          });

          ledgerData.stakedRing = BigNumber(ledgerData.stakedRing.toString().replaceAll(",", ""));
          ledgerData.stakedKton = BigNumber(ledgerData.stakedKton.toString().replaceAll(",", ""));
          ledgerData.stakedDeposits = [...stakedDepositsIdsList];
          ledgerData.unstakingDeposits =
            ledgerData.unstakingDeposits?.map((item) => {
              return [Number(item[0].toString().replaceAll(",", "")), Number(item[1].toString().replaceAll(",", ""))];
            }) ?? [];
          ledgerData.unstakingRing =
            ledgerData.unstakingRing?.map((item) => {
              return [Number(item[0].toString().replaceAll(",", "")), Number(item[1].toString().replaceAll(",", ""))];
            }) ?? [];
          ledgerData.unstakingKton =
            ledgerData.unstakingKton?.map((item) => {
              return [Number(item[0].toString().replaceAll(",", "")), Number(item[1].toString().replaceAll(",", ""))];
            }) ?? [];

          const unbondingRingAmount = BigNumber(0);
          const unbondedRingAmount = BigNumber(0);
          ledgerData.unstakingRing.forEach(([amount, lastBlockNumber]) => {
            const isExpired = currentBlock.number >= lastBlockNumber;
            if (isExpired) {
              unbondedRingAmount.plus(amount);
            } else {
              unbondingRingAmount.plus(amount);
            }
          });

          const unbondingKtonAmount = BigNumber(0);
          const unbondedKtonAmount = BigNumber(0);
          ledgerData.unstakingKton.forEach(([amount, lastBlockNumber]) => {
            const isExpired = currentBlock.number >= lastBlockNumber;
            if (isExpired) {
              unbondedKtonAmount.plus(amount);
            } else {
              unbondingKtonAmount.plus(amount);
            }
          });

          /*Avoid showing the user some negative value when the totalBalance is zero*/
          const transferableRing = totalBalance.gt(0) ? totalBalance.minus(vestedAmountRing) : BigNumber(0);

          setStakedAssetDistribution({
            ring: {
              transferable: transferableRing,
              deposit: totalDepositsAmount,
              bonded: ledgerData.stakedRing,
              unbonded: unbondedRingAmount,
              unbonding: unbondingRingAmount,
              vested: vestedAmountRing,
            },
            kton: {
              transferable: BigNumber(0) /*TODO needs to be updated accordingly*/,
              bonded: ledgerData.stakedKton,
              unbonded: unbondedKtonAmount,
              unbonding: unbondingKtonAmount,
            },
          });
        } else {
          setStakedAssetDistribution({
            ring: {
              transferable: BigNumber(0),
              deposit: BigNumber(0),
              bonded: BigNumber(0),
              unbonded: BigNumber(0),
              unbonding: BigNumber(0),
              vested: BigNumber(0),
            },
            kton: {
              transferable: BigNumber(0),
              bonded: BigNumber(0),
              unbonded: BigNumber(0),
              unbonding: BigNumber(0),
            },
          });
        }
      };

      ledgerUnsubscription = (await apiPromise.query.accountMigration.ledgers(
        selectedAccount,
        (ledger: Option<DarwiniaStakingLedgerEncoded>) => {
          ledgerInfo = ledger;
          parseData(ledgerInfo, depositsInfo);
        }
      )) as unknown as UnSubscription;

      depositsUnsubscription = (await apiPromise.query.accountMigration.deposits(
        selectedAccount,
        (depositsOptions: Option<Vec<DepositEncoded>>) => {
          depositsInfo = depositsOptions;
          parseData(ledgerInfo, depositsInfo);
        }
      )) as unknown as UnSubscription;

      accountUnsubscription = (await apiPromise.query.accountMigration.accounts(selectedAccount, (data: unknown) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const accountInfoOption = data as Option<FrameSystemAccountInfo>;
        if (accountInfoOption.isSome) {
          const unwrappedAccountInfo = accountInfoOption.unwrap();
          const accountInfo = unwrappedAccountInfo.toHuman() as unknown as FrameSystemAccountInfo;
          const balance = accountInfo.data.free.toString().replaceAll(",", "");
          totalBalance = BigNumber(balance);
        }
        parseData(ledgerInfo, depositsInfo);
      })) as unknown as UnSubscription;

      vestedUnsubscription = (await apiPromise.query.accountMigration.vestings(
        selectedAccount,
        (vestingInfoOption: Option<Vec<PalletVestingVestingInfo>>) => {
          if (vestingInfoOption.isSome) {
            const unwrappedVestingInfo = vestingInfoOption.unwrap();
            const vestingInfoList = unwrappedVestingInfo.toHuman() as unknown as Vec<PalletVestingVestingInfo>;
            vestingInfoList.forEach((vesting) => {
              const lockedAmount = vesting.locked.toString().replaceAll(",", "");
              vestedAmountRing = vestedAmountRing.plus(lockedAmount);
            });
          }
          parseData(ledgerInfo, depositsInfo);
        }
      )) as unknown as UnSubscription;

      setLoadingLedger(false);
    };
    getStakingLedgerAndDeposits().catch((e) => {
      setStakedAssetDistribution({
        ring: {
          transferable: BigNumber(0),
          deposit: BigNumber(0),
          bonded: BigNumber(0),
          unbonded: BigNumber(0),
          unbonding: BigNumber(0),
          vested: BigNumber(0),
        },
        kton: {
          transferable: BigNumber(0),
          bonded: BigNumber(0),
          unbonded: BigNumber(0),
          unbonding: BigNumber(0),
        },
      });
      setLoadingLedger(false);
      console.log(e);
      //ignore
    });

    return () => {
      if (ledgerUnsubscription) {
        ledgerUnsubscription();
      }
      if (depositsUnsubscription) {
        depositsUnsubscription();
      }
      if (accountUnsubscription) {
        accountUnsubscription();
      }
      if (vestedUnsubscription) {
        vestedUnsubscription();
      }
    };
  }, [apiPromise, selectedAccount, currentBlock]);

  return {
    isLoadingLedger,
    stakedAssetDistribution,
  };
};

export default useLedger;
