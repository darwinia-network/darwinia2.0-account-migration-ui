import { Compact, Struct, u64, Vec } from "@polkadot/types";
import { RegistrationJudgement } from "@polkadot/types/interfaces";
import { AccountId, Balance, EraIndex, BlockNumber } from "@polkadot/types/interfaces";

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
