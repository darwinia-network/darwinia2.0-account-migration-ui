import { useEffect, useRef, useState } from "react";

import {
  AssetDistribution,
  StakingLedger,
  CustomAccountInfoWithTripleRefCount,
  CustomDarwiniaBalanceLock,
} from "@darwinia/app-types";
import BigNumber from "bignumber.js";
import { ApiPromise } from "@polkadot/api";
import { UnSubscription } from "../storageProvider";
import useBlock from "./useBlock";
import { BN, BN_ZERO, bnMax } from "@polkadot/util";
import { Vec } from "@polkadot/types";

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

  const getUnbondingAmount = (currentBlock: number, stakingLedger: StakingLedger, isRing: boolean) => {
    let stakingLocks;
    if (isRing) {
      stakingLocks = stakingLedger.ringStakingLock;
    } else {
      stakingLocks = stakingLedger.ktonStakingLock;
    }

    if (!stakingLocks) {
      return new BN(0);
    }

    const unbondingItems = stakingLocks.unbondings.filter((item) => item.until.gt(new BN(currentBlock)));

    return unbondingItems.reduce((accumulatedValue, item) => {
      return accumulatedValue.add(item.amount);
    }, new BN(0));
  };

  const getUnbondedAmount = (currentBlock: number, stakingLedger: StakingLedger, isRing: boolean) => {
    let stakingLocks;
    if (isRing) {
      stakingLocks = stakingLedger.ringStakingLock;
    } else {
      stakingLocks = stakingLedger.ktonStakingLock;
    }

    if (!stakingLocks) {
      return new BN(0);
    }

    const unbondedItems = stakingLocks.unbondings.filter((item) => new BN(currentBlock).gte(item.until));

    return unbondedItems.reduce((accumulatedValue, item) => {
      return accumulatedValue.add(item.amount);
    }, new BN(0));
  };

  const getMaximum = (balanceLock: CustomDarwiniaBalanceLock, currentMaximum: BN) => {
    if (balanceLock.reasons && !balanceLock.reasons.isFee) {
      return bnMax(balanceLock.amount, currentMaximum);
    } else if (balanceLock.lockReasons && !balanceLock.lockReasons.isFee) {
      if (balanceLock.lockFor.isCommon) {
        return bnMax(balanceLock.lockFor.asCommon.amount, currentMaximum);
      } else if (balanceLock.lockFor.isStaking) {
        return bnMax(balanceLock.lockFor.asStaking.stakingAmount, currentMaximum);
      }
    }
    return currentMaximum;
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
      // get the total amount the account has
      const accountInfo = (await apiPromise.query.system.account(
        selectedAccount
      )) as unknown as CustomAccountInfoWithTripleRefCount;
      const { free: totalRING, freeKton: totalKTON } = accountInfo.data;

      const ringLocks =
        ((await apiPromise.query.balances.locks(selectedAccount)) as unknown as Vec<CustomDarwiniaBalanceLock>) ?? [];
      const ktonLocks =
        ((await apiPromise.query.kton.locks(selectedAccount)) as unknown as Vec<CustomDarwiniaBalanceLock>) ?? [];

      console.log("accountInfo=====", accountInfo);

      const stakingLedger = deriveStakingAccount.stakingLedger as StakingLedger;

      /*Ring calculations*/
      const allStakingRing = (stakingLedger.active || stakingLedger.activeRing).toBn();
      const lockedRing = stakingLedger.activeDepositRing.toBn();
      const bondedRing = allStakingRing.sub(lockedRing);
      const unbondingRing = getUnbondingAmount(currentBlock.number, stakingLedger, true);
      const unbondedRing = getUnbondedAmount(currentBlock.number, stakingLedger, true);
      let maxUnusableRING = BN_ZERO;
      ringLocks.forEach((item) => {
        maxUnusableRING = getMaximum(item, maxUnusableRING);
      });
      const availableRING = totalRING.sub(maxUnusableRING);

      console.log("locked RING=====", lockedRing.toString());
      console.log("bonded RING=====", bondedRing.toString());
      console.log("unbondingRing=====", unbondingRing.toString());
      console.log("unbondedRing=====", unbondedRing.toString());
      console.log("transferableRING====", availableRING.toString());

      let maxUnusableKTON = BN_ZERO;
      ktonLocks.forEach((item) => {
        maxUnusableKTON = getMaximum(item, maxUnusableKTON);
      });
      const bondedKton = stakingLedger.activeKton.toBn();
      const unbondedKton = getUnbondedAmount(currentBlock.number, stakingLedger, false);
      const unbondingKton = getUnbondingAmount(currentBlock.number, stakingLedger, false);
      const availableKTON = totalKTON.sub(maxUnusableKTON);

      console.log("bonded KTON=====", bondedKton.toString());
      console.log("unbondingKTON=====", unbondingKton.toString());
      console.log("unbondedKTON=====", unbondedKton.toString());
      console.log("transferableKTON====", availableKTON.toString());
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
