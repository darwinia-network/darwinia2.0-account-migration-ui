import BigNumber from "bignumber.js";
import { Collator, Deposit, StakingAsset } from "./staking";

export interface AssetDetail {
  bonded: BigNumber;
  totalStakingDeposit?: BigNumber;
}

export interface AssetDistribution {
  ring: AssetDetail;
  kton: AssetDetail;
}

export interface AssetBalance {
  ring: BigNumber;
  kton: BigNumber;
}

export interface StorageCtx {
  migrationAssetDistribution: AssetDistribution | undefined;
  isLoadingLedger: boolean | undefined;
}
