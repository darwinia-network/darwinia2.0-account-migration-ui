import { Struct, Vec, Enum, u128, u32 } from "@polkadot/types";
import { RegistrationJudgement } from "@polkadot/types/interfaces";
import { AccountId, Balance, BlockNumber } from "@polkadot/types/interfaces";
import BigNumber from "bignumber.js";

export interface DarwiniaStakingLedgerEncoded extends Struct {
  stakedRing: u128;
  stakedKton: u128;
  stakedDeposits?: Uint8Array;
}

export interface DarwiniaStakingLedger {
  stakedRing: BigNumber;
  stakedKton: BigNumber;
  stakedDeposits?: number[];
  unstakingDeposits?: [number, number][];
  unstakingRing?: [number, number][];
  unstakingKton?: [number, number][];
}

export interface DepositEncoded extends Struct {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  id: u128;
  value: u128;
  expiredTime: u128;
}

export interface Deposit {
  id: number;
  accountId: string;
  value: BigNumber;
  reward: BigNumber;
  startTime: number;
  expiredTime: number;
  canEarlyWithdraw: boolean;
}

export interface PalletVestingVestingInfo extends Struct {
  readonly locked: u128;
  readonly perBlock: u128;
  readonly startingBlock: u32;
}

export interface DarwiniaAccountMigrationAssetAccount extends Struct {
  balance: u128;
}
