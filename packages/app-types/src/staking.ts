import { Compact, Struct, u64, Vec, Enum } from "@polkadot/types";
import { RegistrationJudgement } from "@polkadot/types/interfaces";
import {
  AccountData,
  AccountId,
  Balance,
  EraIndex,
  BlockNumber,
  AccountInfoWithTripleRefCount,
  BalanceLock,
  Reasons,
} from "@polkadot/types/interfaces";

export interface PalletIdentityIdentityInfo extends Struct {
  display?: string;
  displayParent?: string;
  email?: string;
  image?: string;
  legal?: string;
  other?: Record<string, string>;
  parent?: AccountId;
  pgp?: string;
  riot?: string;
  twitter?: string;
  web?: string;
}

export interface PalletIdentityRegistration extends Struct {
  judgements: Vec<RegistrationJudgement>;
  info: PalletIdentityIdentityInfo;
}

type StakingLockUnbonding = {
  amount: Balance;
  until: BlockNumber;
};

export type StakingLock = {
  stakingAmount: Balance;
  unbondings: StakingLockUnbonding[];
};

export interface TimeDepositItem extends Struct {
  readonly value: Balance;
  readonly startTime: u64; //time in seconds
  readonly expireTime: u64; //time in seconds
}

export interface StakingLedger extends Struct {
  readonly stash: AccountId;
  readonly active: Compact<Balance>;
  readonly activeRing?: Compact<Balance>;
  readonly activeDepositRing: Compact<Balance>;
  readonly activeKton: Compact<Balance>;
  readonly depositItems: Vec<TimeDepositItem>;
  readonly ringStakingLock: StakingLock;
  readonly ktonStakingLock: StakingLock;
  readonly claimedRewards: Vec<EraIndex>;
}

export interface CustomAccountData extends AccountData {
  freeKton: Balance;
}

export interface CustomAccountInfoWithTripleRefCount extends AccountInfoWithTripleRefCount {
  data: CustomAccountData;
}

export interface Common extends Struct {
  readonly amount: Balance;
}

export interface LockFor extends Enum {
  readonly isCommon: boolean;
  readonly asCommon: Common;
  readonly isStaking: boolean;
  readonly asStaking: StakingLock;
  readonly type: "Common" | "Staking";
}

export interface CustomDarwiniaBalanceLock extends BalanceLock {
  lockReasons: Reasons;
  lockFor: LockFor;
}
