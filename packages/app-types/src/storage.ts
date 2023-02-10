import BigNumber from "bignumber.js";

export interface AssetDetail {
  deposit?: BigNumber;
  transferable: BigNumber;
  bonded: BigNumber;
  unbonded: BigNumber;
  unbonding: BigNumber;
  vested?: BigNumber;
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
  isLoadingMigratedLedger: boolean | undefined;
  retrieveMigratedAsset: (sourceAccountId: string, parentBlockHash: string) => void;
  migratedAssetDistribution: AssetDistribution | undefined;
  checkEVMAccountStatus: (accountId: string) => Promise<void>;
  isAccountFree: boolean | undefined;
}
