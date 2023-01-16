import BigNumber from "bignumber.js";

export interface AssetDetail {
  locked?: BigNumber;
  transferable: BigNumber;
  bonded: BigNumber;
  unbonded: BigNumber;
  unbonding: BigNumber;
  vested?: BigNumber;
  total: BigNumber;
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
