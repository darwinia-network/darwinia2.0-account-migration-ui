import { useEffect, useRef, useState } from "react";

import { AssetDistribution, StakingLedger } from "@darwinia/app-types";
import BigNumber from "bignumber.js";
import { ApiPromise } from "@polkadot/api";
import { UnSubscription } from "../storageProvider";
import useBlock from "./useBlock";
import { BlockNumber } from "@polkadot/types/interfaces";
import { BN } from "@polkadot/util";

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

  const getUnbondingAmount = (currentBlock: BlockNumber, stakingLedger: StakingLedger, isRing: boolean) => {
    let stakingLocks;
    if (isRing) {
      stakingLocks = stakingLedger.ringStakingLock;
    } else {
      stakingLocks = stakingLedger.ktonStakingLock;
    }

    if (!stakingLocks) {
      return new BN(0);
    }

    const unbondingItems = stakingLocks.unbondings.filter((item) => item.until.gt(currentBlock));

    return unbondingItems.reduce((accumulatedValue, item) => {
      return accumulatedValue.add(item.amount);
    }, new BN(0));
  };

  /*Get staking ledger and deposits. The data that comes back from the server needs a lot of decoding */
  useEffect(() => {
    let depositsUnsubscription: UnSubscription | undefined;
    let ledgerUnsubscription: UnSubscription | undefined;
    const getStakingLedgerAndDeposits = async () => {
      if (!selectedAccount || !apiPromise || !currentBlock) {
        return;
      }
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        setLoadingLedger(true);
      }

      const deriveStakingAccount = await apiPromise.derive.staking.account(selectedAccount);
      const stakingLedger = deriveStakingAccount.stakingLedger as StakingLedger;
      console.log("stakingUnsubscription", stakingLedger);
      /*Ring calculations*/
      const allStakingRing = (stakingLedger.active || stakingLedger.activeRing).toBn();
      const lockedRing = stakingLedger.activeDepositRing.toBn();
      const bondedRing = allStakingRing.sub(lockedRing);
      console.log("locked=====", lockedRing.toString());
      console.log("bonded=====", bondedRing.toString());
    };
    getStakingLedgerAndDeposits().catch((e) => {
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
    };
  }, [apiPromise, selectedAccount, currentBlock]);

  return {
    isLoadingLedger,
    stakedAssetDistribution,
  };
};

export default useLedger;
